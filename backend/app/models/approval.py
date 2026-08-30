from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    target_type = Column(String(50)) # "change_request" or "deployment"
    target_id = Column(Integer) # ID of either ChangeRequest or Release
    
    approver_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="Pending") # Pending, Approved, Rejected
    comments = Column(Text, nullable=True)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    approver = relationship("User", back_populates="approvals")
