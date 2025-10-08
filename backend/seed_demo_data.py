# backend/seed_demo_data.py
from datetime import datetime, timedelta, timezone
from flask_bcrypt import Bcrypt
from faker import Faker
import random

from main import create_app
from extensions import db
from core.models import User, Task, TimeEntry, Notification, RoleEnum, TaskStatusEnum, TimeEntryKindEnum

fake = Faker()
bcrypt = Bcrypt()
TENANT = "tenant_demo"


def seed_demo():
    print("🌱 Seeding demo data...")

    # 1️⃣ Manager
    manager_email = "manager@demo.com"
    manager = User.query.filter_by(email=manager_email).first()
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
    for i in range(3):
        email = f"employee{i+1}@demo.com"
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                tenant_id=TENANT,
                email=email,
                full_name=f"Employee {i+1}",
                password_hash=bcrypt.generate_password_hash("employee123").decode("utf-8"),
                role=RoleEnum.EMPLOYEE,
                department="Field Ops",
                team="Team Alpha",
                location="Nairobi",
                is_active=True,
            )
            db.session.add(user)
            employees.append(user)
        else:
            employees.append(user)
    db.session.commit()
    print(f"✅ Found or created {len(employees)} employees")

    # 3️⃣ Create a sample Task for Employee 1
    task = Task(
        tenant_id=TENANT,
        title="Install smart lights",
        description="Complete smart lighting installation at customer site.",
        type="installation",
        status=TaskStatusEnum.IN_PROGRESS,
        priority=2,
        due_date=datetime.now(timezone.utc).date() + timedelta(days=2),
        created_by=manager.id,
        scheduled_at=datetime.now(timezone.utc) + timedelta(hours=1),
        location="Westlands, Nairobi",
    )
    db.session.add(task)
    db.session.commit()

    # Assign Employee 1
    if employees:
        task.assignees.append(employees[0])
        db.session.commit()
        print(f"🧩 Assigned task '{task.title}' to {employees[0].full_name}")

        # 4️⃣ Create Time Entry for Employee 1
        start_time = datetime.now(timezone.utc) - timedelta(hours=9)
        end_time = datetime.now(timezone.utc)
        entry = TimeEntry(
            tenant_id=TENANT,
            user_id=employees[0].id,
            start_time=start_time,
            end_time=end_time,
            kind=TimeEntryKindEnum.REGULAR,
            duration=(end_time - start_time).seconds / 3600,
            notes="Installation completed successfully.",
            is_approved=True,
            task_id=task.id,
        )
        db.session.add(entry)
        db.session.commit()
        print("🕒 Time entry created for Employee 1")

        # 5️⃣ Generate demo notification
        notif = Notification(
            tenant_id=TENANT,
            user_id=employees[0].id,
            message=f"Overtime logged: {round(entry.duration, 1)} hours on {entry.start_time.date()}",
            created_at=datetime.now(timezone.utc),
            is_read=False,
        )
        db.session.add(notif)
        db.session.commit()
        print("🔔 Demo notification created")

    print("🎉 Demo data seeded successfully!")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_demo()
