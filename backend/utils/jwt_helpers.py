# backend/utils/jwt_helpers.py
from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

def get_tenant_from_jwt_or_query():
    """Return tenant_id (str) or None."""
    try:
        claims = get_jwt()
        if claims and "tenant_id" in claims:
            return claims.get("tenant_id")
    except Exception:
        pass
    # fallback to query param
    return request.args.get("tenant_id")

def require_tenant(func):
    """Decorator that ensures tenant_id is present (from JWT or query)."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        tenant_id = get_tenant_from_jwt_or_query()
        if not tenant_id:
            return jsonify({"error":"tenant_id required"}), 400
        # pass tenant_id as a kwarg to decorated function for convenience
        kwargs["tenant_id"] = tenant_id
        return func(*args, **kwargs)
    return wrapper

def get_current_user_id():
    """Return user_id as int if present in JWT identity, else None."""
    identity = get_jwt_identity()
    try:
        return int(identity)
    except Exception:
        return None
