from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt  # Added get_jwt
from . import time_bp
from .service import clock_in, clock_out, get_current_status, get_timesheet, get_summary_report

@time_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Time module is alive!"}, 200

@time_bp.route('/clock-in', methods=['POST'])
@jwt_required()
def clock_in_route():
    current_user = get_jwt_identity()  # {'id': user_id, 'tenant_id': tenant_id, 'role': role}
    if current_user['role'] not in ['technician', 'contractor', 'manager']:  # Adjust roles as needed
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    try:
        entry = clock_in(
            user_id=current_user['id'],
            tenant_id=current_user['tenant_id'],
            kind=data.get('kind', 'regular'),
            task_id=data.get('task_id'),
            notes=data.get('notes')
        )
        return jsonify({'data': {'id': entry.id, 'start_time': entry.start_time.isoformat(), 'status': 'clocked_in'}, 'message': 'Clocked in successfully'}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 409

@time_bp.route('/clock-out', methods=['POST'])
@jwt_required()
def clock_out_route():
    current_user = get_jwt_identity()
    if current_user['role'] not in ['technician', 'contractor', 'manager']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    try:
        entry = clock_out(user_id=current_user['id'], notes=data.get('notes'))
        return jsonify({'data': {'id': entry.id, 'end_time': entry.end_time.isoformat(), 'duration_hours': entry.duration, 'kind': entry.kind}, 'message': 'Clocked out'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 409

@time_bp.route('/current-status', methods=['GET'])
@jwt_required()
def current_status_route():
    current_user = get_jwt_identity()
    tenant_id = request.args.get('tenant_id')
    if tenant_id != current_user['tenant_id']:
        return jsonify({'error': 'Tenant mismatch'}), 403
    
    status = get_current_status(user_id=current_user['id'], tenant_id=current_user['tenant_id'])
    return jsonify({'data': status}), 200

@time_bp.route('/timesheets/<int:user_id>', methods=['GET'])
@jwt_required()
def get_timesheet_route(user_id):
    """Generate a timesheet for a user for a specified period."""
    claims = get_jwt()  # Get full payload as dict
    current_user = {
        'id': claims['sub'],  # User ID from 'sub'
        'tenant_id': claims['tenant_id'],
        'role': claims['role'],
        'full_name': claims.get('username') or claims.get('email', 'Unknown')  # Fallback for name
    }
    if current_user['tenant_id'] != 'tenant_abc':  # Now current_user is a dict
        return jsonify({'error': 'Tenant mismatch'}), 403
    # Restrict access: only self, managers, or admins can view
    if current_user['id'] != str(user_id) and current_user['role'] not in ['manager', 'superadmin']:  # Cast id to str for comparison
        return jsonify({'error': 'Unauthorized'}), 403

    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    try:
        timesheet = get_timesheet(user_id, current_user['tenant_id'], start_date, end_date)
        return jsonify({'data': timesheet, 'user': {'id': user_id, 'name': current_user['full_name']}}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@time_bp.route('/reports/summary', methods=['GET'])
@jwt_required()
def get_summary_report_route():
    """Generate a summary report (manager/admin view)."""
    claims = get_jwt()  # Get full payload as dict
    current_user = {
        'tenant_id': claims['tenant_id'],
        'role': claims['role']
    }
    if current_user['role'] not in ['manager', 'superadmin']:
        return jsonify({'error': 'Unauthorized'}), 403

    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    try:
        report = get_summary_report(current_user['tenant_id'], start_date, end_date)
        return jsonify({'data': report}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400