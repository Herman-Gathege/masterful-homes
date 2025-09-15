# backend/utils/jwt_utils.py
import jwt
from datetime import datetime, timedelta
from config import Config

def generate_tokens(user_id, role, username):
    """
    Returns (access_token, refresh_token)
    Access token short lived (15 min). Refresh token long lived (7 days).
    Both tokens include user_id, username, role to keep frontend decoding simple.
    """
    access_payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": datetime.utcnow() + timedelta(minutes=15),
    }

    refresh_payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7),
    }

    access_token = jwt.encode(access_payload, Config.JWT_SECRET, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, Config.JWT_SECRET, algorithm="HS256")

    # jwt.encode returns bytes in some pyjwt versions; convert to str if needed
    if isinstance(access_token, bytes):
        access_token = access_token.decode("utf-8")
    if isinstance(refresh_token, bytes):
        refresh_token = refresh_token.decode("utf-8")

    return access_token, refresh_token

def decode_token(token, secret):
    """
    Return decoded payload dict or None if invalid/expired.
    Use the given secret (we call with Config.JWT_SECRET).
    """
    try:
        return jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
