# from flask import Blueprint, request, jsonify
# from models import db, User
# from utils.auth_middleware import token_required

# admin_bp = Blueprint("admin", __name__)

# # GET all users
# @admin_bp.route("/admin/users", methods=["GET"])
# @token_required
# def get_users(current_user):
#     if current_user.role != "admin":
#         return jsonify({"message": "Access forbidden"}), 403

#     users = User.query.all()
#     users_data = [
#         {
#             "id": user.id,
#             "username": user.username,
#             "email": user.email,
#             "role": user.role,
#         }
#         for user in users
#     ]

#     return jsonify(users_data), 200


# # CREATE a new user
# @admin_bp.route("/admin/users", methods=["POST"])
# @token_required
# def create_user(current_user):
#     if current_user.role != "admin":
#         return jsonify({"message": "Access forbidden"}), 403

#     data = request.get_json()
#     if not data or not data.get("username") or not data.get("email") or not data.get("role"):
#         return jsonify({"message": "Missing required fields"}), 400

#     new_user = User(
#         username=data["username"],
#         email=data["email"],
#         password_hash=data.get("password_hash", "default"),  # hash properly in production
#         role=data["role"],
#     )

#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({"message": "User created successfully", "id": new_user.id}), 201


# # UPDATE a user
# @admin_bp.route("/admin/users/<int:user_id>", methods=["PUT"])
# @token_required
# def update_user(current_user, user_id):
#     if current_user.role != "admin":
#         return jsonify({"message": "Access forbidden"}), 403

#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"message": "User not found"}), 404

#     data = request.get_json()
#     user.username = data.get("username", user.username)
#     user.email = data.get("email", user.email)
#     user.role = data.get("role", user.role)

#     db.session.commit()
#     return jsonify({"message": "User updated successfully"}), 200


# # DELETE a user
# @admin_bp.route("/admin/users/<int:user_id>", methods=["DELETE"])
# @token_required
# def delete_user(current_user, user_id):
#     if current_user.role != "admin":
#         return jsonify({"message": "Access forbidden"}), 403

#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"message": "User not found"}), 404

#     db.session.delete(user)
#     db.session.commit()
#     return jsonify({"message": "User deleted successfully"}), 200

from flask import Blueprint, request, jsonify
from models import db, User
from utils.auth_middleware import token_required
from flask_bcrypt import Bcrypt

admin_bp = Blueprint("admin", __name__)
bcrypt = Bcrypt()

# 👥 GET all users
@admin_bp.route("/admin/users", methods=["GET"])
@token_required
def get_users(current_user):
    if current_user.role != "admin":
        return jsonify({"message": "Access forbidden"}), 403

    users = User.query.all()
    users_data = [{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    } for user in users]

    return jsonify(users_data), 200


# ➕ CREATE user
@admin_bp.route("/admin/users", methods=["POST"])
@token_required
def create_user(current_user):
    if current_user.role != "admin":
        return jsonify({"message": "Access forbidden"}), 403

    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not username or not email or not password or not role:
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists with this email"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, email=email,
                    password_hash=hashed_password, role=role)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "id": new_user.id}), 201


# ✏️ UPDATE user
@admin_bp.route("/admin/users/<int:user_id>", methods=["PUT"])
@token_required
def update_user(current_user, user_id):
    if current_user.role != "admin":
        return jsonify({"message": "Access forbidden"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)

    if data.get("password"):
        user.password_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200


# ❌ DELETE user
@admin_bp.route("/admin/users/<int:user_id>", methods=["DELETE"])
@token_required
def delete_user(current_user, user_id):
    if current_user.role != "admin":
        return jsonify({"message": "Access forbidden"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200
