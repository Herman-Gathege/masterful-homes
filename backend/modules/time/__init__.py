from flask import Blueprint

time_bp = Blueprint('time', __name__)

from . import routes  # Import routes to register them