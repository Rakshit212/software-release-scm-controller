from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.release import Release as ReleaseModel
from app.schemas.release import Release, ReleaseCreate, ReleaseUpdate
from app.auth.deps import get_current_active_user, User
from app.utils.audit import log_action

router = APIRouter(prefix="/api/releases", tags=["releases"])

@router.get("", response_model=List[Release])
def get_releases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    releases = db.query(ReleaseModel).offset(skip).limit(limit).all()
    return releases

@router.post("", response_model=Release)
def create_release(release: ReleaseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_release = db.query(ReleaseModel).filter(ReleaseModel.version == release.version).first()
    if db_release:
        raise HTTPException(status_code=400, detail="Version already exists")
        
    db_release = ReleaseModel(
        **release.model_dump(),
        created_by_id=current_user.id
    )
    db.add(db_release)
    db.commit()
    db.refresh(db_release)
    
    log_action(db, current_user.id, "Created Release", "Release", db_release.id, new_value=f"Version: {release.version}")
    return db_release

@router.get("/{id}", response_model=Release)
def get_release(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    release = db.query(ReleaseModel).filter(ReleaseModel.id == id).first()
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    return release

@router.put("/{id}", response_model=Release)
def update_release(id: int, release_update: ReleaseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_release = db.query(ReleaseModel).filter(ReleaseModel.id == id).first()
    if not db_release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    update_data = release_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_release, key, value)
        
    db.commit()
    db.refresh(db_release)
    
    log_action(db, current_user.id, "Updated Release", "Release", db_release.id)
    return db_release
