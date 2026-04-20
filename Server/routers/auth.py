from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from Server.database.database import get_db
from Server.schemas.schemas import UserCreate, UserResponse, LoginRequest, TokenResponse
from Server.crud.crud import create_user
from Server.core.security import pwd_context, create_token
from Server.models.models import User
from Server.core.security import limiter
from Server.core.security import get_current_user
import os


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
    }


@router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, data)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(
    data: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_token(user.id, user.role)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=os.getenv("ENV") == "production",
        samesite="lax",
        max_age=60 * 60 * 24,
        path="/",
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        },
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}
