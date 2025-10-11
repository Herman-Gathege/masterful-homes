# backend/modules/hr/routes.py
from flask import request, jsonify
from flask_jwt_extended import jwt_required
from . import hr_bp
from . import service
from utils.jwt_helpers import get_tenant_from_jwt_or_query, get_current_user_id

@hr_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "HR module is alive!"}, 200

@hr_bp.route("/users", methods=["GET"])
@jwt_required(optional=True)
def list_users():
    tenant_id = get_tenant_from_jwt_or_query()
    if not tenant_id:
        return jsonify({"error": "tenant_id required"}), 400

    try:
        limit = int(request.args.get("limit", 25))
        offset = int(request.args.get("offset", 0))
    except Exception:
        return jsonify({"error":"limit/offset must be integers"}), 400

    filters = {
        "role": request.args.get("role"),
        "department": request.args.get("department"),
        "team": request.args.get("team"),
        "search": request.args.get("search"),
        "is_active": request.args.get("is_active")
    }

    data, total = service.get_users(tenant_id, limit=limit, offset=offset, filters=filters)
    return jsonify({"data": data, "total": total, "limit": limit, "offset": offset}), 200

@hr_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    tenant_id = get_tenant_from_jwt_or_query()
    user = service.get_user_by_id(tenant_id, user_id)
    if not user:
        return jsonify({"error":"User not found"}), 404
    return jsonify(user), 200

@hr_bp.route("/users", methods=["POST"])
@jwt_required()
def create_user():
    tenant_id = get_tenant_from_jwt_or_query()
    payload = request.get_json() or {}
    created = service.create_user(tenant_id, payload)
    return jsonify(created), 201

@hr_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    tenant_id = get_tenant_from_jwt_or_query()
    payload = request.get_json() or {}
    updated = service.update_user(tenant_id, user_id, payload)
    if not updated:
        return jsonify({"error":"User not found"}), 404
    return jsonify(updated), 200

@hr_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    tenant_id = get_tenant_from_jwt_or_query()
    service.delete_user(tenant_id, user_id)
    return jsonify({"message":"deleted"}), 200

@hr_bp.route("/users/invite", methods=["POST"])
@jwt_required()
def invite_user():
    tenant_id = get_tenant_from_jwt_or_query()
    payload = request.get_json() or {}
    result = service.invite_user(tenant_id, payload)
    return jsonify(result), 201

@hr_bp.route("/users/bulk", methods=["POST"])
@jwt_required()
def bulk_import():
    tenant_id = get_tenant_from_jwt_or_query()
    # Support multipart CSV or JSON array
    if "file" in request.files:
        file = request.files["file"]
        result = service.bulk_import_from_csv(tenant_id, file)
    else:
        payload = request.get_json(silent=True)
        result = service.bulk_import_from_json(tenant_id, payload or [])
    return jsonify(result), 200
