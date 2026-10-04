from flask import Blueprint

module4_bp = Blueprint('module4_reports', __name__, url_prefix='/api/reports')

from . import routes
