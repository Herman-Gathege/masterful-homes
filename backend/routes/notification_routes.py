
#backend/routes/notification_routes.py
from flask import Blueprint, jsonify, request
from utils.auth_middleware import token_required
from legacy_models import db, LegacyNotification

notification_bp = Blueprint("notifications", __name__)

# 📌 List notifications
@notification_bp.route("/notifications", methods=["GET"])
@token_required
def list_notifications(current_user):
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))

    pagination = LegacyNotification.query.filter_by(user_id=current_user.id) \
        .order_by(LegacyNotification.created_at.desc()) \
        .paginate(page=page, per_page=per_page, error_out=False)

    data = [
        {
            "id": n.id,
            "message": n.message,
            "object_type": n.object_type,
            "object_id": n.object_id,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat()
        }
        for n in pagination.items
    ]
    return jsonify({
        "items": data,
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages
    }), 200


# 📌 Unread count
@notification_bp.route("/notifications/unread_count", methods=["GET"])
@token_required
def unread_count(current_user):
    count = LegacyNotification.query.filter_by(user_id=current_user.id, is_read=False).count()
    return jsonify({"unread": count}), 200


# 📌 Mark single notification as read
@notification_bp.route("/notifications/read/<int:notif_id>", methods=["POST"])
@token_required
def mark_read(current_user, notif_id):
    notif = LegacyNotification.query.filter_by(id=notif_id, user_id=current_user.id).first()
    if not notif:
        return jsonify({"message": "Not found"}), 404
    notif.is_read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read"}), 200


# 📌 Mark all as read
@notification_bp.route("/notifications/read_all", methods=["POST"])
@token_required
def mark_all_read(current_user):
    LegacyNotification.query.filter_by(user_id=current_user.id, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"message": "All notifications marked as read"}), 200
