from sqlalchemy.orm import Session, joinedload
from Server.models.models import Menu, Category, FeatureMenu, User
from fastapi import HTTPException
from passlib.context import CryptContext
import cloudinary.uploader
from Server.core.helper import safe_commit
from Server.schemas.schemas import (
    UserCreate,
    FeatureMenuCreate,
    CategoryCreate,
)
from sqlalchemy import func
from datetime import date

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_users(db: Session, skip: int = 0, limit: int = 20):
    total = db.query(User).count()
    users = db.query(User).offset(skip).limit(limit).all()
    return {"total": total, "users": users}


def get_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def create_user(db: Session, data: UserCreate):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    db_user = User(
        username=data.username,
        email=data.email,
        password=pwd_context.hash(data.password),
        role="user",
    )
    db.add(db_user)
    safe_commit(db)
    db.refresh(db_user)
    return db_user


def update_user_role(db: Session, user_id: int, role: str):
    user = get_user(db, user_id)
    user.role = role

    safe_commit(db)
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    db.delete(user)
    safe_commit(db)
    return {"message": "deleted"}


def get_users_today(db: Session):
    today = date.today()

    count = db.query(User).filter(func.date(User.created_at) == today).count()

    return {"count": count}


def get_categorys(db: Session):
    return db.query(Category).options(joinedload(Category.menus)).all()


def getall_categorys(db: Session):
    return db.query(Category.id, Category.name).all()


def get_category(db: Session, category_id: int):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


def create_category(db: Session, data: CategoryCreate):
    if db.query(Category).filter(Category.name == data.name).first():
        raise HTTPException(status_code=400, detail="Category already exists")
    db_category = Category(name=data.name)
    db.add(db_category)
    safe_commit(db)
    db.refresh(db_category)
    return db_category


def update_category(db: Session, category_id: int, data: CategoryCreate):
    category = get_category(db, category_id)
    category.name = data.name

    safe_commit(db)
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int):
    category = get_category(db, category_id)
    db.delete(category)

    safe_commit(db)
    return {"message": "deleted"}


def get_menu_by_category(db: Session):
    result = (
        db.query(Category.name, func.count(Menu.id))
        .join(Menu, Menu.category_id == Category.id)
        .group_by(Category.name)
        .all()
    )

    return [{"category": r[0], "count": r[1]} for r in result]


def search_menus(db: Session, q: str, skip: int = 0, limit: int = 20):
    query = db.query(Menu)

    if q:
        query = query.filter(Menu.name.ilike(f"%{q}%"))

    total = query.count()
    menus = query.offset(skip).limit(limit).all()

    return {"total": total, "menus": menus}


def get_menus(db: Session, skip: int = 0, limit: int = 20):
    total = db.query(Menu).count()
    menus = db.query(Menu).offset(skip).limit(limit).all()
    return {"total": total, "menus": menus, "skip": skip, "limit": limit}


def get_menu(db: Session, menu_id: int):
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    return menu


def create_menu(db: Session, data: dict):
    if db.query(Menu).filter(Menu.name == data["name"]).first():
        raise HTTPException(status_code=400, detail="Menu already exists")

    db_menu = Menu(**data)

    db.add(db_menu)

    safe_commit(db)
    db.refresh(db_menu)
    return db_menu


def update_menu(db: Session, menu_id: int, data: dict):
    menu = get_menu(db, menu_id)

    if data.get("image_public_id"):
        if menu.image_public_id:
            cloudinary.uploader.destroy(menu.image_public_id)

        menu.image_url = data.get("image_url")
        menu.image_public_id = data.get("image_public_id")

    for field in ["name", "description", "price", "category_id"]:
        if field in data:
            setattr(menu, field, data[field])

    safe_commit(db)
    db.refresh(menu)
    return menu


def delete_menu(db: Session, menu_id: int):
    menu = get_menu(db, menu_id)

    if menu.image_public_id:
        cloudinary.uploader.destroy(menu.image_public_id)

    db.delete(menu)
    safe_commit(db)
    return {"message": "deleted"}


def get_feature_menus(db: Session):
    return (
        db.query(FeatureMenu)
        .options(joinedload(FeatureMenu.menu).joinedload(Menu.category))
        .all()
    )


def create_feature_menu(db: Session, data: FeatureMenuCreate):
    menu = db.query(Menu).filter(Menu.id == data.menu_id).first()

    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")

    exists = db.query(FeatureMenu).filter(FeatureMenu.menu_id == data.menu_id).first()

    if exists:
        raise HTTPException(status_code=400, detail="Already exists")

    db_feature = FeatureMenu(menu_id=data.menu_id)
    db.add(db_feature)

    safe_commit(db)
    db.refresh(db_feature)
    return db_feature


def delete_feature_menu(db: Session, feature_id: int):
    feature = db.query(FeatureMenu).filter(FeatureMenu.id == feature_id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(feature)

    safe_commit(db)
    return {"message": "deleted"}
