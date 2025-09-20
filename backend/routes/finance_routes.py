#backend/routes/finance_routes.py
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from models import db, Invoice, Installation, User
from utils.auth_middleware import token_required

finance_bp = Blueprint("finance", __name__)

# 🔹 Existing: Get all invoices
@finance_bp.route("/invoices", methods=["GET"])
@token_required
def get_invoices(current_user):
    if current_user.role not in ["finance", "admin", "manager"]:
        return jsonify({"message": "Access forbidden"}), 403

    invoices = Invoice.query.all()
    data = [
        {
            "id": inv.id,
            "amount": inv.amount,
            "status": inv.status,
            "installation_id": inv.installations[0].id if inv.installations else None,
        }
        for inv in invoices
    ]
    return jsonify(data), 200


# 🔹 Existing: Update invoice
@finance_bp.route("/invoices/<int:invoice_id>", methods=["PUT"])
@token_required
def update_invoice(current_user, invoice_id):
    if current_user.role not in ["finance", "admin"]:
        return jsonify({"message": "Access forbidden"}), 403

    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"message": "Not found"}), 404

    invoice.status = request.json.get("status", invoice.status)
    db.session.commit()
    return jsonify({"message": "Invoice updated"}), 200


# 🔹 NEW: Finance Summary 
@finance_bp.route("/finance/summary", methods=["GET"])
@token_required
def finance_summary(current_user):
    if current_user.role not in ["finance", "admin", "manager"]:
        return jsonify({"message": "Access forbidden"}), 403

    # ✅ Only sum PAID invoices for revenue
    total_revenue = (
        db.session.query(func.coalesce(func.sum(Invoice.amount), 0))
        .filter(Invoice.status == "paid")
        .scalar()
    )

    jobs_completed = (
        db.session.query(func.count(Installation.id))
        .filter(Installation.status == "Completed")
        .scalar()
    )

    outstanding_jobs = (
        db.session.query(func.count(Installation.id))
        .filter(Installation.status.in_(["Scheduled", "In Progress"]))
        .scalar()
    )

    average_price = (
        db.session.query(func.coalesce(func.avg(Invoice.amount), 0))
        .filter(Invoice.status == "paid")  # ✅ use only paid invoices
        .scalar()
    )

    # ✅ Monthly revenue from paid invoices only
    monthly_revenue = (
        db.session.query(
            func.strftime("%Y-%m", Invoice.created_at).label("month"),
            func.sum(Invoice.amount).label("revenue"),
        )
        .filter(Invoice.status == "paid")
        .group_by("month")
        .all()
    )
    monthly_data = [{"month": row[0], "revenue": float(row[1])} for row in monthly_revenue]

    return jsonify({
        "total_revenue": float(total_revenue or 0),
        "jobs_completed": jobs_completed,
        "outstanding_jobs": outstanding_jobs,
        "average_price": round(float(average_price or 0), 2),  # 👈 round here
        "monthly_revenue": monthly_data,
    })



# 🔹 NEW: Finance Breakdown 
@finance_bp.route("/finance/breakdown", methods=["GET"])
@token_required
def finance_breakdown(current_user):
    if current_user.role not in ["finance", "admin", "manager"]:
        return jsonify({"message": "Access forbidden"}), 403

    # ✅ Revenue by package from PAID invoices
    by_package = (
        db.session.query(
            Installation.package_type,
            func.sum(Invoice.amount).label("revenue")
        )
        .join(Invoice, Invoice.installation_id == Installation.id)
        .filter(Invoice.status == "paid")
        .group_by(Installation.package_type)
        .all()
    )
    package_data = [{"package_type": row[0], "revenue": float(row[1])} for row in by_package]

    # ✅ Revenue by technician from PAID invoices
    by_technician = (
        db.session.query(
            User.username,
            func.sum(Invoice.amount).label("revenue")
        )
        .join(Installation, User.id == Installation.technician_id)
        .join(Invoice, Invoice.installation_id == Installation.id)
        .filter(Invoice.status == "paid")
        .group_by(User.username)
        .all()
    )
    tech_data = [{"technician_name": row[0], "revenue": float(row[1])} for row in by_technician]

    return jsonify({
        "packages": package_data,
        "technicians": tech_data,
    })



