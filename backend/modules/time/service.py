# backend/modules/time/service.py
from datetime import datetime, timezone, timedelta
from sqlalchemy import and_, func
from extensions import db
from core.models import TimeEntry, User, Task, TimeEntryKindEnum, Shift, Notification


def get_open_entry(user_id, tenant_id=None):
    q = TimeEntry.query.filter_by(user_id=user_id, end_time=None)
    if tenant_id is not None:
        q = q.filter_by(tenant_id=tenant_id)
    return q.first()

def clock_in(user_id, tenant_id, start_time=None, kind=TimeEntryKindEnum.REGULAR, task_id=None, notes=None):
    """Create an open TimeEntry. start_time defaults to now UTC."""
    if get_open_entry(user_id, tenant_id):
        raise ValueError("User already clocked in.")

    if start_time is None:
        start_time = datetime.now(timezone.utc)

    entry = TimeEntry(
        tenant_id=tenant_id,
        user_id=user_id,
        kind=kind,
        start_time=start_time,
        task_id=task_id,
        notes=notes
    )
    db.session.add(entry)
    db.session.commit()
    return entry

def clock_out(user_id, end_time=None, notes=None):
    """Close the open entry for user_id. end_time defaults to now UTC."""
    entry = get_open_entry(user_id)
    if not entry:
        raise ValueError("No open entry to clock out.")

    if end_time is None:
        end_time = datetime.now(timezone.utc)

    entry.end_time = end_time
    entry.duration = (end_time - entry.start_time).total_seconds() / 3600.0  # hours

    # Overtime detection
    if entry.duration and entry.duration > 8 and entry.kind == TimeEntryKindEnum.REGULAR:
        entry.kind = TimeEntryKindEnum.OVERTIME
        # send notification to manager(s) or tenant admin
        try:
            from modules.notifications.service import create_notification
            create_notification(entry.tenant_id, entry.user_id, f"Overtime detected: {entry.duration:.1f} hours on {entry.start_time.date()}")
        except Exception:
            # swallow notification errors to avoid breaking clock_out
            pass

    if notes:
        entry.notes = (entry.notes or "") + " " + str(notes)

    db.session.commit()
    return entry

def get_current_status(user_id, tenant_id):
    open_entry = get_open_entry(user_id)
    last_entry = TimeEntry.query.filter_by(user_id=user_id, tenant_id=tenant_id).order_by(TimeEntry.end_time.desc()).first()
    
    if open_entry:
        elapsed = (datetime.now(timezone.utc) - open_entry.start_time).total_seconds() / 3600.0
        return {
            'is_clocked_in': True,
            'current_entry': {'id': open_entry.id, 'start_time': open_entry.start_time.isoformat(), 'elapsed_hours': elapsed},
            'last_clock_out': last_entry.end_time.isoformat() if last_entry and last_entry.end_time else None
        }
    return {'is_clocked_in': False, 'last_clock_out': last_entry.end_time.isoformat() if last_entry else None}

def get_timesheet(user_id, tenant_id, start_date=None, end_date=None):
    """Return list of time entries with durations. If start/end not provided defaults to last 7 days."""
    if not start_date or not end_date:
        start_date = datetime.now(timezone.utc) - timedelta(days=7)
        end_date = datetime.now(timezone.utc)
    else:
        start_date = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_date = datetime.fromisoformat(end_date.replace("Z", "+00:00"))

    if start_date > end_date:
        raise ValueError("Start date must be before end date")

    # treat end_date as exclusive by adding one day to include full last day
    end_date_next = end_date + timedelta(days=1)

    timesheet = (
        TimeEntry.query.filter_by(user_id=user_id, tenant_id=tenant_id)
        .filter(TimeEntry.start_time >= start_date, TimeEntry.start_time < end_date_next)
        .outerjoin(Task)
        .with_entities(
            TimeEntry.id,
            TimeEntry.start_time,
            TimeEntry.end_time,
            TimeEntry.duration,
            TimeEntry.kind,
            TimeEntry.is_approved,
            TimeEntry.notes,
            Task.title.label("task_title")
        )
        .all()
    )

    # ensure durations are numeric; if missing, compute when possible
    result = []
    for entry in timesheet:
        duration = entry.duration
        if duration is None and entry.end_time:
            duration = (entry.end_time - entry.start_time).total_seconds() / 3600.0
        result.append({
            "id": entry.id,
            "start_time": entry.start_time.isoformat(),
            "end_time": entry.end_time.isoformat() if entry.end_time else None,
            "duration": float(duration) if duration is not None else None,
            "kind": entry.kind.value,
            "is_approved": entry.is_approved,
            "notes": entry.notes,
            "task_title": entry.task_title or "N/A"
        })

    return result

def get_summary_report(tenant_id, start_date=None, end_date=None):
    """Generate a summary report for all users in a tenant."""
    if not start_date or not end_date:
        start_date = datetime.now(timezone.utc) - timedelta(days=7)
        end_date = datetime.now(timezone.utc)
    else:
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

    if start_date > end_date:
        raise ValueError("Start date must be before end date")

    summary = (
        db.session.query(
            TimeEntry.kind,
            TimeEntry.is_approved,
            func.sum(TimeEntry.duration).label('total_hours')
        )
        .filter(TimeEntry.tenant_id == tenant_id)
        .filter(TimeEntry.start_time >= start_date, TimeEntry.start_time <= end_date)
        .group_by(TimeEntry.kind, TimeEntry.is_approved)
        .all()
    )

    return {
        'summary': [
            {
                'kind': entry.kind.value,
                'is_approved': entry.is_approved,
                'total_hours': float(entry.total_hours) if entry.total_hours else 0.0
            } for entry in summary
        ],
        'unapproved_count': TimeEntry.query.filter_by(
            tenant_id=tenant_id,
            is_approved=False
        ).filter(TimeEntry.start_time >= start_date, TimeEntry.start_time <= end_date).count()
    }

def validate_overlaps(tenant_id, start_time, end_time):
    """Check for overlapping shifts for a given tenant."""
    overlapping_shifts = Shift.query.filter(
        Shift.tenant_id == tenant_id,
        Shift.start_time < end_time,
        Shift.end_time > start_time
    ).all()
    return len(overlapping_shifts) > 0

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
        is_recurring=is_recurring
    )
    db.session.add(shift)
    db.session.commit()
    return shift

def assign_users(shift_id, user_ids):
    """Assign users to a shift."""
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
    """Delete a shift and its assignments."""
    shift = Shift.query.get_or_404(shift_id)
    db.session.delete(shift)
    db.session.commit()
    return {"message": f"Deleted shift {shift_id}"}

def create_notification(tenant_id, user_id, message):
    """Create a notification for a user."""
    notification = Notification(
        tenant_id=tenant_id,
        user_id=user_id,
        message=message,
        created_at=datetime.now(timezone.utc),
        is_read=False
    )
    db.session.add(notification)
    db.session.commit()
    return notification

def check_missing_clockouts(tenant_id, threshold_hours=12):
    """Check for open entries exceeding threshold and create notifications."""
    threshold = datetime.now(timezone.utc) - timedelta(hours=threshold_hours)
    open_entries = TimeEntry.query.filter_by(tenant_id=tenant_id, end_time=None).all()
    for entry in open_entries:
        if entry.start_time < threshold:
            create_notification(tenant_id, entry.user_id, f"Missing clock-out detected: Open since {entry.start_time.isoformat()}")



def get_exceptions(tenant_id, threshold_hours=12):
    """Return open entries older than threshold_hours and overtime entries (if needed)."""
    threshold = datetime.now(timezone.utc) - timedelta(hours=threshold_hours)
    missing = TimeEntry.query.filter(TimeEntry.tenant_id == tenant_id, TimeEntry.end_time == None, TimeEntry.start_time < threshold).all()

    # optional: include overtime entries flagged in recent period
    overtime = TimeEntry.query.filter(TimeEntry.tenant_id == tenant_id, TimeEntry.duration != None, TimeEntry.duration > 8).all()

    # make response compact (avoid huge payload)
    missing_list = [{
        "id": e.id, "user_id": e.user_id, "start_time": e.start_time.isoformat(), "kind": e.kind.value
    } for e in missing]

    overtime_list = [{
        "id": e.id, "user_id": e.user_id, "start_time": e.start_time.isoformat(), "duration": e.duration
    } for e in overtime]

    return {"missing_clockouts": missing_list, "overtime": overtime_list}


def backfill_durations():
    rows = TimeEntry.query.filter(TimeEntry.end_time != None, TimeEntry.duration == None).all()
    for r in rows:
        r.duration = (r.end_time - r.start_time).total_seconds() / 3600.0
    db.session.commit()
    return len(rows)