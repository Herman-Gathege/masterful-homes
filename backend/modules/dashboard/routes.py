#backend/modules/dashboard/routes.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.models import TenantConfig


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
# @jwt_required()  # protect if required
def kpi_overview():
    # In multi-tenant systems, you’d extract tenant_id from the JWT claims or request context.
    # For now, assume tenant_id is passed as a query param or in JWT.
    tenant_id = request.args.get("tenant_id") or get_jwt_identity().get("tenant_id")

    # Gather KPIs
    active_employees = active_employees_count(tenant_id)
    jobs_done = jobs_completed_today(tenant_id)
    overdue_jobs = overdue_jobs_count(tenant_id)
    revenue = revenue_today(tenant_id)
    low_stock = low_stock_items(tenant_id)

    # Format inventory items into something JSON-friendly
    low_stock_list = [
        {"id": item.id, "name": item.name, "qty_on_hand": item.qty_on_hand, "reorder_point": item.reorder_point}
        for item in low_stock
    ]

    return jsonify({
        "active_employees": active_employees,
        "jobs_completed_today": jobs_done,
        "overdue_jobs": overdue_jobs,
        "low_stock": low_stock_list,
        "revenue_today": revenue,
    })



@dashboard_bp.route("/config", methods=["GET"])
# @jwt_required(optional=True)  # optional while testing
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
