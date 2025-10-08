# backend/tests/test_seed.py
import os
import sys

# Add the parent directory to the Python path to find main.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from datetime import datetime, timezone
from main import create_app
from extensions import db
from core.models import User, Task, TimeEntry, InventoryItem, Notification, AuditLog, TenantConfig, Shift

def test_seed_data():
    app = create_app()
    with app.app_context():
        print("🔍 Testing seed data for tenant 'tenant_abc'...")
        tenant = "tenant_abc"

        # Test Users
        users = User.query.filter_by(tenant_id=tenant).all()
        print(f"👤 Users: {len(users)} (Expected ~10)")
        for user in users[:5]:  # Show first 5
            print(f"  - {user.full_name} ({user.email}, {user.role.value})")

        # Test Tasks
        tasks = Task.query.filter_by(tenant_id=tenant).all()
        print(f"📋 Tasks: {len(tasks)} (Expected 500)")
        for task in tasks[:3]:  # Show first 3
            print(f"  - {task.title} (Status: {task.status.value}, Due: {task.due_date})")

        # Test Inventory
        inventory = InventoryItem.query.filter_by(tenant_id=tenant).all()
        print(f"📦 Inventory Items: {len(inventory)} (Expected 20)")
        for item in inventory[:3]:  # Show first 3
            print(f"  - {item.name} (Qty: {item.qty_on_hand})")

        # Test Time Entries
        time_entries = TimeEntry.query.filter_by(tenant_id=tenant).all()
        print(f"⏰ Time Entries: {len(time_entries)} (Expected ~70)")
        for entry in time_entries[:3]:  # Show first 3
            print(f"  - User {entry.user_id} (Start: {entry.start_time}, Kind: {entry.kind.value})")

        # Test Notifications
        notifications = Notification.query.filter_by(tenant_id=tenant).all()
        print(f"🔔 Notifications: {len(notifications)} (Expected 10)")
        for note in notifications[:3]:  # Show first 3
            print(f"  - {note.message} (Severity: {note.severity.value})")

        # Test Audit Logs
        audit_logs = AuditLog.query.filter_by(tenant_id=tenant).all()
        print(f"📜 Audit Logs: {len(audit_logs)} (Expected 10)")
        for log in audit_logs[:3]:  # Show first 3
            print(f"  - {log.action} on {log.entity} (ID: {log.entity_id})")

        # Test Tenant Config
        config = TenantConfig.query.filter_by(tenant_id=tenant).first()
        print(f"🏢 Tenant Config: {'Found' if config else 'Not Found'} (Expected 1)")
        if config:
            print(f"  - Modules: {config.enabled_modules}")

        # Test Shifts
        shifts = Shift.query.filter_by(tenant_id=tenant).all()
        print(f"⏳ Shifts: {len(shifts)} (Expected 100)")
        for shift in shifts[:3]:  # Show first 3
            print(f"  - Start: {shift.start_time}, Role: {shift.role.value}")

        print("✅ Seed test complete!")

if __name__ == "__main__":
    test_seed_data()