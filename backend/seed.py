from main import create_app, db
from models import User, Customer, Installation, Invoice, Ticket
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta

app = create_app()
bcrypt = Bcrypt()

with app.app_context():
    # --- USERS ---
    if not User.query.filter_by(role="admin").first():
        admin = User(
            username="superadmin",
            email="admin@masterfulhomes.com",
            password_hash=bcrypt.generate_password_hash("admin123").decode("utf-8"),
            role="admin",
        )
        db.session.add(admin)
        print("✅ Admin user created")

    if not User.query.filter_by(role="manager").first():
        manager = User(
            username="manager1",
            email="manager@masterfulhomes.com",
            password_hash=bcrypt.generate_password_hash("manager123").decode("utf-8"),
            role="manager",
        )
        db.session.add(manager)
        print("✅ Manager created")

    if not User.query.filter_by(role="finance").first():
        finance = User(
            username="finance1",
            email="finance@masterfulhomes.com",
            password_hash=bcrypt.generate_password_hash("finance123").decode("utf-8"),
            role="finance",
        )
        db.session.add(finance)
        print("✅ Finance created")

    if not User.query.filter_by(role="technician").first():
        tech = User(
            username="tech1",
            email="tech@masterfulhomes.com",
            password_hash=bcrypt.generate_password_hash("tech123").decode("utf-8"),
            role="technician",
        )
        db.session.add(tech)
        print("✅ Technician created")

    db.session.commit()

    # --- CUSTOMERS ---
    if not Customer.query.first():
        cust1 = Customer(name="Alice Johnson", email="alice@example.com", phone="555-1111")
        cust2 = Customer(name="Bob Smith", email="bob@example.com", phone="555-2222")
        db.session.add_all([cust1, cust2])
        db.session.commit()
        print("✅ Customers added")

    # --- INSTALLATIONS ---
    if not Installation.query.first():
        alice = Customer.query.filter_by(email="alice@example.com").first()
        bob = Customer.query.filter_by(email="bob@example.com").first()
        tech = User.query.filter_by(role="technician").first()

        inst1 = Installation(
            customer_id=alice.id,
            customer_name=alice.name,
            package_type="QuickStart",
            status="Completed",
            technician_id=tech.id,
            scheduled_date=datetime.utcnow() - timedelta(days=3),
            end_date=datetime.utcnow() - timedelta(days=1),
            price=500.0,
        )
        inst2 = Installation(
            customer_id=bob.id,
            customer_name=bob.name,
            package_type="Core",
            status="In Progress",
            technician_id=tech.id,
            scheduled_date=datetime.utcnow() + timedelta(days=2),
            price=1000.0,
        )
        db.session.add_all([inst1, inst2])
        db.session.commit()
        print("✅ Installations added")

    # --- INVOICES ---
    if not Invoice.query.first():
        finance = User.query.filter_by(role="finance").first()
        inst1 = Installation.query.filter_by(status="Completed").first()

        if inst1:
            inv1 = Invoice(
                amount=inst1.price,
                status="pending",
                owner_id=finance.id,
                installation_id=inst1.id
            )
            db.session.add(inv1)
            db.session.commit()
            print("✅ Invoices added")

    # --- TICKETS ---
    if not Ticket.query.first():
        tech = User.query.filter_by(role="technician").first()
        t1 = Ticket(issue="WiFi not working", status="open", assigned_to=tech)
        db.session.add(t1)
        db.session.commit()
        print("✅ Tickets added")

    print("🎉 Database seeding complete!")
