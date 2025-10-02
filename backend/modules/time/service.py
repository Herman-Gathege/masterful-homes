# backend/modules/time/service.py
from datetime import datetime, timezone, timedelta
from sqlalchemy import and_, func
from extensions import db
from core.models import TimeEntry, User, Task, TimeEntryKindEnum, Shift, Notification

def get_open_entry(user_id):
    """Check for open TimeEntry (end_time is None)."""
    return TimeEntry.query.filter_by(user_id=user_id, end_time=None).first()

def clock_in(user_id, tenant_id, start_time, kind=TimeEntryKindEnum.REGULAR, task_id=None, notes=None):
    if get_open_entry(user_id):
        raise ValueError("User already clocked in.")
    
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

def clock_out(user_id, end_time, notes=None):
    entry = get_open_entry(user_id)
    if not entry:
        raise ValueError("No open entry to clock out.")
    
    entry.end_time = end_time
    entry.duration = (end_time - entry.start_time).total_seconds() / 3600.0  # Hours
    
    if entry.duration > 8 and entry.kind == TimeEntryKindEnum.REGULAR:
        entry.kind = TimeEntryKindEnum.OVERTIME
        create_notification(entry.tenant_id, entry.user_id, f"Overtime detected: {entry.duration:.1f} hours on {entry.start_time.date()}")

    if notes:
        entry.notes = (entry.notes or '') + ' ' + notes
    
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
    """Generate a timesheet for a user over a period."""
    if not start_date or not end_date:
        start_date = datetime.now(timezone.utc) - timedelta(days=7)
        end_date = datetime.now(timezone.utc)
    else:
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

    if start_date > end_date:
        raise ValueError("Start date must be before end date")

    timesheet = (
        TimeEntry.query.filter_by(user_id=user_id, tenant_id=tenant_id)
        .filter(TimeEntry.start_time >= start_date, TimeEntry.start_time <= end_date)
        .outerjoin(Task)
        .with_entities(
            TimeEntry.id,
            TimeEntry.start_time,
            TimeEntry.end_time,
            TimeEntry.duration,
            TimeEntry.kind,
            TimeEntry.is_approved,
            TimeEntry.notes,
            Task.title.label('task_title')
        )
        .all()
    )

    return [
        {
            'id': entry.id,
            'start_time': entry.start_time.isoformat(),
            'end_time': entry.end_time.isoformat() if entry.end_time else None,
            'duration': entry.duration,
            'kind': entry.kind.value,
            'is_approved': entry.is_approved,
            'notes': entry.notes,
            'task_title': entry.task_title if entry.task_title else 'N/A'
        } for entry in timesheet
    ]

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