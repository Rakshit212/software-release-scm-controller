from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Release(Base):
    __tablename__ = "releases"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50), unique=True, index=True) # e.g., v2.3.0
    name = Column(String(100))
    description = Column(Text, nullable=True)
    type = Column(String(50)) # Major, Minor, Patch, Hotfix
    status = Column(String(50), default="Draft") # Draft, Under Review, Approved, Ready for Deployment, Deployed, Failed, Rolled Back, Archived
    release_date = Column(Date, nullable=True)
    
    created_by_id = Column(Integer, ForeignKey("users.id"))
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    deployment_status = Column(String(50), default="Pending") # Pending, Approved, Ready for Deployment, Deployed, Failed
    
    # GitHub Integration
    github_tag = Column(String(100), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    change_requests = relationship("ChangeRequest", back_populates="release")
    patch_notes = relationship("PatchNote", back_populates="release", cascade="all, delete-orphan")
    deployments = relationship("Deployment", back_populates="release", cascade="all, delete-orphan")

class PatchNote(Base):
    __tablename__ = "patch_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    release_id = Column(Integer, ForeignKey("releases.id"))
    content = Column(Text) # Markdown content
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    release = relationship("Release", back_populates="patch_notes")
