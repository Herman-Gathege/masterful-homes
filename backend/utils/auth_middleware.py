# backend/utils/auth_middleware.py
from functools import wraps
from flask import request, jsonify
# from utils.jwt_utils import decode_jwt
from utils.jwt_utils import decode_token
from models import User  
from config import Config

PUBLIC_ROUTES = ["/api/login", "/api/refresh"]

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Skip authentication for public routes
        if request.path in PUBLIC_ROUTES:
            return f(*args, **kwargs)
        
        if request.method == "OPTIONS":
            return '', 200

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Token is missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        try:
            # user_data = decode_jwt(token)
            user_data = decode_token(token, Config.JWT_SECRET)

            user = User.query.get(user_data["user_id"])

            if not user:
                return jsonify({"message": "User not found"}), 404

            # Attach user to request
            request.user = user
        except Exception:
            return jsonify({"message": "Token is invalid"}), 401

        return f(user, *args, **kwargs)

    return decorated

