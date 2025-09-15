from flask import Blueprint, request, jsonify
from models import db, Installation, User
from utils.auth_middleware import token_required
from datetime import datetime

manager_bp = Blueprint("manager", __name__)

def parse_iso_datetime(dt_str):
    """Safely parse ISO 8601 datetime, handle 'Z' (UTC) suffix."""
    if not dt_str:
        return None
    try:
        if dt_str.endswith("Z"):
            dt_str = dt_str.replace("Z", "+00:00")
        return datetime.fromisoformat(dt_str)
    except Exception:
        return None


# 🎯 GET all installations (with technician filtering)
@manager_bp.route("/installations", methods=["GET"])
@token_required
def get_installations(current_user):
    if current_user.role in ["admin", "manager"]:
        installations = Installation.query.all()
    elif current_user.role == "technician":
        installations = Installation.query.filter_by(technician_id=current_user.id).all()
    else:
        return jsonify({"message": "Access forbidden"}), 403

    data = [
        {
            "id": i.id,
            "customer_name": i.customer_name,
            "package_type": i.package_type,
            "status": i.status,
            "technician_id": i.technician_id,
            "technician_name": i.technician.username if i.technician else None,
            "scheduled_date": i.scheduled_date.isoformat() if i.scheduled_date else None,
            "end_date": i.end_date.isoformat() if i.end_date else None,
            "price": i.price,
        }
        for i in installations
    ]
    return jsonify(data), 200


# ➕ CREATE installation
@manager_bp.route("/installations", methods=["POST"])
@token_required
def create_installation(current_user):
    if current_user.role not in ["admin", "manager"]:
        return jsonify({"message": "Access forbidden"}), 403

    data = request.get_json()
    customer_name = data.get("customer_name")
    package_type = data.get("package_type")
    status = data.get("status", "Lead")
    technician_id = data.get("technician_id")
    scheduled_date = data.get("scheduled_date")
    end_date = data.get("end_date")

    if not customer_name or not package_type:
        return jsonify({"message": "Missing required fields"}), 400

    # ✅ validate price
    price = data.get("price")
    if price is not None:
        try:
            price = float(price)
            if price < 0:
                return jsonify({"message": "Price cannot be negative"}), 400
        except ValueError:
            return jsonify({"message": "Invalid price format"}), 400

    new_installation = Installation(
        customer_name=customer_name,
        package_type=package_type,
        status=status,
        technician_id=technician_id,
        scheduled_date=parse_iso_datetime(scheduled_date),
        end_date=parse_iso_datetime(end_date),
        price=price,
    )

    db.session.add(new_installation)
    db.session.commit()

    return jsonify({"message": "Installation created", "id": new_installation.id}), 201


# ✏️ UPDATE installation (assign technician, update status, reschedule, price)
@manager_bp.route("/installations/<int:installation_id>", methods=["PUT"])
@token_required
def update_installation(current_user, installation_id):
    installation = Installation.query.get(installation_id)
    if not installation:
        return jsonify({"message": "Installation not found"}), 404

    data = request.get_json()

    # Admin/Manager: can update everything
    if current_user.role in ["admin", "manager"]:
        installation.customer_name = data.get("customer_name", installation.customer_name)
        installation.package_type = data.get("package_type", installation.package_type)
        installation.status = data.get("status", installation.status)
        installation.technician_id = data.get("technician_id", installation.technician_id)

        scheduled_date = data.get("scheduled_date")
        end_date = data.get("end_date")
        if scheduled_date:
            installation.scheduled_date = parse_iso_datetime(scheduled_date)
        if end_date:
            installation.end_date = parse_iso_datetime(end_date)

        # ✅ validate and update price
        if "price" in data:
            try:
                price = float(data["price"])
                if price < 0:
                    return jsonify({"message": "Price cannot be negative"}), 400
                installation.price = price
            except ValueError:
                return jsonify({"message": "Invalid price format"}), 400

    # Technician: can only update their own job's status
    elif current_user.role == "technician":
        if installation.technician_id != current_user.id:
            return jsonify({"message": "Access forbidden: not your job"}), 403
        if "status" in data:
            installation.status = data["status"]

    else:
        return jsonify({"message": "Access forbidden"}), 403

    db.session.commit()
    return jsonify({"message": "Installation updated"}), 200


# ❌ DELETE installation
@manager_bp.route("/installations/<int:installation_id>", methods=["DELETE"])
@token_required
def delete_installation(current_user, installation_id):
    if current_user.role != "admin":  # Only Admins can delete
        return jsonify({"message": "Access forbidden"}), 403

    installation = Installation.query.get(installation_id)
    if not installation:
        return jsonify({"message": "Installation not found"}), 404

    db.session.delete(installation)
    db.session.commit()
    return jsonify({"message": "Installation deleted"}), 200
