from flask import Blueprint

time_bp = Blueprint("time", __name__, url_prefix="/time")

@time_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Time module is alive!"}, 200
