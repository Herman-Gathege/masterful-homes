# backend/routes/search_routes.py

from flask import Blueprint, request, jsonify
from models import db, User, Customer, Installation, Invoice, Ticket
from utils.auth_middleware import token_required

search_bp = Blueprint("search", __name__)

@search_bp.route("/search", methods=["GET"])
@token_required
def global_search(current_user):
    q = request.args.get("q", "").strip()

    if not q:
        return jsonify({"message": "Query is required"}), 400

    # 🔎 Customers
    customers = Customer.query.filter(
        (Customer.name.ilike(f"%{q}%")) |
        (Customer.email.ilike(f"%{q}%")) |
        (Customer.phone.ilike(f"%{q}%"))
    ).all()

    # 🔎 Users (admins, managers, technicians, finance)
    users = User.query.filter(
        (User.username.ilike(f"%{q}%")) |
        (User.email.ilike(f"%{q}%")) |
        (User.role.ilike(f"%{q}%"))
    ).all()

    # 🔎 Installations
    installations = Installation.query.filter(
        (Installation.customer_name.ilike(f"%{q}%")) |
        (Installation.package_type.ilike(f"%{q}%")) |
        (Installation.status.ilike(f"%{q}%"))
    ).all()

    # 🔎 Invoices
    invoices = Invoice.query.filter(
        (Invoice.status.ilike(f"%{q}%"))
    ).all()

    # 🔎 Tickets
    tickets = Ticket.query.filter(
        (Ticket.issue.ilike(f"%{q}%")) |
        (Ticket.status.ilike(f"%{q}%"))
    ).all()

    # Format response
    return jsonify({
        "customers": [
            {"id": c.id, "name": c.name, "email": c.email, "phone": c.phone}
            for c in customers
        ],
        "users": [
            {"id": u.id, "username": u.username, "email": u.email, "role": u.role}
            for u in users
        ],
        "installations": [
            {"id": i.id, "customer_name": i.customer_name, "package_type": i.package_type, "status": i.status, "price": i.price}
            for i in installations
        ],
        "invoices": [
            {"id": inv.id, "amount": inv.amount, "status": inv.status}
            for inv in invoices
        ],
        "tickets": [
            {"id": t.id, "issue": t.issue, "status": t.status}
            for t in tickets
        ]
    }), 200
