# backend/modules/hr/__init__.py
from flask import Blueprint

hr_bp = Blueprint("hr", __name__)

from . import routes  # noqa: E402,F401
