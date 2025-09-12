# Masterful Homes

Masterful Homes is a **full-stack smart living platform** that combines **renovations + automation** into a seamless digital experience.  
The platform is designed to help homeowners control lighting, climate, security, entertainment, and energy consumption with ease — while offering tailored dashboards for different roles (Admin, Manager, Technician, Finance).

---

## 🚀 Features

- **Responsive Website** with React (mobile-friendly, includes hamburger menu).
- **Authentication & Role-based Dashboards**:
  - Admin Panel
  - Manager Hub
  - Tech Center
  - Finance Portal
- **Smart Living Services** section with icons and descriptions.
- **About Us** & **Our Story** pages aligned with the brand vision.
- **Contact Us** form for communication.
- **Backend API** with Flask (planned/implemented separately).
- **Scalable Project Structure** for frontend and backend separation.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite build setup)
- **React Router** for navigation
- **React Icons** for UI enhancement
- **Context API** for authentication state management
- **Custom CSS** for styling

### Backend
- **Flask (Python)** for REST API
- **PostgreSQL** (planned database) currently on sqlite
- **SQLAlchemy** ORM
- **JWT or Session-based Authentication** (planned/partially implemented)

---

## 📂 Project Structure

Masterful-Homes/
│
├── frontend/ # React app
│ ├── src/
│ │ ├── assets/ # Images and static assets
│ │ ├── components/ # Navbar, Footer, etc.
│ │ ├── context/ # AuthContext
│ │ ├── pages/ # AboutUs, Services, Contact, Dashboards
│ │ ├── App.jsx # Main app router
│ │ └── main.jsx # Entry point
│ └── package.json
│
├── backend/ # Flask app
│ ├── app.py # Main entry point
│ ├── models.py # Database models
│ ├── config.py # Configurations
│ ├── seed.py # Sample data seeding
│ └── requirements.txt # Python dependencies
│
└── README.md # Project documentation

yaml
Copy code

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
uv venv
source .venv/bin/activate   # or uv run
pip install -r requirements.txt
flask run

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