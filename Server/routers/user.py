from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Server.database.database import get_db
from Server.schemas.schemas import UserResponse, UpdateRoleUser, UserListResponse
from Server.crud.crud import get_users, get_user, update_user_role, delete_user
from Server.core.security import get_current_user, require_admin
from Server.models.models import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=UserListResponse)
def list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    skip: int = 0,
    limit: int = 20,
):
    return get_users(db, skip, limit)


@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user_id(
    user_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)
):
    return get_user(db, user_id)


@router.patch("/{user_id}/role", response_model=UserResponse)
def chang_role(
    user_id: int,
    data: UpdateRoleUser,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return update_user_role(db, user_id, data.role)


@router.delete("/{user_id}")
def remove_user(
    user_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)
):
    return delete_user(db, user_id)
