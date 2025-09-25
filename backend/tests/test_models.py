# tests/test_models.py
from core.models import User, Task, TaskStatusEnum


def test_create_user(db):
    u = User(tenant_id="t1", email="x@example.com", full_name="Test User")
    db.session.add(u)
    db.session.commit()

    found = User.query.filter_by(email="x@example.com").one()
    assert found.full_name == "Test User"


def test_update_role(db):
    u = User(tenant_id="t1", email="role@example.com", full_name="Role User", role="technician")
    db.session.add(u)
    db.session.commit()

    u.role = "manager"
    db.session.commit()

    refreshed = User.query.get(u.id)
    assert refreshed.role == "manager"


def test_task_with_assignment(db):
    u = User(tenant_id="t1", email="assign@example.com", full_name="Assignee")
    t = Task(tenant_id="t1", title="Test Task", status=TaskStatusEnum.OPEN)

    db.session.add_all([u, t])
    db.session.commit()

    # ✅ Properly assign user via many-to-many relationship
    t.assignees.append(u)
    db.session.commit()

    # Assertions: both sides of the relationship should work
    assert u in t.assignees
    assert t in u.tasks
