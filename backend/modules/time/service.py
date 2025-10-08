from datetime import datetime, timezone, timedelta
from sqlalchemy import func
from extensions import db
from core.models import TimeEntry, User, Task, TimeEntryKindEnum, Shift, Notification


# -----------------------------
# 🔧 UTC helper
# -----------------------------
def utcnow():
    """Return current UTC datetime (tz-aware)."""
    return datetime.now(timezone.utc)


# -----------------------------
# 🧩 Datetime parsing
# -----------------------------
def _parse_iso_datetime(value):
    """
    Safely parse ISO or timestamp into a tz-aware datetime (UTC).
    Accepts:
      - None → None
      - datetime (adds tz if missing)
      - ISO string (with/without Z)
      - numeric timestamp (seconds)
    """
    if value is None:
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    if isinstance(value, str):
        s = value.strip()
        try:
            return datetime.fromisoformat(s.replace("Z", "+00:00"))
        except Exception:
            pass
        try:
            return datetime.fromtimestamp(float(s), tz=timezone.utc)
        except Exception:
            pass
        raise ValueError(f"Invalid datetime format: {value!r}")
    raise ValueError("Unsupported datetime type for parsing")


# -----------------------------
# ⏱️ Time tracking core
# -----------------------------
def get_open_entry(user_id, tenant_id=None):
    q = TimeEntry.query.filter_by(user_id=user_id, end_time=None)
    if tenant_id:
        q = q.filter_by(tenant_id=tenant_id)
    return q.first()


def clock_in(user_id, tenant_id, start_time=None, kind=TimeEntryKindEnum.REGULAR, task_id=None, notes=None):
    """Create an open TimeEntry. start_time defaults to now UTC."""
    if get_open_entry(user_id, tenant_id):
        raise ValueError("User already clocked in.")

    start_time = _parse_iso_datetime(start_time) if start_time else utcnow()

    if isinstance(kind, str):
        try:
            kind = TimeEntryKindEnum(kind)
        except Exception:
            kind = TimeEntryKindEnum.REGULAR

    entry = TimeEntry(
        tenant_id=tenant_id,
        user_id=user_id,
        kind=kind,
        start_time=start_time,
        task_id=task_id,
        notes=notes,
    )
    db.session.add(entry)
    db.session.commit()
    return entry


def clock_out(user_id, end_time=None, notes=None):
    """Close the open entry for user_id. end_time defaults to now UTC."""
    entry = get_open_entry(user_id)
    if not entry:
        raise ValueError("No open entry to clock out.")

    end_time = _parse_iso_datetime(end_time) if end_time else utcnow()

    if end_time.tzinfo is None:
        end_time = end_time.replace(tzinfo=timezone.utc)
    if entry.start_time.tzinfo is None:
        entry.start_time = entry.start_time.replace(tzinfo=timezone.utc)

    entry.end_time = end_time
    entry.duration = (end_time - entry.start_time).total_seconds() / 3600.0

    # Detect overtime and notify
    if entry.duration and entry.duration > 8 and entry.kind == TimeEntryKindEnum.REGULAR:
        entry.kind = TimeEntryKindEnum.OVERTIME
        try:
            from modules.notifications.service import create_notification
            create_notification(
                entry.tenant_id,
                entry.user_id,
                f"Overtime detected: {entry.duration:.1f} hours on {entry.start_time.date()}",
            )
        except Exception:
            pass  # don't break clock_out if notifications fail

    if notes:
        entry.notes = (entry.notes or "") + " " + str(notes)

    db.session.commit()
    return entry


# -----------------------------
# 🕒 Current clock status
# -----------------------------
def get_current_status(user_id, tenant_id):
    open_entry = get_open_entry(user_id)
    last_entry = (
        TimeEntry.query.filter_by(user_id=user_id, tenant_id=tenant_id)
        .order_by(TimeEntry.end_time.desc())
        .first()
    )

    if open_entry:
        elapsed = (utcnow() - open_entry.start_time).total_seconds() / 3600.0
        return {
            "is_clocked_in": True,
            "current_entry": {
                "id": open_entry.id,
                "start_time": open_entry.start_time.isoformat(),
                "elapsed_hours": elapsed,
            },
            "last_clock_out": last_entry.end_time.isoformat() if last_entry and last_entry.end_time else None,
        }

    return {
        "is_clocked_in": False,
        "last_clock_out": last_entry.end_time.isoformat() if last_entry and last_entry.end_time else None,
    }


# -----------------------------
# 📅 Timesheets
# -----------------------------
def get_timesheet(user_id, tenant_id, start_date=None, end_date=None):
    """
    Return list of time entries with user and task info.
    Defaults to current week (Mon–Sun) if no range provided.
    Includes timezone normalization to ensure correct filtering.
    """
    now = utcnow()

    # Default range → current week (Monday–Sunday)
    if not start_date or not end_date:
        start_of_week = now - timedelta(days=now.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        start_date, end_date = start_of_week, end_of_week
    else:
        start_date = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_date = datetime.fromisoformat(end_date.replace("Z", "+00:00"))

    # Validate range
    if start_date > end_date:
        raise ValueError("Start date must be before end date")

    # ✅ Normalize to UTC full-day boundaries
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)

    end_date_next = end_date + timedelta(seconds=1)

    # ✅ Include user info in the join
    entries = (
        TimeEntry.query.filter_by(tenant_id=tenant_id)
        .filter(TimeEntry.user_id == user_id)
        .filter(TimeEntry.start_time >= start_date, TimeEntry.start_time < end_date_next)
        .outerjoin(Task, Task.id == TimeEntry.task_id)
        .outerjoin(User, User.id == TimeEntry.user_id)
        .with_entities(
            TimeEntry.id,
            TimeEntry.start_time,
            TimeEntry.end_time,
            TimeEntry.duration,
            TimeEntry.kind,
            TimeEntry.is_approved,
            TimeEntry.notes,
            Task.title.label("task_title"),
            User.full_name.label("user_name"),
            User.email.label("user_email"),
        )
        .order_by(TimeEntry.start_time.desc())
        .all()
    )

    result = []
    for e in entries:
        dur = e.duration
        if dur is None and e.end_time:
            dur = (e.end_time - e.start_time).total_seconds() / 3600.0

        result.append(
            {
                "id": e.id,
                "start_time": e.start_time.isoformat(),
                "end_time": e.end_time.isoformat() if e.end_time else None,
                "duration": round(float(dur or 0.0), 2),
                "kind": e.kind.value,
                "is_approved": e.is_approved,
                "notes": e.notes,
                "task_title": e.task_title or "N/A",
                "user_name": e.user_name or "Unknown",
                "user_email": e.user_email or "",
            }
        )

    return result




# -----------------------------
# 📊 Summary reports
# -----------------------------
def get_summary_report(tenant_id, start_date=None, end_date=None):
    """Generate a summary report for all users in a tenant."""
    if not start_date or not end_date:
        start_date, end_date = utcnow() - timedelta(days=7), utcnow()
    else:
        start_date = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_date = datetime.fromisoformat(end_date.replace("Z", "+00:00"))

    if start_date > end_date:
        raise ValueError("Start date must be before end date")

    summary = (
        db.session.query(
            TimeEntry.kind,
            TimeEntry.is_approved,
            func.sum(TimeEntry.duration).label("total_hours"),
        )
        .filter(TimeEntry.tenant_id == tenant_id)
        .filter(TimeEntry.start_time >= start_date, TimeEntry.start_time <= end_date)
        .group_by(TimeEntry.kind, TimeEntry.is_approved)
        .all()
    )

    return {
        "summary": [
            {
                "kind": e.kind.value,
                "is_approved": e.is_approved,
                "total_hours": float(e.total_hours or 0.0),
            }
            for e in summary
        ],
        "unapproved_count": TimeEntry.query.filter_by(
            tenant_id=tenant_id, is_approved=False
        )
        .filter(TimeEntry.start_time >= start_date, TimeEntry.start_time <= end_date)
        .count(),
    }


# -----------------------------
# 👷 Shift management
# -----------------------------
def validate_overlaps(tenant_id, start_time, end_time):
    overlapping = (
        Shift.query.filter(
            Shift.tenant_id == tenant_id,
            Shift.start_time < end_time,
            Shift.end_time > start_time,
        ).count()
    )
    return overlapping > 0


def create_shift(tenant_id, start_time, end_time, role=None, team=None, description=None, is_recurring=False):
    """Create a new shift with overlap validation."""
    if start_time >= end_time:
        raise ValueError("Start time must be before end time")

    if validate_overlaps(tenant_id, start_time, end_time):
        raise ValueError("Shift overlaps with an existing shift for this tenant")

    shift = Shift(
        tenant_id=tenant_id,
        start_time=start_time,
        end_time=end_time,
        role=role,
        team=team,
        description=description,
        is_recurring=is_recurring,
    )
    db.session.add(shift)
    db.session.commit()
    return shift


def assign_users(shift_id, user_ids):
    shift = Shift.query.get_or_404(shift_id)
    users = User.query.filter(User.id.in_(user_ids)).all()
    if not users:
        raise ValueError("No valid users found for assignment")

    for user in users:
        if user not in shift.assignees:
            shift.assignees.append(user)
    db.session.commit()
    return {"message": f"Assigned {len(users)} users to shift {shift_id}"}


def delete_shift(shift_id):
    shift = Shift.query.get_or_404(shift_id)
    db.session.delete(shift)
    db.session.commit()
    return {"message": f"Deleted shift {shift_id}"}


# -----------------------------
# 🔔 Notifications + Health checks
# -----------------------------
def create_notification(tenant_id, user_id, message):
    notification = Notification(
        tenant_id=tenant_id,
        user_id=user_id,
        message=message,
        created_at=utcnow(),
        is_read=False,
    )
    db.session.add(notification)
    db.session.commit()
    return notification


def check_missing_clockouts(tenant_id, threshold_hours=12):
    """Find open entries older than threshold and create notifications."""
    threshold = utcnow() - timedelta(hours=threshold_hours)
    open_entries = TimeEntry.query.filter_by(tenant_id=tenant_id, end_time=None).all()
    for e in open_entries:
        if e.start_time < threshold:
            create_notification(
                tenant_id, e.user_id, f"Missing clock-out since {e.start_time.isoformat()}"
            )


def get_exceptions(tenant_id, threshold_hours=12):
    """Return open entries older than threshold and overtime entries."""
    threshold = utcnow() - timedelta(hours=threshold_hours)

    missing = TimeEntry.query.filter(
        TimeEntry.tenant_id == tenant_id,
        TimeEntry.end_time == None,
        TimeEntry.start_time < threshold,
    ).all()

    overtime = TimeEntry.query.filter(
        TimeEntry.tenant_id == tenant_id,
        TimeEntry.duration != None,
        TimeEntry.duration > 8,
    ).all()

    return {
        "missing_clockouts": [
            {"id": e.id, "user_id": e.user_id, "start_time": e.start_time.isoformat(), "kind": e.kind.value}
            for e in missing
        ],
        "overtime": [
            {"id": e.id, "user_id": e.user_id, "start_time": e.start_time.isoformat(), "duration": e.duration}
            for e in overtime
        ],
    }


def backfill_durations():
    """Recompute missing durations for completed entries."""
    rows = TimeEntry.query.filter(TimeEntry.end_time != None, TimeEntry.duration == None).all()
    for r in rows:
        r.duration = (r.end_time - r.start_time).total_seconds() / 3600.0
    db.session.commit()
    return len(rows)
