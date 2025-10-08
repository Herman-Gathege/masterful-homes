# backend/tests/test_service.py
import os
import sys
from datetime import datetime, timezone, timedelta

# Add the parent directory to the Python path to find main.py and service.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import create_app
from extensions import db
from core.models import User, TimeEntry, Shift, Notification, TimeEntryKindEnum
from modules.time.service import clock_in, clock_out, check_missing_clockouts, validate_overlaps, create_notification

def test_service_functions():
    app = create_app()
    with app.app_context():
        print("🔍 Testing service.py functions with seeded data for tenant 'tenant_abc'...")
        tenant = "tenant_abc"

        # Fetch a user (e.g., tech1)
        user = User.query.filter_by(tenant_id=tenant, email="tech1@masterfulhomes.com").first()
        if not user:
            print("❌ Test failed: User 'tech1@masterfulhomes.com' not found in seed data.")
            return

        # Fetch a shift (for overlap testing)
        shift = Shift.query.filter_by(tenant_id=tenant).first()
        if not shift:
            print("❌ Test failed: No shifts found in seed data.")
            return

        # Clean up any existing open TimeEntry for the user
        print(f"🧹 Checking for open TimeEntries for user {user.id}...")
        open_entries = TimeEntry.query.filter_by(user_id=user.id, tenant_id=tenant, end_time=None).all()
        print(f"  - Found {len(open_entries)} open TimeEntry records.")
        for entry in open_entries:
            db.session.delete(entry)
        db.session.commit()
        print("✅ Open TimeEntries deleted.")

        # Refresh the session to ensure changes are reflected
        db.session.expire_all()

        # Test clock_in
        print("⏰ Testing clock_in...")
        start_time = datetime.now(timezone.utc)
        clock_in_result = clock_in(user.id, tenant, start_time)
        if clock_in_result:
            print(f"✅ clock_in succeeded for user {user.id} at {start_time}")
            new_entry = TimeEntry.query.filter_by(user_id=user.id, end_time=None).order_by(TimeEntry.start_time.desc()).first()
            if new_entry:
                print(f"  - New TimeEntry created: Start={new_entry.start_time}, Kind={new_entry.kind.value}")
            else:
                print("❌ No new TimeEntry found after clock_in.")
        else:
            print("❌ clock_in failed.")

        # Test clock_out (assuming clock_in succeeded)
        if new_entry:
            print("⏰ Testing clock_out...")
            end_time = start_time + timedelta(hours=4)  # 4-hour shift
            clock_out_result = clock_out(user.id, end_time, notes=None)
            if clock_out_result:
                print(f"✅ clock_out succeeded for user {user.id} at {end_time}")
                updated_entry = db.session.get(TimeEntry, new_entry.id)  # Updated to use Session.get()
                if updated_entry and updated_entry.end_time == end_time:
                    print(f"  - TimeEntry updated: End={updated_entry.end_time}, Duration={updated_entry.duration}")
                else:
                    print("❌ TimeEntry not updated correctly after clock_out.")
            else:
                print("❌ clock_out failed.")

        # Test validate_overlaps
        print("⏳ Testing validate_overlaps...")
        new_shift_start = datetime.now(timezone.utc) + timedelta(hours=1)
        new_shift_end = new_shift_start + timedelta(hours=4)
        overlap = validate_overlaps(tenant, new_shift_start, new_shift_end)
        print(f"✅ validate_overlaps returned {overlap} (True if overlaps with existing shift)")

        # Test check_missing_clockouts
        print("🔔 Testing check_missing_clockouts...")
        missing = check_missing_clockouts(tenant)
        if missing:
            print(f"✅ check_missing_clockouts found {len(missing)} missing clockouts:")
            for entry in missing[:3]:
                print(f"  - User {entry.user_id} (Start: {entry.start_time})")
        else:
            print("✅ No missing clockouts detected.")

        # Test create_notification
        print("📩 Testing create_notification...")
        notification = create_notification(tenant, user.id, "Test notification")  # Adjusted to match function signature
        if notification:
            print(f"✅ Notification created: ID={notification.id}, Message={notification.message}")
            db.session.delete(notification)
            db.session.commit()
        else:
            print("❌ create_notification failed.")

        print("✅ Service function tests complete!")

if __name__ == "__main__":
    test_service_functions()