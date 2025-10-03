# backend/modules/time/routes.py
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from . import time_bp, service


@time_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Time module is alive!"}, 200


# -----------------------------
# Clock In
# -----------------------------
@time_bp.route("/clock-in", methods=["POST"])
@jwt_required()
def clock_in_route():
    user_id = int(get_jwt_identity())  # sub = user id
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")
    role = claims.get("role")

    if role not in ["technician", "contractor", "employee", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json(silent=True) or {}
    start_time = data.get("start_time")

    try:
        entry = service.clock_in(user_id, tenant_id, start_time=start_time)
        return jsonify({
            "id": entry.id,
            "user_id": entry.user_id,
            "start_time": entry.start_time.isoformat(),
            "end_time": None,
            "status": "open"
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409


# -----------------------------
# Clock Out
# -----------------------------
@time_bp.route("/clock-out", methods=["POST"])
@jwt_required()
def clock_out_route():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    end_time = data.get("end_time")
    notes = data.get("notes")

    try:
        entry = service.clock_out(user_id, end_time=end_time, notes=notes)
        return jsonify({
            "id": entry.id,
            "user_id": entry.user_id,
            "start_time": entry.start_time.isoformat(),
            "end_time": entry.end_time.isoformat() if entry.end_time else None,
            "duration_hours": entry.duration
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# -----------------------------
# Current Status
# -----------------------------
@time_bp.route("/current-status", methods=["GET"])
@jwt_required()
def current_status_route():
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")

    requested_tenant = request.args.get("tenant_id")
    if requested_tenant != tenant_id:
        return jsonify({"error": "Tenant mismatch"}), 403

    status = service.get_current_status(user_id=user_id, tenant_id=tenant_id)
    return jsonify({"data": status}), 200


# -----------------------------
# Timesheets
# -----------------------------
@time_bp.route("/timesheets/<int:user_id>", methods=["GET"])
@jwt_required()
def get_timesheet_route(user_id):
    requester_id = int(get_jwt_identity())
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")
    role = claims.get("role")

    # Employees can only view their own timesheet
    if requester_id != user_id and role not in ["manager", "admin"]:
        return jsonify({"error": "Unauthorized"}), 403

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    try:
        data = service.get_timesheet(user_id, tenant_id, start_date, end_date)
        return jsonify({"data": data}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# -----------------------------
# Summary Report
# -----------------------------
@time_bp.route("/reports/summary", methods=["GET"])
@jwt_required()
def get_summary_report_route():
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")
    role = claims.get("role")

    if role not in ["manager", "superadmin"]:
        return jsonify({"error": "Unauthorized"}), 403

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    try:
        report = service.get_summary_report(tenant_id, start_date, end_date)
        return jsonify({"data": report}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# -----------------------------
# Exceptions
# -----------------------------
@time_bp.route("/exceptions", methods=["GET"])
@jwt_required()
def exceptions_route():
    claims = get_jwt()
    role = claims.get("role")
    tenant_id = claims.get("tenant_id")

    if role not in ["manager", "admin"]:
        return jsonify({"error": "Not authorized"}), 403

    data = service.get_exceptions(tenant_id)
    return jsonify({"data": data}), 200
