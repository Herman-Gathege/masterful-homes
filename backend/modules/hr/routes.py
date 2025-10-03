from flask import Blueprint

hr_bp = Blueprint("hr", __name__, url_prefix="/hr")

@hr_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "HR module is alive!"}, 200


# backend/modules/hr/routes.py
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

from . import hr_bp
from .service import query_users, get_user_by_id, create_user_invite, bulk_create_users

def extract_tenant_from_request():
    tenant_id = request.args.get("tenant_id")
    if tenant_id:
        return tenant_id
    try:
        identity = get_jwt_identity()
        if isinstance(identity, dict):
            return identity.get("tenant_id")
    except Exception:
        return None
    return None

def require_role(allowed=None):
    allowed = allowed or ["admin", "hr", "manager"]
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def wrapped(*args, **kwargs):
            identity = get_jwt_identity()
            role = identity.get("role") if isinstance(identity, dict) else None
            if role not in allowed:
                return jsonify({"error": "forbidden"}), 403
            return f(*args, **kwargs)
        return wrapped
    return decorator

@hr_bp.route("/users", methods=["GET"])
@jwt_required(optional=True)
def list_users():
    tenant_id = extract_tenant_from_request()
    if not tenant_id:
        return jsonify({"error": "tenant_id required (query param or in JWT)"}), 400

    try:
        limit = int(request.args.get("limit", 25))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        return jsonify({"error": "limit/offset must be integers"}), 400

    role = request.args.get("role")
    department = request.args.get("department")
    search = request.args.get("search")

    users, total = query_users(tenant_id, limit, offset, role, department, search)

    # Basic serializer (avoid depending on model helper methods)
    data = []
    for u in users:
        data.append({
            "id": u.id,
            "tenant_id": u.tenant_id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "department": u.department,
            "team": getattr(u, "team", None),
            "location": getattr(u, "location", None),
            "is_active": u.is_active,
            "last_login": u.last_login.isoformat() if getattr(u, "last_login", None) else None,
            "created_at": u.created_at.isoformat() if getattr(u, "created_at", None) else None,
        })

    return jsonify({"data": data, "total": total, "limit": limit, "offset": offset}), 200

@hr_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required(optional=True)
def get_user(user_id):
    tenant_id = extract_tenant_from_request()
    user = get_user_by_id(user_id, tenant_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "tenant_id": user.tenant_id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "department": user.department,
        "team": getattr(user, "team", None),
        "location": getattr(user, "location", None),
        "is_active": user.is_active,
        "last_login": user.last_login.isoformat() if getattr(user, "last_login", None) else None,
        "created_at": user.created_at.isoformat() if getattr(user, "created_at", None) else None,
    }), 200

@hr_bp.route("/users/invite", methods=["POST"])
@require_role(["admin", "hr", "manager"])
def invite_user():
    payload = request.get_json() or {}
    tenant_id = payload.get("tenant_id") or extract_tenant_from_request()
    if not tenant_id:
        return jsonify({"error": "tenant_id required"}), 400

    email = payload.get("email")
    if not email:
        return jsonify({"error": "email required"}), 400

    try:
        user, temp_password = create_user_invite(
            tenant_id=tenant_id,
            email=email,
            full_name=payload.get("full_name"),
            role=payload.get("role", "technician"),
            department=payload.get("department")
        )
        # In prod: send invite email instead of returning password
        return jsonify({"message": "User invited", "id": user.id, "temp_password": temp_password}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": "failed to create user", "detail": str(e)}), 500

@hr_bp.route("/users/bulk", methods=["POST"])
@require_role(["admin", "hr", "manager"])
def bulk_users():
    payload = request.get_json() or {}
    tenant_id = payload.get("tenant_id") or extract_tenant_from_request()
    if not tenant_id:
        return jsonify({"error": "tenant_id required"}), 400

    users = payload.get("users")
    if not users or not isinstance(users, list):
        return jsonify({"error": "expected 'users' as JSON array"}), 400

    result = bulk_create_users(tenant_id, users)
    return jsonify(result), 200
