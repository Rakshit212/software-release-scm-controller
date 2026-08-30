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

@app.get("/")
def read_root():
    return {"message": "Welcome to the Software Release & SCM Change Controller API"}
