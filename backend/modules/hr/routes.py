# backend/modules/hr/routes.py
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import hr_bp
from .service import query_users, get_user_by_id, create_user_invite, bulk_create_users

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def error_response(message, status_code=400):
    """Consistent JSON error response"""
    return jsonify({"status": "error", "message": message}), status_code

def audit_log(action, actor, details=None):
    """Simple audit log (stdout for now)"""
    logger.info(f"[AUDIT] {action} by {actor} | details={details}")

@hr_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"msg": "HR blueprint is alive"}), 200


# ------------------ USER ROUTES ------------------

@hr_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    try:
        tenant_id = get_jwt_identity().get("tenant_id")
        role = request.args.get("role")
        department = request.args.get("department")
        search = request.args.get("search")
        limit = int(request.args.get("limit", 25))
        offset = int(request.args.get("offset", 0))

        users, total = query_users(tenant_id, limit, offset, role, department, search)
        return jsonify({
            "status": "success",
            "total": total,
            "users": [
                {
                    "id": u.id,
                    "full_name": u.full_name,
                    "email": u.email,
                    "role": u.role,
                    "department": u.department,
                    "is_active": u.is_active,
                    "created_at": u.created_at.isoformat() if u.created_at else None
                } for u in users
            ]
        }), 200
    except Exception as e:
        return error_response(str(e), 500)


@hr_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    try:
        tenant_id = get_jwt_identity().get("tenant_id")
        user = get_user_by_id(user_id, tenant_id)
        if not user:
            return error_response("User not found", 404)
        return jsonify({
            "status": "success",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
                "department": user.department,
                "is_active": user.is_active
            }
        }), 200
    except Exception as e:
        return error_response(str(e), 500)


@hr_bp.route("/users/invite", methods=["POST"])
@jwt_required()
def invite_user():
    try:
        tenant_id = get_jwt_identity().get("tenant_id")
        actor = get_jwt_identity().get("email")

        data = request.get_json()
        email = data.get("email")
        full_name = data.get("full_name")
        role = data.get("role", "technician")
        department = data.get("department")

        if not email:
            return error_response("Email is required")

        user, temp_password = create_user_invite(tenant_id, email, full_name, role, department)

        # ✅ Audit log
        audit_log("invite_user", actor, {"invited": email, "role": role})

        return jsonify({
            "status": "success",
            "message": f"User {email} invited",
            "user_id": user.id,
            "temp_password": temp_password  # in production, you'd send by email instead
        }), 201
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response(str(e), 500)


@hr_bp.route("/users/bulk_invite", methods=["POST"])
@jwt_required()
def bulk_invite_users():
    try:
        tenant_id = get_jwt_identity().get("tenant_id")
        actor = get_jwt_identity().get("email")

        users = request.get_json().get("users", [])
        if not users:
            return error_response("No users provided")

        result = bulk_create_users(tenant_id, users)

        audit_log("bulk_invite_users", actor, {"created": result["created"], "skipped": result["skipped"]})

        return jsonify({"status": "success", "result": result}), 201
    except Exception as e:
        return error_response(str(e), 500)
