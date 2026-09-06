from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base, SessionLocal
import app.models  # Import models to register with Base

def seed_default_users():
    """Create default demo users if they don't exist yet."""
    from app.models.user import User, Role
    from app.auth.security import get_password_hash

    db = SessionLocal()
    try:
        # Ensure roles exist
        roles_data = ["Admin", "Release Manager", "Developer", "Tester", "Viewer"]
        role_objs = {}
        for role_name in roles_data:
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(name=role_name)
                db.add(role)
                db.commit()
                db.refresh(role)
            role_objs[role_name] = role

        # Ensure demo users exist
        users_data = [
            {"email": "admin@example.com", "name": "Admin User", "role": "Admin"},
            {"email": "release@example.com", "name": "Release Manager", "role": "Release Manager"},
            {"email": "developer@example.com", "name": "John Dev", "role": "Developer"},
        ]
        for u in users_data:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                user = User(
                    email=u["email"],
                    hashed_password=get_password_hash("password123"),
                    full_name=u["name"],
                    role_id=role_objs[u["role"]].id,
                    is_active=True,
                )
                db.add(user)
                db.commit()
                print(f"[seed] Created user: {u['email']}")
            else:
                print(f"[seed] User already exists: {u['email']}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo users
    Base.metadata.create_all(bind=engine)
    seed_default_users()
    yield
    # Shutdown (nothing to clean up)


app = FastAPI(
    title="Software Release & SCM Change Controller",
    description="API for managing software releases and SCM changes",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
import os
cors_env = os.getenv("CORS_ORIGIN", "")
# Always include GitHub Pages and local dev origins
default_origins = [
    "https://rakshit212.github.io",
    "https://software-release-scm-controller.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost",
]
extra_origins = [o.strip() for o in cors_env.split(",") if o.strip()]
origins = list(set(default_origins + extra_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import auth, change_requests, releases, approvals, audit_logs, users, github

app.include_router(auth.router)
app.include_router(change_requests.router)
app.include_router(releases.router)
app.include_router(approvals.router)
app.include_router(audit_logs.router)
app.include_router(users.router)
app.include_router(github.router)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Determine absolute paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "API is running"}

# Serve the static files from React build if it exists
if os.path.isdir(FRONTEND_DIST):
    # Mount assets so they are served correctly
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")
    
    # Catch-all route to serve the React app (handles SPA routing)
    @app.get("/{full_path:path}")
    def serve_react_app(full_path: str):
        # Allow requests to /api/ or /docs/ to fall through (though they are defined earlier so FastAPI routes them correctly)
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Software Release API. (Frontend not built)."}
