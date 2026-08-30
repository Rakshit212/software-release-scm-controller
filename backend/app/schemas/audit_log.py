from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import User

class AuditLogBase(BaseModel):
    action: str
    entity: str
    entity_id: Optional[int] = None
    previous_value: Optional[str] = None
    new_value: Optional[str] = None
    ip_address: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    user_id: Optional[int] = None

class AuditLog(AuditLogBase):
    id: int
    user_id: Optional[int] = None
    timestamp: datetime
    user: Optional[User] = None

    class Config:
        from_attributes = True
