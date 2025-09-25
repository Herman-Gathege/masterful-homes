from flask import Blueprint

tasks_bp = Blueprint("tasks", __name__, url_prefix="/tasks")

@tasks_bp.route("/ping", methods=["GET"])
def ping():
    return {"message": "Tasks module is alive!"}, 200
