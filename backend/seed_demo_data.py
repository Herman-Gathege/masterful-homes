#backend/seed_demo_data.py
from datetime import datetime, timedelta, timezone
from flask_bcrypt import Bcrypt
from faker import Faker
import random

from main import create_app
from extensions import db
from core.models import (
    User, Task, TimeEntry, Notification, Shift,
    RoleEnum, TaskStatusEnum, TaskTypeEnum, TimeEntryKindEnum,
    TenantConfig
)

fake = Faker()
bcrypt = Bcrypt()
TENANT = "tenant_abc"


def seed_demo():
    print("🌱 Seeding rich demo data with shifts...")

    # 0️⃣ Clear existing demo data
    db.session.query(Notification).delete()
    db.session.query(TimeEntry).delete()
    db.session.query(Task).delete()
    db.session.query(Shift).delete()
    db.session.query(User).filter_by(tenant_id=TENANT).delete()
    db.session.commit()
    print("🧹 Cleared old demo data")

    # 1️⃣ Ensure Manager exists
    manager_email = "manager@demo.com"
    manager = User.query.filter_by(email=manager_email, tenant_id=TENANT).first()
    if not manager:
        manager = User(
            tenant_id=TENANT,
            email=manager_email,
            full_name="Demo Manager",
            password_hash=bcrypt.generate_password_hash("manager123").decode("utf-8"),
            role=RoleEnum.MANAGER,
            department="Operations",
            team="Team Alpha",
            location="Nairobi",
            is_active=True,
            last_login=datetime.now(timezone.utc),
        )
        db.session.add(manager)
        db.session.commit()
        print(f"✅ Created manager user: {manager.email} / manager123")
    else:
        print(f"ℹ️ Manager already exists: {manager.email}")

    # 2️⃣ Employees
    employees = []
    for i in range(4):
        email = f"employee{i+1}@demo.com"
        user = User.query.filter_by(email=email, tenant_id=TENANT).first()
        if not user:
            user = User(
                tenant_id=TENANT,
                email=email,
                full_name=f"Employee {i+1}",
                password_hash=bcrypt.generate_password_hash("employee123").decode("utf-8"),
                role=RoleEnum.EMPLOYEE,
                department="Field Ops",
                team="Team Alpha",
                location=random.choice(["Nairobi", "Mombasa", "Kisumu"]),
                is_active=True,
            )
            db.session.add(user)
            employees.append(user)
        else:
            employees.append(user)
    db.session.commit()
    print(f"✅ Found or created {len(employees)} employees")

    # 3️⃣ Create Tasks for each employee
    for emp in employees:
        for _ in range(random.randint(2, 4)):
            t = Task(
                tenant_id=TENANT,
                title=fake.catch_phrase(),
                description=fake.paragraph(nb_sentences=2),
                type=random.choice([e.value for e in TaskTypeEnum]),
                status=random.choice([e.value for e in TaskStatusEnum]),
                priority=random.randint(1, 5),
                due_date=datetime.now(timezone.utc).date() + timedelta(days=random.randint(1, 10)),
                created_by=manager.id,
                scheduled_at=datetime.now(timezone.utc) + timedelta(hours=random.randint(1, 48)),
                location=fake.city(),
            )
            db.session.add(t)
            db.session.flush()
            t.assignees.append(emp)
    db.session.commit()
    print("📋 Created demo tasks for employees")

    # 4️⃣ Time entries (last 7 days)
    for emp in employees:
        for day_offset in range(7):
            start_time = datetime.now(timezone.utc) - timedelta(days=day_offset, hours=random.randint(8, 10))
            if random.random() < 0.2:
                end_time = None
                duration = None
            else:
                duration_hours = random.uniform(6, 10)
                end_time = start_time + timedelta(hours=duration_hours)
                duration = duration_hours

            kind = (
                TimeEntryKindEnum.OVERTIME
                if duration and duration > 8
                else TimeEntryKindEnum.REGULAR
            )

            entry = TimeEntry(
                tenant_id=TENANT,
                user_id=emp.id,
                start_time=start_time,
                end_time=end_time,
                kind=kind,
                duration=duration,
                notes=fake.sentence(nb_words=8),
                is_approved=random.choice([True, False]),
            )
            db.session.add(entry)
            db.session.flush()

            if end_time is None:
                notif_msg = f"⚠️ Missing clock-out since {start_time.strftime('%Y-%m-%d %H:%M')}"
            elif duration and duration > 8:
                notif_msg = f"⏰ Overtime logged: {round(duration, 1)}h on {start_time.date()}"
            else:
                notif_msg = None

            if notif_msg:
                db.session.add(Notification(
                    tenant_id=TENANT,
                    user_id=emp.id,
                    message=notif_msg,
                    created_at=datetime.now(timezone.utc),
                    is_read=False,
                ))

    db.session.commit()
    print("🕒 Added demo time entries + notifications")

    # 5️⃣ Shifts for the week
    for day_offset in range(3):
        start = datetime.now(timezone.utc) + timedelta(days=day_offset, hours=9)
        end = start + timedelta(hours=8)
        shift = Shift(
            tenant_id=TENANT,
            start_time=start,
            end_time=end,
            role=RoleEnum.EMPLOYEE,
            team="Team Alpha",
            description=f"Shift {day_offset+1} for Team Alpha",
            is_recurring=False,
        )
        db.session.add(shift)
        db.session.flush()
        shift.assignees = random.sample(employees, random.randint(2, len(employees)))
    db.session.commit()
    print("📅 Created demo shifts")

    # 6️⃣ Ensure TenantConfig exists
    config = TenantConfig.query.filter_by(tenant_id=TENANT).first()
    if not config:
        config = TenantConfig(
            tenant_id=TENANT,
            enabled_modules=["dashboard", "tasks", "notifications"],
            branding={"theme_color": "#007bff", "logo_url": ""},
            trial_status="active"
        )
        db.session.add(config)
        db.session.commit()
        print(f"⚙️ Created TenantConfig for {TENANT}")
    else:
        print(f"ℹ️ TenantConfig already exists for {TENANT}")

    print("🎉 Demo data seeded successfully!")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_demo()
