from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id = Column(Integer, primary_key=True, index=True)
    cr_number = Column(String(50), unique=True, index=True) # e.g., CR-1024
    title = Column(String(200))
    description = Column(Text)
    
    priority = Column(String(50)) # Low, Medium, High, Critical
    type = Column(String(50)) # Bug Fix, Feature, Enhancement, Security, Configuration, Emergency Change
    status = Column(String(50), default="Submitted") # Submitted, Under Review, Approved, Rejected, In Development, Testing, Ready for Release, Released
    
    affected_module = Column(String(100), nullable=True)
    reason = Column(Text, nullable=True)
    risk_level = Column(String(50), nullable=True) # Low, Medium, High
    
    requester_id = Column(Integer, ForeignKey("users.id"))
    developer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    release_id = Column(Integer, ForeignKey("releases.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    requester = relationship("User", foreign_keys=[requester_id], back_populates="change_requests_created")
    developer = relationship("User", foreign_keys=[developer_id], back_populates="change_requests_assigned")
    release = relationship("Release", back_populates="change_requests")
    # For approvals related to this CR, we can use a polymorphic approach or an explicit link
    # We will use explicit links in Approval model
