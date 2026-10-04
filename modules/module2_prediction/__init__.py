from flask import Blueprint

module2_bp = Blueprint('module2_prediction', __name__, url_prefix='/api/predict')

from . import routes
