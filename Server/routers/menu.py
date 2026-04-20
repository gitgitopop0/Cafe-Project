from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from Server.database.database import get_db
from Server.schemas.schemas import MenuCreate, MenuResponse
from Server.core.security import require_admin
from Server.models.models import User
from Server.crud.crud import get_menus, get_menu, create_menu, update_menu, delete_menu
import cloudinary.uploader
from Server.crud.crud import search_menus

router = APIRouter(prefix="/menu", tags=["Menu"])


@router.get("/search")
def search_menu(
    q: str = "", skip: int = 0, limit: int = 20, db: Session = Depends(get_db)
):
    return search_menus(db, q, skip, limit)


@router.get("/")
def list_menu(db: Session = Depends(get_db)):
    return get_menus(db)


@router.get("/{menu_id}", response_model=MenuResponse)
def read_menu(menu_id: int, db: Session = Depends(get_db)):
    return get_menu(db, menu_id)


@router.post("/", response_model=MenuCreate)
async def create_menus(
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    category_id: int = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    menu_data = {
        "name": name,
        "description": description,
        "price": price,
        "category_id": category_id,
    }

    if file:
        result = cloudinary.uploader.upload(file.file, folder="menu")
        menu_data["image_url"] = result["secure_url"]
        menu_data["image_public_id"] = result["public_id"]

    return create_menu(db, menu_data)


@router.patch("/{menu_id}", response_model=MenuResponse)
async def update_menu_router(
    menu_id: int,
    name: str = Form(None),
    description: str = Form(None),
    price: float = Form(None),
    category_id: int = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    menu_data = {}

    if name is not None:
        menu_data["name"] = name
    if description is not None:
        menu_data["description"] = description
    if price is not None:
        menu_data["price"] = price
    if category_id is not None:
        menu_data["category_id"] = category_id

    if file:
        result = cloudinary.uploader.upload(file.file, folder="menu")
        menu_data["image_url"] = result["secure_url"]
        menu_data["image_public_id"] = result["public_id"]
    return update_menu(db, menu_id, menu_data)


@router.delete("/{menu_id}")
def remove_menu(
    menu_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)
):
    return delete_menu(db, menu_id)
