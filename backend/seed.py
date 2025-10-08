# backend/seed.py
import random
import calendar
from datetime import datetime, timezone, timedelta
from faker import Faker
from flask_bcrypt import Bcrypt

from main import create_app
from extensions import db
from core.models import User, Task, TimeEntry, InventoryItem, Notification, AuditLog, TenantConfig, RoleEnum, TaskTypeEnum, TaskStatusEnum, TimeEntryKindEnum, NotificationSeverityEnum, Shift

fake = Faker()
bcrypt = Bcrypt()
TENANT = "tenant_abc"

def seed_users(n=10):
    """Seed core business roles + extra demo users."""
    roles = [
        ("superadmin", "admin@masterfulhomes.com", "admin123", RoleEnum.SUPERADMIN),
        ("manager1", "manager@masterfulhomes.com", "manager123", RoleEnum.MANAGER),
        ("finance1", "finance@masterfulhomes.com", "finance123", RoleEnum.FINANCE),
        ("tech1", "tech1@masterfulhomes.com", "tech123", RoleEnum.TECHNICIAN),
        ("tech2", "tech2@masterfulhomes.com", "tech123", RoleEnum.TECHNICIAN),
    ]

    # Seed fixed roles
    for username, email, password, role in roles:
        if not User.query.filter_by(email=email).first():
            user = User(
                tenant_id=TENANT,
                email=email,
                full_name=username,
                password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
                role=role,
                department="Core",
                team="Team 1",
                location="Nairobi",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                last_login=datetime.now(timezone.utc),
            )
            db.session.add(user)
            print(f"✅ {role.value.capitalize()} {username} created")

    # Seed additional random users (up to n total, including fixed)
    existing_count = User.query.count()
    for i in range(max(0, n - existing_count)):
        email = fake.unique.email()
        if not User.query.filter_by(email=email).first():
            user = User(
                tenant_id=TENANT,
                email=email,
                full_name=fake.name(),
                password_hash=bcrypt.generate_password_hash(fake.password()).decode("utf-8"),
                role=random.choice(list(RoleEnum)),
                department=fake.word().capitalize(),
                team=f"Team {random.randint(1, 10)}",
                location=fake.city(),
                is_active=random.choice([True, False]),
                created_at=fake.date_time_this_year().replace(tzinfo=timezone.utc),
                last_login=fake.date_time_this_month().replace(tzinfo=timezone.utc) if random.random() > 0.2 else None,
            )
            db.session.add(user)
            if i % 1000 == 0:  # Batch commit for large n
                db.session.commit()
                print(f"Processing user {i+1}")
                print(f"✅ Batched {i} random users")

    db.session.commit()
    print(f"✅ Total {n} users seeded")

def seed_tasks(n=500):
    """Create demo tasks spread across statuses."""
    statuses = [TaskStatusEnum.OPEN, TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.COMPLETED, TaskStatusEnum.OVERDUE]
    users = User.query.all()
    for i in range(n):
        task = Task(
            tenant_id=TENANT,
            title=f"Task {i}",
            description=fake.sentence(),
            type=random.choice(list(TaskTypeEnum)),
            status=random.choice(statuses),
            priority=random.randint(1, 5),
            due_date=(datetime.now(timezone.utc) + timedelta(days=random.randint(-3, 7))).date(),
            created_by=random.choice(users).id if users else None,
            scheduled_at=fake.date_time_this_month().replace(tzinfo=timezone.utc) if random.random() > 0.5 else None,
            location=fake.city() if random.random() > 0.3 else None,
        )
        db.session.add(task)
        if i % 100 == 0:
            db.session.commit()
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
    """Give recent activity to users (1 week timesheets, varied kinds/open/approved)."""
    users = User.query.all()
    tasks = Task.query.all()
    shifts = Shift.query.all()  # For shift linkage
    now = datetime.now(timezone.utc)
    total_entries = 0

    for user in users:
        for d in range(days):
            start = now - timedelta(days=d, hours=random.randint(1, 12))
            duration_hours = random.uniform(4, 12)
            end = start + timedelta(hours=duration_hours) if random.random() > 0.1 else None
            kind = random.choice(list(TimeEntryKindEnum))
            entry = TimeEntry(
                tenant_id=TENANT,
                user_id=user.id,
                start_time=start,
                end_time=end,
                kind=kind,
                duration=duration_hours if end else None,
                notes=fake.sentence() if random.random() > 0.5 else None,
                is_approved=random.choice([True, False]),
                task_id=random.choice(tasks).id if tasks and random.random() > 0.3 else None,
                shift_id=random.choice(shifts).id if shifts and random.random() > 0.5 else None,  # 50% linked to shifts
            )
            db.session.add(entry)
            total_entries += 1
            if total_entries % 10000 == 0:
                db.session.commit()
                print(f"✅ Batched {total_entries} time entries")
    db.session.commit()
    print(f"✅ {total_entries} Time entries seeded for {len(users)} users ({days} days each)")

def seed_notifications(n=10):
    """Seed notifications with varied types and severities."""
    users = User.query.limit(5).all()
    tasks = Task.query.limit(5).all()
    notification_types = ["overtime", "missing_clockout", "task_update"]  # Example types
    for i in range(n):
        note = Notification(
            tenant_id=TENANT,
            user_id=random.choice(users).id if users else None,
            task_id=random.choice(tasks).id if tasks and random.random() > 0.5 else None,
            type=random.choice(notification_types),
            message=fake.sentence(),
            payload={"details": fake.text()} if random.random() > 0.7 else None,
            severity=random.choice(list(NotificationSeverityEnum)),
            is_read=False,
            delivered=False,
        )
        db.session.add(note)
    db.session.commit()
    print(f"✅ {n} Notifications created")

def seed_audit_logs(n=10):
    """Seed audit log events."""
    users = User.query.limit(5).all()
    for i in range(n):
        log = AuditLog(
            tenant_id=TENANT,
            user_id=random.choice(users).id if users else None,
            action=random.choice(["create", "update", "delete"]),
            entity=random.choice(["task", "user", "time_entry"]),
            entity_id=str(i),
            old_value={"status": "draft"} if random.random() > 0.5 else None,
            new_value={"status": "completed"} if random.random() > 0.5 else None,
            ip_address=fake.ipv4(),
        )
        db.session.add(log)
    db.session.commit()
    print(f"✅ {n} Audit logs created")

def seed_tenant_config():
    """Seed tenant configuration for sidebar + branding."""
    config = TenantConfig.query.filter_by(tenant_id=TENANT).first()
    if not config:
        config = TenantConfig(
            tenant_id=TENANT,
            enabled_modules=["dashboard", "hr", "time", "tasks", "notifications"],
            branding={"logo": "https://example.com/logo.png", "theme": "light"},
            trial_status="14 days left"
        )
        db.session.add(config)
        db.session.commit()
        print(f"✅ TenantConfig seeded for {TENANT}")
    else:
        print(f"ℹ️ TenantConfig already exists for {TENANT}")

def seed_shifts(n=100):
    """Seed demo shifts with random assignments, avoiding overlaps."""
    users = User.query.all()
    if not users:
        print("⚠️ No users found to assign shifts. Seeding users first...")
        seed_users()
        users = User.query.all()

    start_date = datetime(2025, 10, 1, tzinfo=timezone.utc)  # Start from today in UTC
    seeded_timeslots = set()  # Track (tenant_id, start_time, end_time) tuples

    for i in range(n):
        while True:
            start = start_date + timedelta(days=random.randint(0, 14), hours=random.randint(0, 23))
            duration = random.randint(4, 8)
            end = start + timedelta(hours=duration)
            timeslot = (TENANT, start, end)
            if timeslot not in seeded_timeslots:
                seeded_timeslots.add(timeslot)
                break

        shift = Shift(
            tenant_id=TENANT,
            start_time=start,
            end_time=end,
            role=random.choice(list(RoleEnum)),
            team=f"Team {random.randint(1, 3)}",
            description=f"Shift {i}",
            is_recurring=random.choice([True, False])
        )
        db.session.add(shift)
        # Assign 2-5 random users
        assignees = random.sample(users, min(random.randint(2, 5), len(users)))
        for user in assignees:
            shift.assignees.append(user)
        if i % 10 == 0:  # Batch commit for performance
            db.session.commit()
            print(f"✅ Batched {i+1} shifts")
    db.session.commit()
    print(f"✅ {n} Shifts seeded with assignments")

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
        seed_tenant_config()
        seed_shifts()
        print("🎉 Seeding complete!")

if __name__ == "__main__":
    run_all()