# backend/modules/hr/service.py
from uuid import uuid4
from sqlalchemy import or_
from extensions import db, bcrypt
from core.models import User
from datetime import datetime

def query_users(tenant_id, limit=25, offset=0, role=None, department=None, search=None):
    """
    Returns (list_of_users, total_count)
    """
    q = User.query.filter_by(tenant_id=tenant_id)

    if role:
        q = q.filter(User.role == role)
    if department:
        q = q.filter(User.department == department)
    if search:
        term = f"%{search}%"
        q = q.filter(or_(User.full_name.ilike(term), User.email.ilike(term)))

    total = q.count()
    results = q.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    return results, total

def get_user_by_id(user_id, tenant_id=None):
    q = User.query.filter_by(id=user_id)
    if tenant_id:
        q = q.filter_by(tenant_id=tenant_id)
    return q.first()

def create_user_invite(tenant_id, email, full_name=None, role="technician", department=None):
    """
    Create a user record with is_active=False and a generated temporary password.
    Returns (user, temp_password)
    """
    existing = User.query.filter_by(tenant_id=tenant_id, email=email).first()
    if existing:
        raise ValueError("User with this email already exists for the tenant")

    temp_password = "ChangeMe123!"  # development default — change in production flow
    pw_hash = bcrypt.generate_password_hash(temp_password).decode("utf-8")

    user = User(
        tenant_id=tenant_id,
        email=email,
        full_name=full_name or "",
        role=role,
        department=department,
        is_active=False,
        password_hash=pw_hash,
        created_at=datetime.utcnow()
    )

    db.session.add(user)
    db.session.commit()

    return user, temp_password

def bulk_create_users(tenant_id, users):
    """
    users: array of objects { email, full_name, role, department, location, team }
    Returns: {"created": n, "skipped": [emails], "errors": [...]}
    """
    created = 0
    skipped = []
    errors = []

    for u in users:
        email = u.get("email")
        if not email:
            errors.append({"error": "missing email", "entry": u})
            continue

        if User.query.filter_by(tenant_id=tenant_id, email=email).first():
            skipped.append(email)
            continue

        try:
            _, _ = create_user_invite(
                tenant_id=tenant_id,
                email=email,
                full_name=u.get("full_name"),
                role=u.get("role", "technician"),
                department=u.get("department")
            )
            created += 1
        except Exception as e:
            errors.append({"email": email, "error": str(e)})

    return {"created": created, "skipped": skipped, "errors": errors}
