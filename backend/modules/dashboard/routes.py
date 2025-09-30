# backend/modules/dashboard/routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity
from core.models import TenantConfig

# Import services but we won’t use them until JWT is ready
from .service import (
    active_employees_count,
    jobs_completed_today,
    low_stock_items,
    overdue_jobs_count,
    revenue_today
)

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Dashboard module is alive!"}, 200


@dashboard_bp.route("/kpi/overview", methods=["GET"])
def kpi_overview():
    """
    Temporary dummy data for frontend integration testing.
    Remove dummy data and use service functions once JWT/tenant context is ready.
    """
    data = {
        "active_employees": 12,
        "jobs_completed_today": 8,
        "overdue_jobs": 3,
        "low_stock": [
            {"id": 1, "name": "Cement Bags", "qty_on_hand": 12, "reorder_point": 20},
            {"id": 2, "name": "Steel Rods", "qty_on_hand": 5, "reorder_point": 15},
        ],
        "revenue_today": 15200,
    }
    return jsonify(data), 200


@dashboard_bp.route("/config", methods=["GET"])
def get_config():
    """
    Return tenant config that drives the frontend sidebar and branding.
    """
    tenant_id = None
    try:
        identity = get_jwt_identity()
        if isinstance(identity, dict):
            tenant_id = identity.get("tenant_id")
        elif isinstance(identity, str):
            tenant_id = identity
    except Exception:
        tenant_id = None

    # fallback to query param for now
    if not tenant_id:
        tenant_id = request.args.get("tenant_id")

    if not tenant_id:
        return jsonify({"error": "tenant_id required"}), 400

    config = TenantConfig.query.filter_by(tenant_id=tenant_id).first()
    if not config:
        return jsonify({"error": "Tenant config not found"}), 404

    return jsonify({
        "tenant_id": config.tenant_id,
        "enabled_modules": config.enabled_modules or [],
        "branding": config.branding or {},
        "trial_status": config.trial_status or ""
    }), 200
