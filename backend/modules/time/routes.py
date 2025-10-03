# backend/modules/time/routes.py
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from . import time_bp, service
from datetime import datetime
from core.models import Shift



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
        if not entry:
            return jsonify({"error": "No active clock-in found"}), 404

        return jsonify({
            "id": entry.id,
            "user_id": entry.user_id,
            "start_time": entry.start_time.isoformat(),
            "end_time": entry.end_time.isoformat() if entry.end_time else None,
            "duration_hours": entry.duration or 0.0
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"error": "Unexpected server error", "details": str(e)}), 500



# -----------------------------
# Current Status
# -----------------------------
@time_bp.route("/current-status", methods=["GET"])
@jwt_required()
def current_status_route():
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")

    status = service.get_current_status(user_id=user_id, tenant_id=tenant_id)
    return jsonify({"data": status}), 200


    # status = service.get_current_status(user_id=user_id, tenant_id=tenant_id)
    # return jsonify({"data": status}), 200


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


# -----------------------------
# Shifts
# -----------------------------
@time_bp.route("/shifts", methods=["GET"])
@jwt_required()
def get_shifts_route():
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")

    shifts = Shift.query.filter_by(tenant_id=tenant_id).all()
    return jsonify({
        "data": [
            {
                "id": s.id,
                "start_time": s.start_time.isoformat(),
                "end_time": s.end_time.isoformat(),
                "role": s.role,
                "team": s.team,
                "description": s.description,
                "is_recurring": s.is_recurring,
                "assignees": [u.id for u in s.assignees]
            } for s in shifts
        ]
    }), 200


@time_bp.route("/shifts", methods=["POST"])
@jwt_required()
def create_shift_route():
    claims = get_jwt()
    tenant_id = claims.get("tenant_id")

    data = request.get_json() or {}
    try:
        start_time = datetime.fromisoformat(data["start_time"].replace("Z", "+00:00"))
        end_time = datetime.fromisoformat(data["end_time"].replace("Z", "+00:00"))
        shift = service.create_shift(
            tenant_id,
            start_time,
            end_time,
            role=data.get("role"),
            team=data.get("team"),
            description=data.get("description"),
            is_recurring=data.get("is_recurring", False)
        )
        return jsonify({
            "id": shift.id,
            "start_time": shift.start_time.isoformat(),
            "end_time": shift.end_time.isoformat(),
            "role": shift.role,
            "team": shift.team,
            "description": shift.description,
            "is_recurring": shift.is_recurring
        }), 201
    except (KeyError, ValueError) as e:
        return jsonify({"error": str(e)}), 400


@time_bp.route("/shifts/<int:shift_id>", methods=["DELETE"])
@jwt_required()
def delete_shift_route(shift_id):
    try:
        result = service.delete_shift(shift_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 404


@time_bp.route("/shifts/<int:shift_id>/assign", methods=["POST"])
@jwt_required()
def assign_shift_users_route(shift_id):
    data = request.get_json() or {}
    user_ids = data.get("user_ids", [])
    try:
        result = service.assign_users(shift_id, user_ids)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
