# Software Release & SCM Change Controller

A complete, production-ready Release Management and Software Configuration Management (SCM) platform for software teams. This platform allows tracking and managing software versions, change requests, patch notes, approval workflows, and deployments with full audit traceability.

## Features

- **Role-Based Access Control**: Secure JWT authentication with customized views for Admins, Release Managers, Developers, Testers, and Viewers.
- **Release Management**: Create, track, and manage software releases (Major, Minor, Patch, Hotfix) through a complete lifecycle.
- **Change Requests (CR)**: Submit, review, approve, and track feature additions or bug fixes. 
- **Approval Workflows**: Robust approval mechanisms for change requests and deployments.
- **Patch Notes**: Manage version patch notes to maintain clarity on feature changes.
- **Audit Logs**: Maintain strict auditability of all critical system actions.
- **GitHub Integration**: Connect with your GitHub repository to fetch commit logs and associate releases with Git tags.
- **Dashboard**: Professional, dynamic dashboard with real-time statistics powered by Recharts.

## Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, React Router
- **Backend**: Python 3.11, FastAPI, Uvicorn, SQLAlchemy, Pydantic, Passlib (bcrypt)
- **Database**: SQLite (default local) / MySQL (Production)
- **Deployment**: Docker, Docker Compose, GitHub Actions (CI/CD)

## Installation Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- Docker & Docker Compose (optional for local deployment)

### 1. Database Setup (Local SQLite)
By default, the backend runs with SQLite (`scm.db`) for rapid local development. No manual setup is needed. 

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env

# Seed the database with demo data
python seed.py

# Run the development server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Run the development server
npm run dev
```

## API Documentation
Once the backend is running, FastAPI provides automatic interactive API documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## GitHub Integration Setup
To fetch real GitHub commits and tags:
1. Generate a GitHub Personal Access Token (classic) with `repo` scope.
2. Add it to `backend/.env` under `GITHUB_TOKEN`.
3. Specify `GITHUB_OWNER` and `GITHUB_REPO`.

## Deployment Instructions

### Option 1: Docker Compose (Local/VPS)
1. Ensure Docker is installed.
2. Run `docker-compose up -d --build`.
3. Access the frontend at `http://localhost:5173` and backend at `http://localhost:8000`.

### Option 2: Cloud Deployment (Vercel + Render + MySQL)
1. **Database**: Spin up a MySQL instance on a provider like Railway, Aiven, or Supabase. Get the connection string.
2. **Backend (Render)**: Connect your repository to Render as a Web Service. Set the environment variable `DATABASE_URL` to your MySQL string, `SECRET_KEY`, and `GITHUB_TOKEN`. Use start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. **Frontend (Vercel)**: Connect your repository to Vercel. Set the Framework Preset to Vite. Set `VITE_API_URL` to your Render backend URL.

## Contributors
- Rakshit (Project Lead)
