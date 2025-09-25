# backend/legacy_models.py
from extensions import db
from datetime import datetime
from sqlalchemy.orm import relationship

ROLES = ("admin", "manager", "technician", "finance")

class LegacyUser(db.Model):
    __tablename__ = "legacy_users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # one of ROLES

    # Relationships (depending on role)
    installations = relationship("LegacyInstallation", back_populates="technician")   # for technicians
    tickets = relationship("LegacyTicket", back_populates="assigned_to")              # for ops/finance
    invoices = relationship("LegacyInvoice", back_populates="owner")                  # for finance

    def __repr__(self):
        return f"<LegacyUser {self.username}, role={self.role}>"

class LegacyCustomer(db.Model):
    __tablename__ = "legacy_customers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default="lead", nullable=False) 
    # "lead" or "active"

    # Relationships
    installations = relationship("LegacyInstallation", back_populates="customer")
    invoices = relationship("LegacyInvoice", back_populates="customer")

    def __repr__(self):
        return f"<LegacyCustomer {self.name}, status={self.status}>"

class LegacyInstallation(db.Model):
    __tablename__ = "legacy_installations"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("legacy_customers.id"), nullable=False)
    customer = relationship("LegacyCustomer", back_populates="installations")

    customer_name = db.Column(db.String(120), nullable=False)  # optional: quick display
    package_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    technician_id = db.Column(db.Integer, db.ForeignKey("legacy_users.id"))
    technician = relationship("LegacyUser", back_populates="installations")

    scheduled_date = db.Column(db.DateTime, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)

    price = db.Column(db.Float, nullable=True)

    # Relationship to invoice (1:1)
    invoice = relationship("LegacyInvoice", back_populates="installation", uselist=False)

class LegacyTicket(db.Model):
    __tablename__ = "legacy_tickets"

    id = db.Column(db.Integer, primary_key=True)
    issue = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default="open")
    assigned_to_id = db.Column(db.Integer, db.ForeignKey("legacy_users.id"))
    assigned_to = relationship("LegacyUser", back_populates="tickets")

class LegacyInvoice(db.Model):
    __tablename__ = "legacy_invoices"

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending/paid/overdue
    
    # Finance owner
    owner_id = db.Column(db.Integer, db.ForeignKey("legacy_users.id"))
    owner = relationship("LegacyUser", back_populates="invoices")

    # Link to Installation (1:1)
    installation_id = db.Column(db.Integer, db.ForeignKey("legacy_installations.id"), nullable=False)
    installation = relationship("LegacyInstallation", back_populates="invoice")

    customer_id = db.Column(db.Integer, db.ForeignKey("legacy_customers.id"), nullable=False)
    customer = relationship("LegacyCustomer", back_populates="invoices")

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<LegacyInvoice {self.id}, status={self.status}, amount={self.amount}>"

class LegacyNotification(db.Model):
    __tablename__ = "legacy_notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("legacy_users.id"), nullable=False)
    user = relationship("LegacyUser", backref="notifications")

    message = db.Column(db.String(255), nullable=False)
    object_type = db.Column(db.String(50), nullable=True)   # e.g. "installation"
    object_id = db.Column(db.Integer, nullable=True)        # e.g. installation id
    extra = db.Column(db.String(1024), nullable=True)       # JSON string (optional)

    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
