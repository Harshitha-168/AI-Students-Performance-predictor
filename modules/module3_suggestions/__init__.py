from flask import Blueprint

module3_bp = Blueprint('module3_suggestions', __name__, url_prefix='/api/suggestions')

from . import routes
