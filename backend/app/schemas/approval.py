from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import User

class ApprovalBase(BaseModel):
    target_type: str
    target_id: int
    status: str
    comments: Optional[str] = None

class ApprovalCreate(ApprovalBase):
    pass

class Approval(ApprovalBase):
    id: int
    approver_id: int
    timestamp: datetime
    approver: Optional[User] = None

    class Config:
        from_attributes = True

class DeploymentBase(BaseModel):
    release_id: int
    status: str
    comments: Optional[str] = None

class DeploymentCreate(DeploymentBase):
    pass

class Deployment(DeploymentBase):
    id: int
    approved_by_id: Optional[int] = None
    deployed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
