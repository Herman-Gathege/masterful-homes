from main import create_app, db
from models import User, Customer, Installation, Invoice, Ticket
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import calendar
import random

app = create_app()
bcrypt = Bcrypt()

with app.app_context():
    # --- USERS ---
    roles = [
        ("superadmin", "admin@masterfulhomes.com", "admin123", "admin"),
        ("manager1", "manager@masterfulhomes.com", "manager123", "manager"),
        ("finance1", "finance@masterfulhomes.com", "finance123", "finance"),
        ("tech1", "tech1@masterfulhomes.com", "tech123", "technician"),
        ("tech2", "tech2@masterfulhomes.com", "tech123", "technician"),
    ]

    for username, email, password, role in roles:
        if not User.query.filter_by(email=email).first():
            user = User(
                username=username,
                email=email,
                password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
                role=role,
            )
            db.session.add(user)
            print(f"✅ {role.capitalize()} {username} created")

    db.session.commit()

    # --- CUSTOMERS ---
    if not Customer.query.first():
        customers = [
            Customer(name="Alice Johnson", email="alice@example.com", phone="555-1111"),
            Customer(name="Bob Smith", email="bob@example.com", phone="555-2222"),
            Customer(name="Charlie Green", email="charlie@example.com", phone="555-3333"),
            Customer(name="Diana Prince", email="diana@example.com", phone="555-4444"),
            Customer(name="Ethan Brown", email="ethan@example.com", phone="555-5555"),
        ]
        db.session.add_all(customers)
        db.session.commit()
        print("✅ Customers added")

    # --- INSTALLATIONS ---
    if not Installation.query.first():
        customers = Customer.query.all()
        techs = User.query.filter_by(role="technician").all()
        package_types = ["QuickStart", "Core", "Premium", "Enterprise"]

        today = datetime.utcnow()

        # Loop through last 12 months
        for i in range(12):
            month_date = today.replace(day=1) - timedelta(days=30 * i)
            year, month = month_date.year, month_date.month
            _, last_day = calendar.monthrange(year, month)

            # 2–4 installations each month
            for _ in range(random.randint(2, 4)):
                cust = random.choice(customers)
                tech = random.choice(techs)
                package = random.choice(package_types)
                price = random.choice([500, 750, 1000, 1500, 2000])

                day = random.randint(1, last_day)
                scheduled = datetime(year, month, day)

                inst = Installation(
                    customer_id=cust.id,
                    customer_name=cust.name,
                    package_type=package,
                    status="Completed",
                    technician_id=tech.id,
                    scheduled_date=scheduled,
                    end_date=scheduled + timedelta(days=2),
                    price=price,
                )
                db.session.add(inst)

        db.session.commit()
        print("✅ 12 months of Installations added")

    # --- INVOICES ---
    if not Invoice.query.first():
        finance = User.query.filter_by(role="finance").first()
        installations = Installation.query.filter_by(status="Completed").all()

        statuses = ["paid", "pending"]

        for inst in installations:            
            inv = Invoice(
                amount=inst.price,
                status=random.choice(statuses),
                owner_id=finance.id,
                installation_id=inst.id,
                customer_id=inst.customer_id,  # 👈 this links invoice to customer
                created_at=inst.scheduled_date,
            )

            db.session.add(inv)

        db.session.commit()
        print("✅ Invoices added")

    # --- TICKETS ---
    if not Ticket.query.first():
        techs = User.query.filter_by(role="technician").all()
        tickets = [
            Ticket(issue="WiFi not working", status="open", assigned_to=random.choice(techs)),
            Ticket(issue="Smart lock malfunction", status="in progress", assigned_to=random.choice(techs)),
            Ticket(issue="Camera offline", status="closed", assigned_to=random.choice(techs)),
        ]
        db.session.add_all(tickets)
        db.session.commit()
        print("✅ Tickets added")

    print("🎉 Database seeding complete with invoices spread across months!")
