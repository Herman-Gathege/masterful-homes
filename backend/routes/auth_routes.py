# backend/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from legacy_models import db, LegacyUser
from flask_bcrypt import Bcrypt
from utils.jwt_utils import generate_tokens, decode_token
from config import Config

bcrypt = Bcrypt()
auth_bp = Blueprint("auth", __name__)


# REGISTER a new user (admin only should create others)
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "technician")  # default role if not specified

    if not username or not email or not password:
        return jsonify({"message": "Username, email, and password are required."}), 400

    if LegacyUser.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists with this email."}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = LegacyUser(
        username=username,
        email=email,
        password_hash=hashed_password,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": f"{role.capitalize()} registered successfully.",
        "id": new_user.id,
        "role": new_user.role
    }), 201


# LOGIN route
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    user = LegacyUser.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    # pass username into token generator so frontend can decode username
    access_token, refresh_token = generate_tokens(user.id, user.role, user.username)

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "role": user.role
    }), 200


# REFRESH token
@auth_bp.route("/refresh", methods=["POST"])
def refresh_token():
    data = request.get_json()
    refresh_token = data.get("refresh_token")
    if not refresh_token:
        return jsonify({"error": "Missing refresh_token"}), 400

    # decode with same secret (we use single secret for both tokens now)
    decoded = decode_token(refresh_token, Config.JWT_SECRET)

    if not decoded:
        return jsonify({"error": "Invalid or expired refresh token"}), 401

    user_id = decoded.get("user_id")
    role = decoded.get("role")
    username = decoded.get("username")

    # re-issue tokens (still include username)
    new_access_token, new_refresh_token = generate_tokens(user_id, role, username)

    return jsonify({
        "access_token": new_access_token,
        "refresh_token": new_refresh_token
    }), 200




# LOGOUT (client-side only in JWT)
@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logout successful"}), 200
