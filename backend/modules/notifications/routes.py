from flask import Blueprint

# ✅ Give it a unique name
notifications_bp = Blueprint("notifications_module", __name__, url_prefix="/notifications")

@notifications_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Notifications module is alive!"}, 200
