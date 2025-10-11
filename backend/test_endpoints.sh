#!/usr/bin/env bash
# Masterful Homes QA Test Suite (HR + Time + Notifications)
# Usage: ./test_endpoints.sh
# Requires jq (sudo apt install jq)

BASE_URL="http://localhost:5000/api"
EMAIL="manager@masterfulhomes.com"
PASSWORD="manager123"        # <-- change to your test password
TENANT="tenant_abc"

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

function print_pass() { echo -e "${GREEN}✅ $1${NC}"; }
function print_fail() { echo -e "${RED}❌ $1${NC}"; }

# ------------------------------------------------------------
echo "🔐 Logging in as $EMAIL ..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  print_fail "Login failed — check credentials."
  echo "$LOGIN_RESPONSE"
  exit 1
fi
print_pass "Login successful"
echo "Token acquired..."

# ------------------------------------------------------------
echo "🚀 Testing endpoints..."

# 1️⃣ HR Ping
HR_PING=$(curl -s -X GET "$BASE_URL/hr/ping")
if echo "$HR_PING" | grep -q "HR module"; then
  print_pass "HR Ping OK"
else
  print_fail "HR Ping FAILED"
fi

# 2️⃣ HR Users
HR_USERS=$(curl -s -X GET "$BASE_URL/hr/users?tenant_id=$TENANT&limit=5&offset=0" \
  -H "Authorization: Bearer $TOKEN")
if echo "$HR_USERS" | grep -q "\"data\""; then
  print_pass "HR Users OK"
else
  print_fail "HR Users FAILED"
fi

# 3️⃣ HR Invite
HR_INVITE=$(curl -s -X POST "$BASE_URL/hr/users/invite" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"qa_test_$(date +%s)@x.com\",\"full_name\":\"QA Test\",\"role\":\"employee\"}")
if echo "$HR_INVITE" | grep -q "invite_created"; then
  print_pass "HR Invite OK"
else
  print_fail "HR Invite FAILED"
  echo "$HR_INVITE"
fi

# 4️⃣ Time Clock-In
CLOCKIN=$(curl -s -X POST "$BASE_URL/time/clock-in" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"kind":"regular"}')
if echo "$CLOCKIN" | grep -q "start_time"; then
  print_pass "Time Clock-In OK"
else
  print_fail "Time Clock-In FAILED"
  echo "$CLOCKIN"
fi

# 5️⃣ Time Clock-Out
CLOCKOUT=$(curl -s -X POST "$BASE_URL/time/clock-out" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":"QA auto test"}')
if echo "$CLOCKOUT" | grep -q "end_time"; then
  print_pass "Time Clock-Out OK"
else
  print_fail "Time Clock-Out FAILED"
  echo "$CLOCKOUT"
fi

# 6️⃣ Time Exceptions
EXCEPTIONS=$(curl -s -X GET "$BASE_URL/time/exceptions" \
  -H "Authorization: Bearer $TOKEN")
if echo "$EXCEPTIONS" | grep -q "\"data\""; then
  print_pass "Time Exceptions OK"
else
  print_fail "Time Exceptions FAILED"
fi

# 7️⃣ Notifications
NOTIFS=$(curl -s -X GET "$BASE_URL/notifications" \
  -H "Authorization: Bearer $TOKEN")
if echo "$NOTIFS" | grep -q "\"data\""; then
  print_pass "Notifications OK"
else
  print_fail "Notifications FAILED"
fi

# ------------------------------------------------------------
echo "✅ All tests completed."
echo "If any ❌ appear above, check backend logs for stack traces."
