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

    total_revenue = (
        db.session.query(func.coalesce(func.sum(Installation.price), 0))
        .filter(Installation.status == "Completed")
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
        db.session.query(func.coalesce(func.avg(Installation.price), 0))
        .scalar()
    )

    monthly_revenue = (
        db.session.query(
            func.strftime("%Y-%m", Installation.scheduled_date).label("month"),
            func.sum(Installation.price).label("revenue"),
        )
        .filter(Installation.status == "Completed")
        .group_by("month")
        .all()
    )
    monthly_data = [{"month": row[0], "revenue": float(row[1])} for row in monthly_revenue]

    return jsonify({
        "total_revenue": float(total_revenue or 0),
        "jobs_completed": jobs_completed,
        "outstanding_jobs": outstanding_jobs,
        "average_price": float(average_price or 0),
        "monthly_revenue": monthly_data,
    })


# 🔹 NEW: Finance Breakdown
@finance_bp.route("/finance/breakdown", methods=["GET"])
@token_required
def finance_breakdown(current_user):
    if current_user.role not in ["finance", "admin", "manager"]:
        return jsonify({"message": "Access forbidden"}), 403

    by_package = (
        db.session.query(
            Installation.package_type,
            func.sum(Installation.price).label("revenue")
        )
        .filter(Installation.status == "Completed")
        .group_by(Installation.package_type)
        .all()
    )
    package_data = [{"package_type": row[0], "revenue": float(row[1])} for row in by_package]

    by_technician = (
        db.session.query(
            User.username,
            func.sum(Installation.price).label("revenue")
        )
        .join(User, User.id == Installation.technician_id)
        .filter(Installation.status == "Completed")
        .group_by(User.username)
        .all()
    )
    tech_data = [{"technician_name": row[0], "revenue": float(row[1])} for row in by_technician]

    return jsonify({
        "packages": package_data,
        "technicians": tech_data,
    })
