# backend/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from sqlalchemy.pool import QueuePool

# Configure SQLAlchemy with better connection management
db = SQLAlchemy(
    engine_options={
        "poolclass": QueuePool,     # Use QueuePool for stable connection reuse
        "pool_pre_ping": True,      # Ensures dead connections are recycled
        "pool_recycle": 1800,       # Reconnect every 30 minutes
        "pool_size": 10,            # Base pool size
        "max_overflow": 5,          # Allow up to 5 extra temporary connections
    }
)

bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()
