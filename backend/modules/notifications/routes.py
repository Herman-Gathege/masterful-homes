from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from . import notifications_bp, service

@notifications_bp.route("", methods=["GET"])
@jwt_required()
def list_notifications():
    user_id = int(get_jwt_identity())   # now just "8"
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")

    limit = int(request.args.get("limit", 20))
    offset = int(request.args.get("offset", 0))

    notifs = service.get_notifications(user_id, limit, offset)
    return jsonify({
        "data": [
            {
                "id": n.id,
                "message": n.message,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat()
            } for n in notifs
        ],
        "pagination": {"limit": limit, "offset": offset, "count": len(notifs)}
    }), 200


@notifications_bp.route("/unread_count", methods=["GET"])
@jwt_required()
def unread_count():
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")

    count = service.get_unread_count(user_id)
    return jsonify({"unread_count": count}), 200


@notifications_bp.route("/read/<int:notif_id>", methods=["POST"])
@jwt_required()
def mark_read(notif_id):
    user_id = int(get_jwt_identity())
    notif = service.mark_as_read(user_id, notif_id)
    if not notif:
        return jsonify({"error": "Notification not found"}), 404
    return jsonify({"message": "Marked as read"}), 200


@notifications_bp.route("/read_all", methods=["POST"])
@jwt_required()
def mark_all_read():
    user_id = int(get_jwt_identity())
    service.mark_all_as_read(user_id)
    return jsonify({"message": "All notifications marked as read"}), 200
