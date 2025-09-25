from modules.dashboard.service import (
    active_employees_count,
    jobs_completed_today,
    low_stock_items,
)
from core.models import User, TimeEntry, Task, InventoryItem, TaskStatusEnum
from datetime import datetime, timedelta

def test_active_employees_count(db):
    u = User(tenant_id="t1", email="emp@example.com", full_name="Emp")
    db.session.add(u)
    db.session.commit()

    entry = TimeEntry(
        tenant_id="t1",
        user_id=u.id,
        start_time=datetime.utcnow() - timedelta(hours=1),
        end_time=datetime.utcnow() + timedelta(hours=1),
    )
    db.session.add(entry)
    db.session.commit()

    assert active_employees_count("t1") == 1

def test_jobs_completed_today(db):
    t = Task(
        tenant_id="t1",
        title="Completed Task",
        status=TaskStatusEnum.COMPLETED,
        completed_at=datetime.utcnow(),
    )
    db.session.add(t)
    db.session.commit()

    assert jobs_completed_today("t1") == 1

def test_low_stock_items(db):
    item1 = InventoryItem(tenant_id="t1", sku="A", name="Low", qty_on_hand=2, reorder_point=5)
    item2 = InventoryItem(tenant_id="t1", sku="B", name="Okay", qty_on_hand=10, reorder_point=5)
    db.session.add_all([item1, item2])
    db.session.commit()

    results = low_stock_items("t1")
    assert item1 in results
    assert item2 not in results
