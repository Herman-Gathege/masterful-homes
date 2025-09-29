# backend/core/models.py
from datetime import datetime
from sqlalchemy import func
from enum import Enum

from extensions import db   # ✅ reuse the db instance

# ------------------------
# Enums
# ------------------------
class RoleEnum(str, Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    MANAGER = "manager"
    TECHNICIAN = "technician"
    FINANCE = "finance"
    CONTRACTOR = "contractor"

class TaskTypeEnum(str, Enum):
    INSTALLATION = "installation"
    REPAIR = "repair"
    DELIVERY = "delivery"
    INSPECTION = "inspection"
    CUSTOM = "custom"

class TaskStatusEnum(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"

class TimeEntryKindEnum(str, Enum):
    REGULAR = "regular"
    OVERTIME = "overtime"
    PTO = "pto"

class NotificationSeverityEnum(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

# ------------------------
# Association Tables
# ------------------------
task_assignments = db.Table(
    'task_assignments',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('assigned_at', db.DateTime(timezone=True), default=func.now()),
    db.Column('assigned_by', db.Integer, db.ForeignKey('users.id'), nullable=True),
)

task_required_items = db.Table(
    'task_required_items',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('inventory_item_id', db.Integer, db.ForeignKey('inventory_items.id'), primary_key=True),
    db.Column('qty_required', db.Integer, nullable=False, default=1)
)

# ------------------------
# Models
# ------------------------
class TenantConfig(db.Model):
    __tablename__ = "tenant_configs"
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.String(64), unique=True, nullable=False)
    enabled_modules = db.Column(db.JSON, nullable=False, default=list)
    branding = db.Column(db.JSON, nullable=True)
    trial_status = db.Column(db.String(128), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.String(64), index=True, nullable=False)
    email = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255))
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(RoleEnum), default=RoleEnum.TECHNICIAN)
    department = db.Column(db.String(128))
    team = db.Column(db.String(128))
    location = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        db.UniqueConstraint('tenant_id', 'email', name='uq_tenant_email'),
    )

    time_entries = db.relationship('TimeEntry', backref='user', lazy='dynamic')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic')

    # ✅ Explicit foreign key for many-to-many
    tasks = db.relationship(
        "Task",
        secondary=task_assignments,
        primaryjoin=(id == task_assignments.c.user_id),
        secondaryjoin=(id == task_assignments.c.user_id),
        back_populates="assignees"
    )


class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.String(64), index=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.Enum(TaskTypeEnum), default=TaskTypeEnum.CUSTOM)
    status = db.Column(db.Enum(TaskStatusEnum), default=TaskStatusEnum.DRAFT)
    priority = db.Column(db.Integer, default=3)
    due_date = db.Column(db.Date)
    scheduled_at = db.Column(db.DateTime(timezone=True))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    completed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    location = db.Column(db.Text)
    is_archived = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    # ✅ Explicit join with task_assignments.user_id
    assignees = db.relationship(
        "User",
        secondary=task_assignments,
        primaryjoin=(id == task_assignments.c.task_id),
        secondaryjoin=(User.id == task_assignments.c.user_id),
        back_populates="tasks"
    )

    notifications = db.relationship('Notification', backref='task', lazy='dynamic')
    required_items = db.relationship('InventoryItem', secondary=task_required_items, back_populates='tasks')

    # Optional: relationship to track who assigned the task
    assigned_by_user = db.relationship(
        "User",
        primaryjoin="Task.id==task_assignments.c.task_id",
        secondary=task_assignments,
        secondaryjoin="User.id==task_assignments.c.assigned_by",
        viewonly=True
    )

    __table_args__ = (
        db.Index("idx_task_tenant_status", "tenant_id", "status"),
    )


class InventoryItem(db.Model):
    __tablename__ = "inventory_items"
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.String(64), index=True, nullable=False)
    sku = db.Column(db.String(128))
    name = db.Column(db.String(255))
    qty_on_hand = db.Column(db.Integer, default=0)
    reorder_point = db.Column(db.Integer, default=0)
    location = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    tasks = db.relationship('Task', secondary=task_required_items, back_populates='required_items')

class TimeEntry(db.Model):
    __tablename__ = "time_entries"
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.String(64), index=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    start_time = db.Column(db.DateTime(timezone=True), nullable=False)
    end_time = db.Column(db.DateTime(timezone=True), nullable=True)
    kind = db.Column(db.Enum(TimeEntryKindEnum), default=TimeEntryKindEnum.REGULAR)
    status = db.Column(db.String(32), default="submitted")
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        db.Index("idx_timeentry_tenant_user", "tenant_id", "user_id"),
    )

class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.String(64), index=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    type = db.Column(db.String(128))
    message = db.Column(db.Text)
    payload = db.Column(db.JSON, nullable=True)
    severity = db.Column(db.Enum(NotificationSeverityEnum), default=NotificationSeverityEnum.INFO)
    read = db.Column(db.Boolean, default=False)
    delivered = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    read_at = db.Column(db.DateTime(timezone=True), nullable=True)

class AuditLog(db.Model):
    __tablename__ = "audit_logs"
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.String(64), index=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    action = db.Column(db.String(64))
    entity = db.Column(db.String(64))
    entity_id = db.Column(db.String(128))
    old_value = db.Column(db.JSON, nullable=True)
    new_value = db.Column(db.JSON, nullable=True)
    ip_address = db.Column(db.String(64), nullable=True)
    timestamp = db.Column(db.DateTime(timezone=True), server_default=func.now())
