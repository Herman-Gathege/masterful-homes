from flask import Blueprint, jsonify
from models import db, Customer, Installation, Invoice
from utils.auth_middleware import token_required

customer_bp = Blueprint("customers", __name__)

@customer_bp.route("/customers/<int:customer_id>", methods=["GET"])
@token_required
def customer_360(current_user, customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({"message": "Customer not found"}), 404

    # Installations for this customer
    install_data = [
        {
            "id": i.id,
            "package_type": i.package_type,
            "status": i.status,
            "price": i.price,
            "scheduled_date": i.scheduled_date.isoformat() if i.scheduled_date else None,
            "end_date": i.end_date.isoformat() if i.end_date else None,
        }
        for i in customer.installations
    ]

    # Invoices for this customer
    invoice_data = [
        {"id": inv.id, "amount": inv.amount, "status": inv.status}
        for inv in customer.invoices
    ]

    # Tickets placeholder
    tickets_data = []

    return jsonify({
        "profile": {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone
        },
        "installations": install_data,
        "invoices": invoice_data,
        "tickets": tickets_data
    }), 200
