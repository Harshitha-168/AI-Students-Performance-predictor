import os
from flask import Flask, render_template, send_from_directory, jsonify
from config import Config
from core.db import init_db
from auth.routes import auth_bp
from modules.module1_students.routes import module1_bp
from modules.module2_prediction.routes import module2_bp
from modules.module3_suggestions.routes import module3_bp
from modules.module4_reports.routes import module4_bp

def create_app():
    """Application factory for AI Student Performance Predictor."""
    app = Flask(__name__, 
                template_folder="templates", 
                static_folder="static")
    
    app.config.from_object(Config)
    app.secret_key = Config.SECRET_KEY

    # Auto-initialize DB schema and seed on first run
    init_db()
    from seed_data import seed_database
    seed_database()

    # Register modular blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(module1_bp)
    app.register_blueprint(module2_bp)
    app.register_blueprint(module3_bp)
    app.register_blueprint(module4_bp)

    @app.route('/')
    def index():
        return render_template('index.html', 
                               app_name=Config.APP_NAME, 
                               version=Config.VERSION)

    @app.route('/health')
    def health():
        return jsonify({
            "status": "healthy",
            "app": Config.APP_NAME,
            "version": Config.VERSION,
            "modules": {
                "module1_student_management": "Active",
                "module2_ai_prediction": "Active",
                "module3_suggestions": "Active",
                "module4_reports": "Active"
            }
        })

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"success": False, "error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"success": False, "error": "Internal server error occurred"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    print(f"============================================================")
    print(f"  {Config.APP_NAME} v{Config.VERSION}")
    print(f"  Running on: http://{Config.HOST}:{Config.PORT}")
    print(f"============================================================")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
