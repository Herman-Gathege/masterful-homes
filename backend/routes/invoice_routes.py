# backend/routes/invoice_routes.py
from flask import Blueprint, request, jsonify
from models import db, Invoice, Installation, Customer
from utils.decorators import role_required

invoice_bp = Blueprint("invoice_bp", __name__)

# GET all invoices (admin + finance)
@invoice_bp.route("/invoices", methods=["GET"])
@role_required(["admin", "finance"])
def get_invoices():
    invoices = Invoice.query.all()
    return jsonify([
        {
            "id": inv.id,
            "amount": inv.amount,
            "status": inv.status,
            "installation_id": inv.installation_id,
            "created_at": inv.created_at,
            "installation": {
                "id": inv.installation.id if inv.installation else None,
                "package_type": inv.installation.package_type if inv.installation else None,
                "customer_name": inv.installation.customer.name if inv.installation and inv.installation.customer else None,
            }
        }
        for inv in invoices
    ])

# POST create invoice
@invoice_bp.route("/invoices", methods=["POST"])
@role_required(["admin", "finance"])
def create_invoice():
    data = request.get_json()
    installation_id = data.get("installation_id")
    amount = data.get("amount")

    # check installation exists & is completed
    installation = Installation.query.get(installation_id)
    if not installation:
        return jsonify({"message": "Installation not found"}), 404
    if installation.status != "Completed":
        return jsonify({"message": "Installation must be completed before invoicing"}), 400
    if Invoice.query.filter_by(installation_id=installation_id).first():
        return jsonify({"message": "Invoice already exists for this installation"}), 400

    invoice = Invoice(
        amount=amount,
        status="pending",
        owner_id=data.get("owner_id"),  # finance/admin creating
        installation_id=installation_id,
    )
    db.session.add(invoice)
    db.session.commit()
    return jsonify({"message": "Invoice created", "invoice_id": invoice.id}), 201

# PUT update invoice status
@invoice_bp.route("/invoices/<int:invoice_id>", methods=["PUT"])
@role_required(["admin", "finance"])
def update_invoice(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404

    data = request.get_json()
    invoice.status = data.get("status", invoice.status)
    db.session.commit()
    return jsonify({"message": "Invoice updated"}), 200

# DELETE invoice (admin only)
@invoice_bp.route("/invoices/<int:invoice_id>", methods=["DELETE"])
@role_required(["admin"])
def delete_invoice(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404

    db.session.delete(invoice)
    db.session.commit()
    return jsonify({"message": "Invoice deleted"}), 200

# GET invoice summary (admin + finance)
@invoice_bp.route("/invoices/summary", methods=["GET"])
@role_required(["admin", "finance"])
def invoice_summary():
    total = db.session.query(db.func.sum(Invoice.amount)) \
        .filter(Invoice.status == "paid").scalar() or 0
    pending = Invoice.query.filter_by(status="pending").count()
    paid = Invoice.query.filter_by(status="paid").count()
    overdue = Invoice.query.filter_by(status="overdue").count()
    return jsonify({
        "total_revenue": total,
        "pending": pending,
        "paid": paid,
        "overdue": overdue,
    })

