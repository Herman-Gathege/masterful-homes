from datetime import datetime, timezone, timedelta
from sqlalchemy import and_, func
from extensions import db
from core.models import TimeEntry, User, Task, TimeEntryKindEnum, Shift

def get_open_entry(user_id):
    """Check for open TimeEntry (end_time is None)."""
    return TimeEntry.query.filter_by(user_id=user_id, end_time=None).first()

def clock_in(user_id, tenant_id, kind=TimeEntryKindEnum.REGULAR, task_id=None, notes=None):
    if get_open_entry(user_id):
        raise ValueError("User already clocked in.")
    
    entry = TimeEntry(
        tenant_id=tenant_id,
        user_id=user_id,
        kind=kind,
        start_time=datetime.now(timezone.utc),
        task_id=task_id,
        notes=notes
    )
    db.session.add(entry)
    db.session.commit()
    return entry

def clock_out(user_id, notes=None):
    entry = get_open_entry(user_id)
    if not entry:
        raise ValueError("No open entry to clock out.")
    
    now = datetime.now(timezone.utc)
    entry.end_time = now
    entry.duration = (now - entry.start_time).total_seconds() / 3600.0  # Hours
    
    if entry.duration > 8 and entry.kind == TimeEntryKindEnum.REGULAR:
        entry.kind = TimeEntryKindEnum.OVERTIME
    
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