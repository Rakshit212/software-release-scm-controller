from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from .user import User

class PatchNoteBase(BaseModel):
    content: str

class PatchNoteCreate(PatchNoteBase):
    pass

class PatchNote(PatchNoteBase):
    id: int
    release_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ReleaseBase(BaseModel):
    version: str
    name: str
    description: Optional[str] = None
    type: str
    status: Optional[str] = "Draft"
    release_date: Optional[date] = None

class ReleaseCreate(ReleaseBase):
    pass

class ReleaseUpdate(BaseModel):
    version: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    release_date: Optional[date] = None
    deployment_status: Optional[str] = None
    github_tag: Optional[str] = None

class Release(ReleaseBase):
    id: int
    created_by_id: int
    approved_by_id: Optional[int] = None
    deployment_status: str
    github_tag: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    patch_notes: List[PatchNote] = []

    class Config:
        from_attributes = True
