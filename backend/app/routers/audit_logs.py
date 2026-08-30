from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.audit_log import AuditLog as AuditLogModel
from app.schemas.audit_log import AuditLog
from app.auth.deps import get_current_active_user, User, check_role

router = APIRouter(prefix="/api/audit-logs", tags=["audit_logs"])

@router.get("", response_model=List[AuditLog])
def get_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(check_role(["Admin"]))):
    # Only Admin can view audit logs
    logs = db.query(AuditLogModel).order_by(AuditLogModel.timestamp.desc()).offset(skip).limit(limit).all()
    return logs
