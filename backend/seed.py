# backend/seed.py
import random
import calendar
from datetime import datetime, timedelta
from faker import Faker
from flask_bcrypt import Bcrypt

from main import create_app
from extensions import db
from core.models import User, Task, TimeEntry, InventoryItem, Notification, AuditLog

fake = Faker()
bcrypt = Bcrypt()
TENANT = "tenant_abc"


def seed_users():
    """Seed core business roles + extra demo users."""
    roles = [
        ("superadmin", "admin@masterfulhomes.com", "admin123", "superadmin"),
        ("manager1", "manager@masterfulhomes.com", "manager123", "manager"),
        ("finance1", "finance@masterfulhomes.com", "finance123", "finance"),
        ("tech1", "tech1@masterfulhomes.com", "tech123", "technician"),
        ("tech2", "tech2@masterfulhomes.com", "tech123", "technician"),
    ]

    for username, email, password, role in roles:
        if not User.query.filter_by(email=email).first():
            user = User(
                tenant_id=TENANT,
                email=email,
                full_name=username,
                role=role,
                department="Core",
                team="Team 1",
                location="Nairobi",
                is_active=True,
                created_at=datetime.utcnow(),
                last_login=datetime.utcnow(),
            )
            # add password hash if your User model has a column for it
            try:
                user.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
            except Exception:
                pass

            db.session.add(user)
            print(f"✅ {role.capitalize()} {username} created")

    db.session.commit()


def seed_tasks(n=50):
    """Create demo tasks spread across statuses."""
    statuses = ["open", "in_progress", "completed", "overdue"]
    for i in range(n):
        task = Task(
            tenant_id=TENANT,
            title=f"Task {i}",
            description=fake.sentence(),
            status=random.choice(statuses),
            due_date=(datetime.utcnow() + timedelta(days=random.randint(-3, 7))).date(),
            created_by=random.choice(User.query.all()).id if User.query.first() else None,
        )
        db.session.add(task)
    db.session.commit()
    print(f"✅ {n} Tasks created")


def seed_inventory(n=20):
    """Seed fake inventory items."""
    for i in range(n):
        item = InventoryItem(
            tenant_id=TENANT,
            sku=f"SKU-{i}",
            name=fake.word(),
            qty_on_hand=random.randint(0, 100),
            reorder_point=random.randint(5, 20),
            location=f"Warehouse {random.randint(1, 5)}",
        )
        db.session.add(item)
    db.session.commit()
    print(f"✅ {n} Inventory items created")


def seed_time_entries(days=7):
    """Give recent activity to a few users."""
    users = User.query.limit(10).all()
    now = datetime.utcnow()

    for user in users:
        for d in range(days):
            start = now - timedelta(days=d, hours=random.randint(1, 8))
            end = start + timedelta(hours=8)
            entry = TimeEntry(
                tenant_id=TENANT,
                user_id=user.id,
                start_time=start,
                end_time=end,
            )
            db.session.add(entry)
    db.session.commit()
    print(f"✅ Time entries seeded for {len(users)} users ({days} days each)")


def seed_notifications(n=10):
    """Simple notifications."""
    users = User.query.limit(5).all()
    for i in range(n):
        note = Notification(
            tenant_id=TENANT,
            user_id=random.choice(users).id if users else None,
            type="info",
            message=fake.sentence(),
            severity="info",
        )
        db.session.add(note)
    db.session.commit()
    print(f"✅ {n} Notifications created")


def seed_audit_logs(n=10):
    """Simple audit log events."""
    users = User.query.limit(5).all()
    for i in range(n):
        log = AuditLog(
            tenant_id=TENANT,
            user_id=random.choice(users).id if users else None,
            action="create",
            entity="task",
            entity_id=str(i),
            new_value={"status": "open"},
            ip_address="127.0.0.1",
        )
        db.session.add(log)
    db.session.commit()
    print(f"✅ {n} Audit logs created")


def run_all():
    app = create_app()
    with app.app_context():
        print("🌱 Starting database seeding...")
        seed_users()
        seed_tasks()
        seed_inventory()
        seed_time_entries()
        seed_notifications()
        seed_audit_logs()
        print("🎉 Seeding complete!")


if __name__ == "__main__":
    run_all()
