from flask import Blueprint, request, jsonify

bp = Blueprint("config", __name__, url_prefix="/api")

@bp.route("/config", methods=["GET"])
def get_config():
    """
    Simple config endpoint.
    If your backend has a DB model for tenant config, backend dev can replace
    this static response with a DB lookup later.
    """
    tenant = request.args.get("tenant_id", "tenant_abc")
    sample = {
        "tenant_id": tenant,
        "enabled_modules": ["dashboard", "hr", "tasks", "time", "notifications"],
        "branding": {
            "logo_url": "/static/img/logo.png",
            "theme": "blue"
        },
        "trial_status": False
    }
    return jsonify(sample)
