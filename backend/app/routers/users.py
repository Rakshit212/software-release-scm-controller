from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User as UserModel
from app.schemas.user import User as UserSchema
from app.auth.deps import get_current_active_user, User

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("", response_model=List[UserSchema])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users
