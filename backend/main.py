# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# from flask_migrate import Migrate   # ✅ add this
# from config import Config

# # Initialize extensions
# db = SQLAlchemy()
# bcrypt = Bcrypt()
# jwt = JWTManager()
# migrate = Migrate()  # ✅ add this
# CORS()

# # Factory function to create app
# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     # Initialize extensions
#     db.init_app(app)
#     bcrypt.init_app(app)
#     jwt.init_app(app)
#     migrate.init_app(app, db)   # ✅ hook Migrate into the app
#     CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

#     # Import and register blueprints
#     from routes.auth_routes import auth_bp
#     from routes.admin_routes import admin_bp

#     app.register_blueprint(auth_bp, url_prefix="/api")
#     app.register_blueprint(admin_bp, url_prefix="/api")

#     @app.route("/")
#     def index():
#         return {"message": "Welcome to Masterful Homes Backend!"}, 200

#     return app


# if __name__ == "__main__":
#     app = create_app()
#     with app.app_context():
#         db.create_all()  # creates tables if they don't exist
#     app.run(host="0.0.0.0", port=5000, debug=True)


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
