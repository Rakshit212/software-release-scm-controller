from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import User

class ChangeRequestBase(BaseModel):
    title: str
    description: str
    priority: str
    type: str
    affected_module: Optional[str] = None
    reason: Optional[str] = None
    risk_level: Optional[str] = None

class ChangeRequestCreate(ChangeRequestBase):
    pass

class ChangeRequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    affected_module: Optional[str] = None
    reason: Optional[str] = None
    risk_level: Optional[str] = None
    developer_id: Optional[int] = None
    reviewer_id: Optional[int] = None
    release_id: Optional[int] = None

class ChangeRequest(ChangeRequestBase):
    id: int
    cr_number: str
    status: str
    requester_id: int
    developer_id: Optional[int] = None
    reviewer_id: Optional[int] = None
    release_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    requester: Optional[User] = None
    developer: Optional[User] = None

    class Config:
        from_attributes = True
