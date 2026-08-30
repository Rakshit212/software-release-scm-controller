import asyncio
from app.database import SessionLocal, engine, Base
from app.models.user import User, Role
from app.models.release import Release
from app.models.change_request import ChangeRequest
from app.auth.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create Roles
    roles = ["Admin", "Release Manager", "Developer", "Tester", "Viewer"]
    role_objs = {}
    for role_name in roles:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name)
            db.add(role)
            db.commit()
            db.refresh(role)
        role_objs[role_name] = role

    # Create Users
    users_data = [
        {"email": "admin@example.com", "name": "Admin User", "role": "Admin"},
        {"email": "release@example.com", "name": "Release Manager", "role": "Release Manager"},
        {"email": "developer@example.com", "name": "John Dev", "role": "Developer"},
        {"email": "tester@example.com", "name": "Jane Test", "role": "Tester"},
        {"email": "viewer@example.com", "name": "Viewer Guy", "role": "Viewer"},
    ]

    user_objs = {}
    for u in users_data:
        user = db.query(User).filter(User.email == u["email"]).first()
        if not user:
            user = User(
                email=u["email"],
                hashed_password=get_password_hash("password123"), # Default demo password
                full_name=u["name"],
                role_id=role_objs[u["role"]].id,
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        user_objs[u["role"]] = user

    # Create Demo Releases
    releases = [
        {"version": "v1.0.0", "name": "Initial Release", "type": "Major", "status": "Released"},
        {"version": "v1.1.0", "name": "Feature Update", "type": "Minor", "status": "Released"},
        {"version": "v1.2.0", "name": "Performance Update", "type": "Minor", "status": "Released"},
        {"version": "v2.0.0", "name": "Next-Gen SCM", "type": "Major", "status": "Under Review"},
    ]

    for r in releases:
        rel = db.query(Release).filter(Release.version == r["version"]).first()
        if not rel:
            rel = Release(
                version=r["version"],
                name=r["name"],
                description=f"{r['name']} description.",
                type=r["type"],
                status=r["status"],
                created_by_id=user_objs["Release Manager"].id
            )
            db.add(rel)
            db.commit()

    # Create Demo CRs
    crs = [
        {"cr_number": "CR-1001", "title": "Fix login crash", "type": "Bug Fix", "priority": "Critical", "status": "Released"},
        {"cr_number": "CR-1002", "title": "Add UI theming", "type": "Feature", "priority": "Low", "status": "Under Review"},
        {"cr_number": "CR-1003", "title": "Database optimization", "type": "Enhancement", "priority": "High", "status": "Approved"},
    ]
    
    for c in crs:
        cr = db.query(ChangeRequest).filter(ChangeRequest.cr_number == c["cr_number"]).first()
        if not cr:
            cr = ChangeRequest(
                cr_number=c["cr_number"],
                title=c["title"],
                description="Demo description",
                priority=c["priority"],
                type=c["type"],
                status=c["status"],
                requester_id=user_objs["Developer"].id
            )
            db.add(cr)
            db.commit()

    db.close()
    print("Database seeded successfully with demo data.")

if __name__ == "__main__":
    seed_db()
