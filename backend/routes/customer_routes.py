# # backend/routes/customer_routes.py
# from flask import Blueprint, jsonify
# from models import db, Customer, Installation, Invoice
# from utils.auth_middleware import token_required

# customer_bp = Blueprint("customers", __name__)

# @customer_bp.route("/customers/<int:customer_id>", methods=["GET"])
# @token_required
# def customer_360(current_user, customer_id):
#     customer = Customer.query.get(customer_id)
#     if not customer:
#         return jsonify({"message": "Customer not found"}), 404

#     # Installations for this customer
#     install_data = [
#         {
#             "id": i.id,
#             "package_type": i.package_type,
#             "status": i.status,
#             "price": i.price,
#             "scheduled_date": i.scheduled_date.isoformat() if i.scheduled_date else None,
#             "end_date": i.end_date.isoformat() if i.end_date else None,
#         }
#         for i in customer.installations
#     ]

#     # Invoices: collect from all installations
#     invoice_data = []
#     for inst in customer.installations:
#         if inst.invoice:  # 1:1 relationship, may be None
#             invoice_data.append({
#                 "id": inst.invoice.id,
#                 "amount": inst.invoice.amount,
#                 "status": inst.invoice.status,
#                 "created_at": inst.invoice.created_at.isoformat() if inst.invoice.created_at else None,
#             })

#     # Tickets placeholder
#     tickets_data = []

#     return jsonify({
#         "profile": {
#             "id": customer.id,
#             "name": customer.name,
#             "email": customer.email,
#             "phone": customer.phone
#         },
#         "installations": install_data,
#         "invoices": invoice_data,
#         "tickets": tickets_data
#     }), 200


from flask import Blueprint, jsonify, request
from models import db, Customer, Installation, Invoice
from utils.auth_middleware import token_required

customer_bp = Blueprint("customers", __name__)

# 📌 List all customers (with optional status filter + pagination)
@customer_bp.route("/customers", methods=["GET"])
@token_required
def list_customers(current_user):
    status = request.args.get("status")  # optional filter: "lead" or "active"
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))

    query = Customer.query
    if status:
        query = query.filter_by(status=status)

    pagination = query.order_by(Customer.id.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    customers = [
        {
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "status": c.status,
        }
        for c in pagination.items
    ]

    return jsonify({
        "items": customers,
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
    }), 200


# 📌 Single customer 360 view (you already had this)
@customer_bp.route("/customers/<int:customer_id>", methods=["GET"])
@token_required
def customer_360(current_user, customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({"message": "Customer not found"}), 404

    # Installations
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

    # Invoices
    invoice_data = []
    for inst in customer.installations:
        if inst.invoice:  # 1:1 relationship
            invoice_data.append({
                "id": inst.invoice.id,
                "amount": inst.invoice.amount,
                "status": inst.invoice.status,
                "created_at": inst.invoice.created_at.isoformat() if inst.invoice.created_at else None,
            })

    # Tickets (placeholder for now)
    tickets_data = []

    return jsonify({
        "profile": {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone,
            "status": customer.status,
        },
        "installations": install_data,
        "invoices": invoice_data,
        "tickets": tickets_data,
    }), 200
