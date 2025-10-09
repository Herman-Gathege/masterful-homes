# backend/utils/auth_middleware.py

from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import decode_token
from config import Config
from legacy_models import LegacyUser

PUBLIC_ROUTES = ["/api/login", "/api/refresh"]

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.path in PUBLIC_ROUTES:
            return f(*args, **kwargs)
        if request.method == "OPTIONS":
            return '', 200

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Token is missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        user_data = decode_token(token, Config.JWT_SECRET)

        if not user_data:
            return jsonify({"message": "Access token is invalid or expired"}), 401

        # ✅ Support both PyJWT 'sub' and custom 'user_id'
        user_id = user_data.get("user_id") or user_data.get("sub")
        if not user_id:
            return jsonify({"message": "Invalid token payload"}), 401

        user = LegacyUser.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        request.user = user
        return f(user, *args, **kwargs)

    return decorated
