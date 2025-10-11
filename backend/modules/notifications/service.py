# backend/modules/notifications/service.py
from core.models import db, Notification
from datetime import datetime

def get_notifications(user_id, limit=20, offset=0):
    return (
        Notification.query.filter_by(user_id=user_id)
        .order_by(Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

def get_unread_count(user_id):
    return Notification.query.filter_by(user_id=user_id, is_read=False).count()

def mark_as_read(user_id, notif_id):
    notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
    if notif:
        notif.is_read = True
        db.session.commit()
    return notif

def mark_all_as_read(user_id):
    Notification.query.filter_by(user_id=user_id, is_read=False).update({"is_read": True})
    db.session.commit()
    return True

def create_notification(tenant_id, user_id, message, severity="info", payload=None):
    n = Notification(tenant_id=tenant_id, user_id=user_id, message=message, severity=severity, payload=payload, created_at=datetime.utcnow())
    db.session.add(n); db.session.commit()
    return n