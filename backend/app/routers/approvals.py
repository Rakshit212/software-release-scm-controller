from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.approval import Approval as ApprovalModel
from app.schemas.approval import Approval, ApprovalCreate
from app.auth.deps import get_current_active_user, User
from app.utils.audit import log_action

router = APIRouter(prefix="/api/approvals", tags=["approvals"])

@router.get("", response_model=List[Approval])
def get_approvals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    approvals = db.query(ApprovalModel).offset(skip).limit(limit).all()
    return approvals

@router.post("/{id}/approve", response_model=Approval)
def approve(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    approval = db.query(ApprovalModel).filter(ApprovalModel.id == id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    approval.status = "Approved"
    approval.approver_id = current_user.id
    db.commit()
    db.refresh(approval)
    
    log_action(db, current_user.id, f"Approved {approval.target_type}", approval.target_type, approval.target_id)
    return approval

@router.post("/{id}/reject", response_model=Approval)
def reject(id: int, comments: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    approval = db.query(ApprovalModel).filter(ApprovalModel.id == id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    if not comments:
        raise HTTPException(status_code=400, detail="Rejection reason is required")
        
    approval.status = "Rejected"
    approval.comments = comments
    approval.approver_id = current_user.id
    db.commit()
    db.refresh(approval)
    
    log_action(db, current_user.id, f"Rejected {approval.target_type}", approval.target_type, approval.target_id, new_value=comments)
    return approval
