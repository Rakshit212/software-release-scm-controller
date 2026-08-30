from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models # Import models to register with Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Software Release & SCM Change Controller",
    description="API for managing software releases and SCM changes",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:5173", # Vite default
    "http://localhost:3000", # React default
]

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

import os
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
