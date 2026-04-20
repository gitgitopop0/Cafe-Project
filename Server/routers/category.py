from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Server.database.database import get_db
from Server.schemas.schemas import CategoryCreate, CategoryResponse, CategoryBasic
from Server.crud.crud import (
    get_categorys,
    create_category,
    getall_categorys,
    update_category,
    delete_category,
)
from Server.core.security import require_admin
from Server.models.models import User

router = APIRouter(prefix="/category", tags=["Category"])


@router.get("/", response_model=list[CategoryResponse])
def list_category(db: Session = Depends(get_db)):
    return get_categorys(db)

@router.get("/all", response_model=list[CategoryBasic])
def list_all_categories(db: Session = Depends(get_db)):
    return getall_categorys(db)

@router.post("/", response_model=CategoryResponse)
def create_categorys(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return create_category(db, data)


@router.patch("/{category_id}", response_model=CategoryResponse)
def chang_category(
    category_id: int,
    data: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return update_category(db, category_id, data)


@router.delete("/{category_id}")
def remove_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return delete_category(db, category_id)
