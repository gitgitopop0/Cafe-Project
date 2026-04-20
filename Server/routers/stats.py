from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Server.database.database import get_db
from Server.core.security import require_admin
from Server.models.models import User
from Server.crud.crud import get_menu_by_category, get_users_today, get_feature_menus

router = APIRouter(prefix="/admin/stats", tags=["Admin Stats"])


@router.get("/menu-by-category")
def menu_by_category(
    db: Session = Depends(get_db), admin: User = Depends(require_admin)
):
    return get_menu_by_category(db)


@router.get("/users-today")
def users_today(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return get_users_today(db)


@router.get("/featured-count")
def featured_count(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return {"count": len(get_feature_menus(db))}
