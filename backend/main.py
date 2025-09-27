# backend/main.py
from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt, migrate   # ✅ import from extensions
from modules.config.routes import bp as config_bp


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

    # ✅ Correctly place CORS inside create_app
    CORS(app, resources={r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://masterful-homes.vercel.app"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }})

    # Import and register older blueprints
    from routes.auth_routes import auth_bp
    from routes.admin_routes import admin_bp
    from routes.manager_routes import manager_bp
    from routes.finance_routes import finance_bp
    from routes.customer_routes import customer_bp
    from routes.search_routes import search_bp
    from routes.notification_routes import notification_bp
    from routes.invoice_routes import invoice_bp

    # Import and register new module blueprints
    app.register_blueprint(config_bp)
    from modules.hr.routes import hr_bp
    from modules.time.routes import time_bp
    from modules.tasks.routes import tasks_bp
    from modules.dashboard.routes import dashboard_bp
    from modules.notifications.routes import notifications_bp

    app.register_blueprint(hr_bp, url_prefix="/api")
    app.register_blueprint(time_bp, url_prefix="/api")
    app.register_blueprint(tasks_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")
    app.register_blueprint(notifications_bp, url_prefix="/api")

    # Register older blueprints
    app.register_blueprint(invoice_bp, url_prefix="/api")
    app.register_blueprint(notification_bp, url_prefix="/api")
    app.register_blueprint(search_bp, url_prefix="/api")
    app.register_blueprint(customer_bp, url_prefix="/api")
    app.register_blueprint(finance_bp, url_prefix="/api")
    app.register_blueprint(manager_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")

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
