from flask import Blueprint

hr_bp = Blueprint("hr", __name__, url_prefix="/hr")

@hr_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "HR module is alive!"}, 200
