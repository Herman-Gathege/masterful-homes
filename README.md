# Dashwise

Dashwise is a **full-stack smart living platform** that combines **teams + management** into a seamless digital experience.  
The platform is designed to help businesses control activities by employees/teams — while offering a unilateral dashboard for different roles (Admin, Manager, Technician, Finance and employees).

---

# 🚀 Key Features
🧠 Core Platform

Modular design (each department is its own module).

Tenant-aware multi-role system (Admin, Manager, Employee, Technician).

JWT-based authentication with automatic token refresh.

Role-based dashboard rendering and data access.

# 👥 HR Module (Sprint 2)

Paginated User Directory with search and filters (role, department, team).

Invite User flow (creates inactive user with invite token).

Bulk Import (CSV or JSON upload with summary feedback).

Full RBAC enforcement on backend routes.

Manager-scoped visibility when authenticated with manager JWT.

# ⏱ Time Module (Sprint 3)

Shift Calendar — view and create shifts per tenant.

Timesheet Tracking with role-aware filtering.

Manager Summary Dashboard with analytics and charts.

Smooth UI transitions and optimized React Query caching.

# ⚙️ Backend Features

Flask blueprints per module: auth, hr, time, notifications, etc.

PostgreSQL / NeonDB support (with fallback to SQLite for dev).

Modular service + route structure (backend/modules/<module>).

Consistent JSON API contract and pagination format.

# 🛠️ Tech Stack

# Frontend

React 19 + Vite 7

React Router v7 — modular routing

TanStack React Query v5 — data caching and revalidation

Zustand — lightweight global state store

Bootstrap 5 and Custom CSS — consistent design

Chart.js + Recharts — analytics

Lucide-React icons & Framer Motion animations

# Backend

Flask 3 (blueprint architecture)

SQLAlchemy + Flask-Migrate ORM

Flask-JWT-Extended for authentication

PostgreSQL (Neon DB) in production / SQLite in local dev

Render.com ready for deployment

# 📂 Project Structure
Masterful-Homes/
│
├── frontend/                     # React (Vite)
│   ├── src/
│   │   ├── assets/               # Images and static assets
│   │   ├── components/           # Navbar, Sidebar, Footer, etc.
│   │   ├── context/              # AuthContext + axios setup
│   │   ├── modules/
│   │   │   ├── HR/               # Sprint 2 — HR module
│   │   │   │   ├── pages/
│   │   │   │   │   └── HRDirectory.jsx
│   │   │   │   └── components/
│   │   │   │       ├── UserTable.jsx
│   │   │   │       ├── InviteModal.jsx
│   │   │   │       └── BulkImport.jsx
│   │   │   ├── Time/             # Sprint 3 — Time module
│   │   │   │   ├── pages/
│   │   │   │   │   └── ShiftCalendar.jsx
│   │   │   │   └── components/
│   │   │   │       └── ShiftFormModal.jsx
│   │   ├── services/             # axios service layers (hrService, timeService)
│   │   ├── utils/                # toast notifications, helpers
│   │   ├── App.jsx               # App router
│   │   └── main.jsx              # Entry point
│   └── package.json
│
├── backend/
│   ├── app.py                    # App factory + blueprint registration
│   ├── core/                     # Models + shared logic
│   ├── modules/
│   │   ├── auth/                 # JWT auth + refresh
│   │   ├── hr/                   # Sprint 2 backend
│   │   │   ├── routes.py
│   │   │   ├── service.py
│   │   │   └── __init__.py
│   │   ├── time/                 # Sprint 3 backend
│   │   │   ├── routes.py
│   │   │   ├── service.py
│   │   │   └── __init__.py
│   ├── utils/                    # helpers (jwt_helpers, decorators)
│   ├── seed.py                   # Seeding test data
│   ├── config.py
│   ├── extensions.py
│   └── requirements.txt
│
└── README.md

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (>=16)
- Python (>=3.10, managed via `uv` or `pyenv`)
- PostgreSQL (if using database) currently on sqlite

### Frontend Setup
```bash
cd frontend
npm install
npm run dev

Backend Setup
bash
Copy code
cd backend
uv init
or install uv first
start server with uv run ./main.py

🔑 Environment Variables
Create a .env file in the backend/ with:

env
Copy code
FLASK_APP=
FLASK_ENV=
SECRET_KEY=
DATABASE_URL=

📖 Usage
Navigate to http://localhost:5173 for frontend (Vite default port).

Backend runs at http://localhost:5000.

Login/Sign up to access role-based dashboards.

Explore services, story, and contact form.

🤝 Contributing
We welcome contributions! To get started:

Fork the repo

Create a feature branch:

bash
Copy code
git checkout -b feature/your-feature
Commit changes:

bash
Copy code
git commit -m "Add some feature"
Push branch & open a PR

📜 License
This project is licensed under the MIT License.
Feel free to use, modify, and distribute with attribution.

👨‍💻 Maintainers
Herman Gathege (Remington) – Full-stack Developer, Nairobi, Kenya

uv run flask --app main:create_app db init
uv run flask --app main:create_app db migrate -m "Initial migration"
uv run flask --app main:create_app db upgrade

# Drop and recreate the DB tables
uv run flask --app main:create_app db downgrade base
uv run flask --app main:create_app db upgrade

# Then reseed
uv run python seed.py

uv run ./main.py

#entering psql
psql postgresql://neondb_owner:npg_3Vg8CKrRUXJm@ep-floral-dream-adlenlmi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

