# backend/modules/auth/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from extensions import db, bcrypt
from core.models import User

auth_bp = Blueprint("auth", __name__)


# -----------------------------
# Token Generation
# -----------------------------
def generate_tokens(user):
    additional_claims = {
        "tenant_id": user.tenant_id,
        "role": user.role,
        "email": user.email,
        "full_name": user.full_name or ""
    }
    access = create_access_token(
        identity=str(user.id),  # sub = string user ID
        fresh=True,
        additional_claims=additional_claims
    )
    refresh = create_refresh_token(
        identity=str(user.id),
        additional_claims=additional_claims
    )
    return {"access_token": access, "refresh_token": refresh}


# -----------------------------
# Register
# -----------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid payload"}), 400

    email = data.get("email")
    password = data.get("password")
    full_name = data.get("username") or data.get("full_name")
    tenant_id = data.get("tenant_id", "tenant_abc")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    # First user in tenant = admin
    existing_users = User.query.filter_by(tenant_id=tenant_id).count()
    role = "admin" if existing_users == 0 else "technician"

    pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(
        email=email,
        full_name=full_name,
        role=role,
        tenant_id=tenant_id,
        password_hash=pw_hash,
        is_active=True,
    )
    db.session.add(user)
    db.session.commit()

    tokens = generate_tokens(user)
    return jsonify({
        "message": "User registered successfully",
        "user": {"id": user.id, "email": user.email, "role": user.role},
        **tokens
    }), 201


# -----------------------------
# Login
# -----------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid payload"}), 400

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    tokens = generate_tokens(user)
    return jsonify({
        "message": "Login successful",
        "user": {"id": user.id, "email": user.email, "role": user.role},
        **tokens
    }), 200


# -----------------------------
# Refresh
# -----------------------------
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()  # now just user ID string
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    tokens = generate_tokens(user)
    return jsonify(tokens), 200


# -----------------------------
# Me
# -----------------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    claims = get_jwt()
    return jsonify({
        "id": int(user_id),
        "tenant_id": claims.get("tenant_id"),
        "role": claims.get("role"),
        "email": claims.get("email"),
        "full_name": claims.get("full_name"),
    }), 200


# -----------------------------
# Logout
# -----------------------------
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Logout successful"}), 200
