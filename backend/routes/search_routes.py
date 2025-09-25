# backend/routes/search_routes.py

from flask import Blueprint, request, jsonify
from legacy_models import db, LegacyUser, LegacyCustomer, LegacyInstallation, LegacyInvoice, LegacyTicket
from utils.auth_middleware import token_required

search_bp = Blueprint("search", __name__)

@search_bp.route("/search", methods=["GET"])
@token_required
def global_search(current_user):
    q = request.args.get("q", "").strip()

    if not q:
        return jsonify({"message": "Query is required"}), 400

    # 🔎 Customers
    customers = LegacyCustomer.query.filter(
        (LegacyCustomer.name.ilike(f"%{q}%")) |
        (LegacyCustomer.email.ilike(f"%{q}%")) |
        (LegacyCustomer.phone.ilike(f"%{q}%"))
    ).all()

    # 🔎 Users (admins, managers, technicians, finance)
    users = LegacyUser.query.filter(
        (LegacyUser.username.ilike(f"%{q}%")) |
        (LegacyUser.email.ilike(f"%{q}%")) |
        (LegacyUser.role.ilike(f"%{q}%"))
    ).all()

    # 🔎 Installations
    installations = LegacyInstallation.query.filter(
        (LegacyInstallation.customer_name.ilike(f"%{q}%")) |
        (LegacyInstallation.package_type.ilike(f"%{q}%")) |
        (LegacyInstallation.status.ilike(f"%{q}%"))
    ).all()

    # 🔎 Invoices
    invoices = LegacyInvoice.query.filter(
        (LegacyInvoice.status.ilike(f"%{q}%"))
    ).all()

    # 🔎 Tickets
    tickets = LegacyTicket.query.filter(
        (LegacyTicket.issue.ilike(f"%{q}%")) |
        (LegacyTicket.status.ilike(f"%{q}%"))
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
