from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.change_request import ChangeRequest as CRModel
from app.schemas.change_request import ChangeRequest, ChangeRequestCreate, ChangeRequestUpdate
from app.auth.deps import get_current_active_user, User
from app.utils.audit import log_action

router = APIRouter(prefix="/api/change-requests", tags=["change_requests"])

@router.get("", response_model=List[ChangeRequest])
def get_change_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    crs = db.query(CRModel).offset(skip).limit(limit).all()
    return crs

@router.post("", response_model=ChangeRequest)
def create_change_request(cr: ChangeRequestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Generate a random CR number or sequential. We'll use a prefix with random for simplicity.
    import random
    cr_number = f"CR-{random.randint(1000, 9999)}"
    
    db_cr = CRModel(
        **cr.model_dump(),
        cr_number=cr_number,
        requester_id=current_user.id,
        status="Submitted"
    )
    db.add(db_cr)
    db.commit()
    db.refresh(db_cr)
    
    log_action(db, current_user.id, "Created Change Request", "ChangeRequest", db_cr.id, new_value=f"Status: Submitted")
    return db_cr

@router.get("/{id}", response_model=ChangeRequest)
def get_change_request(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    cr = db.query(CRModel).filter(CRModel.id == id).first()
    if not cr:
        raise HTTPException(status_code=404, detail="Change request not found")
    return cr

@router.put("/{id}", response_model=ChangeRequest)
def update_change_request(id: int, cr_update: ChangeRequestUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    cr = db.query(CRModel).filter(CRModel.id == id).first()
    if not cr:
        raise HTTPException(status_code=404, detail="Change request not found")
    
    old_status = cr.status
    update_data = cr_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cr, key, value)
        
    db.commit()
    db.refresh(cr)
    
    if old_status != cr.status:
        log_action(db, current_user.id, f"Updated Change Request Status to {cr.status}", "ChangeRequest", cr.id, previous_value=old_status, new_value=cr.status)
        
    return cr
