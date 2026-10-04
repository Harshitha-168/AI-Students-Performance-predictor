from flask import Blueprint

module1_bp = Blueprint('module1_students', __name__, url_prefix='/api')

from . import routes
