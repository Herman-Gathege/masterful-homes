# backend/main.py
from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt, migrate   # ✅ import from extensions
from flask_jwt_extended.exceptions import JWTExtendedException
from flask import jsonify

def create_app(test_config=None):
    app = Flask(__name__)

    # Load default config
    app.config.from_object(Config)

    # Override if test config is provided
    if test_config:
        app.config.update(test_config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        import core.models

    CORS(app, resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://masterful-homes.vercel.app"
    ]}}, supports_credentials=True)

    

    # Import and register new module blueprints
    from modules.hr.routes import hr_bp
    # from modules.time.routes import time_bp
    from modules.tasks.routes import tasks_bp
    from modules.dashboard.routes import dashboard_bp
    # from modules.notifications.routes import notifications_bp
    from modules.auth.routes import auth_bp
    from modules.notifications import notifications_bp
    from modules.time import time_bp




    # Register new module blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")    
    app.register_blueprint(hr_bp, url_prefix="/api")
    # app.register_blueprint(time_bp, url_prefix="/api")
    app.register_blueprint(time_bp, url_prefix='/api/time')
    app.register_blueprint(tasks_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")
    # app.register_blueprint(notifications_bp)
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")

    

    @app.errorhandler(JWTExtendedException)
    def handle_jwt_errors(e):
        print("🔥 JWT ERROR:", str(e))
        return jsonify({"error": str(e)}), 422
    
    @app.route("/")
    def index():
        return {"message": "Welcome to Masterful Homes Backend!"}, 200
    
    @app.route("/api/health")
    def health():
        return {"status": "ok"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
