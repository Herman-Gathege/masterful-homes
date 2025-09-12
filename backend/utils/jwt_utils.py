import jwt
from datetime import datetime, timedelta
from config import Config


def generate_tokens(user_id, role):
    # Access Token (short-lived)
    access_payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }

    # Refresh Token (long-lived)
    refresh_payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    access_token = jwt.encode(access_payload, Config.JWT_SECRET, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, Config.JWT_REFRESH_SECRET, algorithm="HS256")

    return access_token, refresh_token

def decode_token(token, secret):
    try:
        return jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
