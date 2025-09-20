# backend/utils/decorators.py
from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import decode_token
from config import Config

def role_required(roles):
    """
    Restrict route to certain roles
    Usage: @role_required(["admin", "finance"])
    """
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            auth_header = request.headers.get("Authorization", None)
            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"message": "Missing or invalid Authorization header"}), 401

            token = auth_header.split(" ")[1]
            decoded = decode_token(token, Config.JWT_SECRET)

            if not decoded:
                return jsonify({"message": "Invalid or expired token"}), 401

            if decoded.get("role") not in roles:
                return jsonify({"message": "Forbidden: insufficient permissions"}), 403

            # Attach user info so downstream routes can use request.user
            request.user = decoded
            return fn(*args, **kwargs)
        return decorated
    return wrapper
