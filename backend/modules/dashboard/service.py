# backend/modules/dashboard/service.py
from datetime import datetime, timedelta
from sqlalchemy import or_, func

from core.models import TimeEntry, Task, InventoryItem, TaskStatusEnum


def active_employees_count(tenant_id: str) -> int:
    """
    Count employees who are currently active (clocked in).
    """
    now = datetime.utcnow()
    return (
        TimeEntry.query.filter(
            TimeEntry.tenant_id == tenant_id,
            TimeEntry.start_time <= now,
            or_(
                TimeEntry.end_time == None,  # still clocked in
                TimeEntry.end_time >= now   # working within this time range
            )
        )
        .with_entities(func.count(func.distinct(TimeEntry.user_id)))
        .scalar()
        or 0
    )


def jobs_completed_today(tenant_id: str) -> int:
    """
    Count how many jobs (tasks) were completed today.
    """
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    return (
        Task.query.filter(
            Task.tenant_id == tenant_id,
            Task.status == TaskStatusEnum.COMPLETED,
            Task.completed_at >= today_start,
            Task.completed_at < today_end
        )
        .count()
    )


def low_stock_items(tenant_id: str, limit: int = 3):
    """
    Fetch low-stock inventory items (qty <= reorder point).
    """
    return (
        InventoryItem.query.filter(
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.qty_on_hand <= InventoryItem.reorder_point
        )
        .order_by(InventoryItem.qty_on_hand.asc())
        .limit(limit)
        .all()
    )


def overdue_jobs_count(tenant_id: str) -> int:
    """
    Count overdue jobs (tasks past due date and not completed/cancelled).
    """
    today = datetime.utcnow().date()
    return (
        Task.query.filter(
            Task.tenant_id == tenant_id,
            Task.due_date < today,
            Task.status.notin_([TaskStatusEnum.COMPLETED, TaskStatusEnum.CANCELLED])
        )
        .count()
    )


def revenue_today(tenant_id: str) -> float:
    """
    Stub for revenue snapshot. If Invoice model exists, query it.
    Otherwise, return 0.0 or a mock value for now.
    """
    try:
        from core.models import Invoice  # if you have it in old routes
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        return (
            Invoice.query.filter(
                Invoice.tenant_id == tenant_id,
                Invoice.created_at >= today_start,
                Invoice.created_at < today_end
            )
            .with_entities(func.sum(Invoice.amount))
            .scalar()
            or 0.0
        )
    except ImportError:
        # If Invoice model isn't migrated yet, return placeholder
        return 0.0
