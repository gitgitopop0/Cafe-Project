from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List


class LoginRequest(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UserListResponse(BaseModel):
    total: int
    users: List[UserResponse]

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UpdateRoleUser(BaseModel):
    role: str


class MenuCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    image_url: Optional[str] = None
    image_public_id: Optional[str] = None


class MenuResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    category: Optional[CategoryBasic] = None
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str


class CategoryResponse(BaseModel):
    id: int
    name: str
    menus: list[MenuResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CategoryBasic(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class FeatureMenuCreate(BaseModel):
    menu_id: int


class FeatureMenuResponse(BaseModel):
    id: int
    menu_id: int
    menu: Optional[MenuResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
