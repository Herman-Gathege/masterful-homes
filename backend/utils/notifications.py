from models import Notification, db
from datetime import datetime
import json

def create_notifications_for_users(user_ids, message, object_type=None, object_id=None, extra=None):
    objs = []
    for uid in set(user_ids):
        objs.append(Notification(
            user_id=uid,
            message=message,
            object_type=object_type,
            object_id=object_id,
            extra=json.dumps(extra) if extra else None,
            created_at=datetime.utcnow()
        ))
    db.session.bulk_save_objects(objs)
    db.session.commit()
