# backend/utils/auth_middleware.py
from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import decode_token
from models import User
from config import Config

PUBLIC_ROUTES = ["/api/login", "/api/refresh"]

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Allow unauthenticated access to login/refresh
        if request.path in PUBLIC_ROUTES:
            return f(*args, **kwargs)

        if request.method == "OPTIONS":  # CORS preflight
            return '', 200

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Token is missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        user_data = decode_token(token, Config.JWT_SECRET)

        if not user_data:
            return jsonify({"message": "Access token is invalid or expired"}), 401

        # Prevent refresh tokens from being used in Authorization header
        exp_seconds = user_data.get("exp")
        if not exp_seconds:
            return jsonify({"message": "Invalid token structure"}), 401

        # Load user from DB
        user = User.query.get(user_data["user_id"])
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Attach user to request context
        request.user = user

        return f(user, *args, **kwargs)

    return decorated
