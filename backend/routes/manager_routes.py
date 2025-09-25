# backend/routes/manager_routes.py
from flask import Blueprint, request, jsonify
from legacy_models import db, LegacyInstallation, LegacyUser, LegacyCustomer, LegacyInvoice  # ✅ import Customer
from utils.notifications import create_notifications_for_users
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
        installations = LegacyInstallation.query.all()
    elif current_user.role == "technician":
        installations = LegacyInstallation.query.filter_by(technician_id=current_user.id).all()
    else:
        return jsonify({"message": "Access forbidden"}), 403

    data = [
        {
            "id": i.id,
            "customer_id": i.customer_id,
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


# ✏️ CREATE new installation (with customer handling)
@manager_bp.route("/installations", methods=["POST"])
@token_required
def create_installation(current_user):
    if current_user.role not in ["admin", "manager"]:
        return jsonify({"message": "Access forbidden"}), 403

    data = request.get_json()
    customer_name = data.get("customer_name")
    customer_email = data.get("customer_email")  # 👈 new
    customer_phone = data.get("customer_phone")  # 👈 optional
    package_type = data.get("package_type")
    status = data.get("status", "Lead")
    technician_id = data.get("technician_id")
    scheduled_date = data.get("scheduled_date")
    end_date = data.get("end_date")

    if not customer_name or not customer_email or not package_type:
        return jsonify({"message": "Missing required fields"}), 400

    # ✅ ensure price is valid
    price = data.get("price")
    if price is not None:
        try:
            price = float(price)
            if price < 0:
                return jsonify({"message": "Price cannot be negative"}), 400
        except ValueError:
            return jsonify({"message": "Invalid price format"}), 400

    # 🔹 Step 1: Find or Create Customer
    customer = LegacyCustomer.query.filter_by(email=customer_email).first()
    if not customer:
        customer = LegacyCustomer(
            name=customer_name,
            email=customer_email,
            phone=customer_phone,
            status="lead"
        )
        db.session.add(customer)
        db.session.flush()  # assigns an ID before commit

    # inside create_installation, before creating Installation
    if technician_id:
        tech = LegacyUser.query.get(technician_id)
        if not tech or tech.role != "technician":
            return jsonify({"message": "Invalid technician ID"}), 400


    # 🔹 Step 2: Create Installation with linked customer_id
    new_installation = LegacyInstallation(
        customer_id=customer.id,
        customer_name=customer.name,  # redundant, but useful for quick access
        package_type=package_type,
        status=status,
        technician_id=technician_id,
        scheduled_date=parse_iso_datetime(scheduled_date),
        end_date=parse_iso_datetime(end_date),
        price=price,
    )

    db.session.add(new_installation)
    db.session.commit()

    to_notify = []
    roles = ["admin", "manager", "finance"]
    users = LegacyUser.query.filter(LegacyUser.role.in_(roles)).all()
    to_notify.extend([u.id for u in users])

    if technician_id:
        to_notify.append(technician_id)

    msg = f"New Installation #{new_installation.id} — {new_installation.package_type} for {customer_name}"
    create_notifications_for_users(to_notify, msg, object_type="installation", object_id=new_installation.id)

    

    return jsonify({
        "message": "Installation created",
        "id": new_installation.id,
        "customer_id": customer.id
    }), 201




# ✏️ UPDATE installation (assign technician, update status, reschedule, price)
@manager_bp.route("/installations/<int:installation_id>", methods=["PUT"])
@token_required
def update_installation(current_user, installation_id):
    installation = LegacyInstallation.query.get(installation_id)
    if not installation:
        return jsonify({"message": "Installation not found"}), 404

    data = request.get_json()

    # Keep old values for comparison
    old_status = installation.status
    old_tech = installation.technician_id

    # --- Admin/Manager updates ---
    if current_user.role in ["admin", "manager"]:
        installation.customer_name = data.get("customer_name", installation.customer_name)
        installation.package_type = data.get("package_type", installation.package_type)
        installation.status = data.get("status", installation.status)

        # ✅ Technician reassignment with validation (only once)
        new_tech_id = data.get("technician_id", installation.technician_id)
        if new_tech_id:
            tech = LegacyUser.query.get(new_tech_id)
            if not tech or tech.role != "technician":
                return jsonify({"message": "Invalid technician ID"}), 400
            installation.technician_id = new_tech_id

        # Dates
        scheduled_date = data.get("scheduled_date")
        end_date = data.get("end_date")
        if scheduled_date:
            installation.scheduled_date = parse_iso_datetime(scheduled_date)
        if end_date:
            installation.end_date = parse_iso_datetime(end_date)

        # Price validation
        if "price" in data:
            try:
                price = float(data["price"])
                if price < 0:
                    return jsonify({"message": "Price cannot be negative"}), 400
                installation.price = price
            except ValueError:
                return jsonify({"message": "Invalid price format"}), 400

    # --- Technician updates ---
    elif current_user.role == "technician":
        if installation.technician_id != current_user.id:
            return jsonify({"message": "Access forbidden: not your job"}), 403
        if "status" in data:
            installation.status = data["status"]

    else:
        return jsonify({"message": "Access forbidden"}), 403

    # --- Auto actions when marked Completed ---
    if old_status != "Completed" and installation.status == "Completed":
        # 1. Generate invoice (only if not exists)
        if not installation.invoice:
            invoice = LegacyInvoice(
                amount=installation.price or 0,
                status="pending",
                installation_id=installation.id,
                customer_id=installation.customer_id,
                owner_id=None
            )
            db.session.add(invoice)

        # 2. Promote customer (lead → active)
        if installation.customer and installation.customer.status.lower() == "lead":
            installation.customer.status = "active"

    db.session.commit()

    # --- Notifications ---
    to_notify = []

    # Case 1: Technician starts job
    if current_user.role == "technician" and old_status != "In Progress" and installation.status == "In Progress":
        roles = ["admin", "manager", "finance"]
        users = LegacyUser.query.filter(LegacyUser.role.in_(roles)).all()
        to_notify = [u.id for u in users]
        msg = f"Installation #{installation.id} started by Technician {current_user.username}"
        create_notifications_for_users(to_notify, msg, object_type="installation", object_id=installation.id)

    # Case 2: Admin/Manager assigns/reassigns technician
    if current_user.role in ["admin", "manager"] and old_tech != installation.technician_id:
        if installation.technician_id:
            msg = f"You have been assigned Installation #{installation.id}"
            create_notifications_for_users([installation.technician_id], msg, object_type="installation", object_id=installation.id)

    # Case 3: Completed installation
    if old_status != "Completed" and installation.status == "Completed":
        roles = ["admin", "manager", "finance"]
        users = LegacyUser.query.filter(LegacyUser.role.in_(roles)).all()
        to_notify = [u.id for u in users]
        msg = f"Installation #{installation.id} has been marked Completed"
        create_notifications_for_users(to_notify, msg, object_type="installation", object_id=installation.id)

    return jsonify({"message": "Installation updated"}), 200





# ❌ DELETE installation
@manager_bp.route("/installations/<int:installation_id>", methods=["DELETE"])
@token_required
def delete_installation(current_user, installation_id):
    if current_user.role != "admin":  # Only Admins can delete
        return jsonify({"message": "Access forbidden"}), 403

    installation = LegacyInstallation.query.get(installation_id)
    if not installation:
        return jsonify({"message": "Installation not found"}), 404

    db.session.delete(installation)
    db.session.commit()
    return jsonify({"message": "Installation deleted"}), 200


# ✅ GET all technicians (for assignment dropdown)
@manager_bp.route("/technicians", methods=["GET"])
@token_required
def get_technicians(current_user):
    if current_user.role not in ["admin", "manager"]:
        return jsonify({"message": "Access forbidden"}), 403

    technicians = LegacyUser.query.filter_by(role="technician").all()
    return jsonify([
        {"id": t.id, "username": t.username, "email": t.email}
        for t in technicians
    ]), 200
