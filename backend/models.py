# backend/models.py

from extensions import db   
from datetime import datetime
from sqlalchemy.orm import relationship


ROLES = ("admin", "manager", "technician", "finance")

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # one of ROLES

    # Relationships (depending on role)
    installations = relationship("Installation", back_populates="technician")   # for technicians
    tickets = relationship("Ticket", back_populates="assigned_to")              # for ops/finance
    invoices = relationship("Invoice", back_populates="owner")                  # for finance

    def __repr__(self):
        return f"<User {self.username}, role={self.role}>"


class Installation(db.Model):
    __tablename__ = "installations"

    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(120), nullable=False)
    package_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    technician_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    technician = relationship("User", back_populates="installations")

    scheduled_date = db.Column(db.DateTime, nullable=True)  # new
    end_date = db.Column(db.DateTime, nullable=True)        # new

class Ticket(db.Model):
    __tablename__ = "tickets"

    id = db.Column(db.Integer, primary_key=True)
    issue = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default="open")
    assigned_to_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    assigned_to = relationship("User", back_populates="tickets")

class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending/paid/overdue
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    owner = relationship("User", back_populates="invoices")
