# backend/modules/hr/service.py
import csv
import io
import secrets
from datetime import datetime, timezone

from extensions import db, bcrypt
from core.models import User

# -------------------------
# Helper: serialize user
# -------------------------
def _serialize_user(u: User):
    return {
        "id": u.id,
        "tenant_id": u.tenant_id,
        "email": u.email,
        "full_name": u.full_name,
        "role": u.role.value if hasattr(u.role, "value") else str(u.role),
        "department": u.department,
        "team": u.team,
        "location": u.location,
        "is_active": u.is_active,
        "last_login": u.last_login.isoformat() if u.last_login else None,
        "created_at": u.created_at.isoformat() if u.created_at else None,
        "updated_at": u.updated_at.isoformat() if u.updated_at else None,
    }

# -------------------------
# Get users (pagination + filters + search)
# -------------------------
def get_users(tenant_id, limit=25, offset=0, filters=None):
    filters = filters or {}
    q = User.query.filter_by(tenant_id=tenant_id)

    if filters.get("role"):
        q = q.filter(User.role == filters["role"])
    if filters.get("department"):
        q = q.filter(User.department == filters["department"])
    if filters.get("team"):
        q = q.filter(User.team == filters["team"])
    if filters.get("is_active") is not None:
        val = filters["is_active"]
        if isinstance(val, str):
            val = val.lower() in ("1", "true", "yes")
        q = q.filter(User.is_active == val)
    if filters.get("search"):
        s = f"%{filters['search'].lower()}%"
        # simple ILIKE on name and email
        q = q.filter(
            db.or_(
                db.func.lower(User.full_name).ilike(s),
                db.func.lower(User.email).ilike(s)
            )
        )

    total = q.count()
    rows = q.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    return [ _serialize_user(u) for u in rows ], total

# -------------------------
# Get single user
# -------------------------
def get_user_by_id(tenant_id, user_id):
    u = User.query.filter_by(tenant_id=tenant_id, id=user_id).first()
    return _serialize_user(u) if u else None

# -------------------------
# Create user
# -------------------------
def create_user(tenant_id, payload):
    email = payload.get("email")
    if not email:
        raise ValueError("email required")
    if User.query.filter_by(tenant_id=tenant_id, email=email).first():
        raise ValueError("user with that email already exists in tenant")

    pw = payload.get("password") or secrets.token_urlsafe(8)
    pw_hash = bcrypt.generate_password_hash(pw).decode("utf-8")

    user = User(
        tenant_id=tenant_id,
        email=email,
        full_name=payload.get("full_name") or payload.get("username"),
        password_hash=pw_hash,
        role=payload.get("role") or User.role.type.enums[0] if hasattr(User.role, "type") else payload.get("role"),
        department=payload.get("department"),
        team=payload.get("team"),
        location=payload.get("location"),
        is_active=payload.get("is_active", True),
        last_login=None
    )
    db.session.add(user)
    db.session.commit()
    return _serialize_user(user)

# -------------------------
# Update user
# -------------------------
def update_user(tenant_id, user_id, payload):
    u = User.query.filter_by(tenant_id=tenant_id, id=user_id).first()
    if not u:
        return None
    for k in ("email","full_name","department","team","location","is_active"):
        if k in payload:
            setattr(u, k, payload[k])
    if "password" in payload and payload["password"]:
        u.password_hash = bcrypt.generate_password_hash(payload["password"]).decode("utf-8")
    db.session.commit()
    return _serialize_user(u)

# -------------------------
# Delete user
# -------------------------
def delete_user(tenant_id, user_id):
    u = User.query.filter_by(tenant_id=tenant_id, id=user_id).first()
    if not u:
        return None
    db.session.delete(u)
    db.session.commit()
    return True

# -------------------------
# Invite user (simple invite token + inactive user)
# -------------------------
def invite_user(tenant_id, payload):
    email = payload.get("email")
    if not email:
        raise ValueError("email required")
    existing = User.query.filter_by(tenant_id=tenant_id, email=email).first()
    if existing:
        return {"message":"User already exists", "user": _serialize_user(existing)}

    invite_token = secrets.token_urlsafe(32)
    # create inactive user row (password set to random); frontend completes registration by using token
    pw_hash = bcrypt.generate_password_hash(secrets.token_urlsafe(8)).decode("utf-8")
    user = User(
        tenant_id=tenant_id,
        email=email,
        full_name=payload.get("full_name"),
        password_hash=pw_hash,
        role=payload.get("role") or "technician",
        department=payload.get("department"),
        team=payload.get("team"),
        location=payload.get("location"),
        is_active=False,
        last_login=None,
        created_at=datetime.now(timezone.utc)
    )
    # store invite_token in a lightweight way: use a transient property on the response (no Invite model)
    db.session.add(user)
    db.session.commit()
    # In production: save token to Invite table or send email with token; here we return it
    return {"message":"invite_created", "invite_token": invite_token, "user": _serialize_user(user)}

# -------------------------
# Bulk import: CSV handler
# -------------------------
def bulk_import_from_csv(tenant_id, file_storage):
    """
    Expects a CSV with headers: email,full_name,role,department,team,location,is_active
    Returns per-row summary.
    """
    stream = io.StringIO(file_storage.stream.read().decode("utf-8"))
    reader = csv.DictReader(stream)
    results = {"created":0, "skipped":0, "errors":[]}
    for idx, row in enumerate(reader, start=1):
        try:
            email = (row.get("email") or "").strip()
            if not email:
                results["errors"].append({"row": idx, "error":"missing email"})
                continue
            existing = User.query.filter_by(tenant_id=tenant_id, email=email).first()
            if existing:
                results["skipped"] += 1
                continue
            payload = {
                "email": email,
                "full_name": row.get("full_name"),
                "role": row.get("role"),
                "department": row.get("department"),
                "team": row.get("team"),
                "location": row.get("location"),
                "is_active": row.get("is_active", "true").lower() in ("1","true","yes")
            }
            create_user(tenant_id, payload)
            results["created"] += 1
        except Exception as e:
            results["errors"].append({"row": idx, "error": str(e)})
    return results

# -------------------------
# Bulk import: JSON array
# -------------------------
def bulk_import_from_json(tenant_id, array_payload):
    results = {"created":0, "skipped":0, "errors":[]}
    if not isinstance(array_payload, list):
        return {"error":"payload must be a list"}
    for idx, item in enumerate(array_payload, start=1):
        try:
            email = (item.get("email") or "").strip()
            if not email:
                results["errors"].append({"row": idx, "error":"missing email"})
                continue
            existing = User.query.filter_by(tenant_id=tenant_id, email=email).first()
            if existing:
                results["skipped"] += 1
                continue
            create_user(tenant_id, item)
            results["created"] += 1
        except Exception as e:
            results["errors"].append({"row": idx, "error": str(e)})
    return results
