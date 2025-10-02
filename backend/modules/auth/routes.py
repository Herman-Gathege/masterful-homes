# backend/modules/auth/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from extensions import db, bcrypt
from core.models import User

auth_bp = Blueprint("auth", __name__)


def generate_tokens(user):
    """Helper to generate access + refresh tokens with tenant + role claims."""
    identity = str(user.id)  # keep identity simple (string user.id)
    claims = {
        "username": user.full_name or user.email,
        "email": user.email,
        "role": user.role,
        "tenant_id": user.tenant_id,
    }
    return {
        "access_token": create_access_token(identity=identity, fresh=True, additional_claims=claims),
        "refresh_token": create_refresh_token(identity=identity, additional_claims=claims),
    }




@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid payload"}), 400

    email = data.get("email")
    password = data.get("password")
    full_name = data.get("username") or data.get("full_name")
    tenant_id = data.get("tenant_id", "tenant_abc")  # fallback for now

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    # Check if user already exists (by email)
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    # Decide role: if this is the first user for the tenant → admin, else technician
    existing_users = User.query.filter_by(tenant_id=tenant_id).count()
    if existing_users == 0:
        role = "admin"
    else:
        role = "technician"

    # Hash password
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


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()  # just user.id now
    if not identity:
        return jsonify({"error": "Invalid token"}), 401

    # Recreate user context
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    tokens = generate_tokens(user)
    return jsonify(tokens), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    identity = get_jwt_identity()  # user.id
    claims = get_jwt()  # includes role, email, tenant_id
    return jsonify({
        "user_id": identity,
        "username": claims.get("username"),
        "email": claims.get("email"),
        "role": claims.get("role"),
        "tenant_id": claims.get("tenant_id"),
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # If you’re using token blocklist, add token here
    return jsonify({"message": "Logout successful"}), 200
