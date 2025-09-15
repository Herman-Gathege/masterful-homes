# backend/main.py


from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt, migrate   # ✅ import from extensions

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Import and register blueprints
    from routes.auth_routes import auth_bp
    from routes.admin_routes import admin_bp
    from routes.manager_routes import manager_bp
    from routes.finance_routes import finance_bp

    app.register_blueprint(finance_bp, url_prefix="/api")
    app.register_blueprint(manager_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")

    @app.route("/")
    def index():
        return {"message": "Welcome to Masterful Homes Backend!"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
