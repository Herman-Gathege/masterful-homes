from main import create_app, db
from models import User
from flask_bcrypt import Bcrypt

app = create_app()
bcrypt = Bcrypt()

with app.app_context():
    if not User.query.filter_by(role="admin").first():
        admin = User(
            username="superadmin",
            email="admin@masterfulhomes.com",
            password_hash=bcrypt.generate_password_hash("admin123").decode("utf-8"),
            role="admin",
        )
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin user created: admin@masterfulhomes.com / admin123")
    else:
        print("ℹ️ Admin already exists")
