from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from Server.database.database import get_db
from Server.schemas.schemas import FeatureMenuCreate, FeatureMenuResponse
from Server.core.security import require_admin
from Server.models.models import User
from Server.crud.crud import get_feature_menus, create_feature_menu, delete_feature_menu

router = APIRouter(prefix="/featuremenu", tags=["Featuremenu"])


@router.get("/", response_model=list[FeatureMenuResponse])
def read_featuremenu(db: Session = Depends(get_db)):
    return get_feature_menus(db)


@router.post("/", response_model=FeatureMenuResponse)
def create_feature_menu_router(
    data: FeatureMenuCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return create_feature_menu(db, data)


@router.delete("/{featuremenu_id}")
def remove_featuremenu(
    featuremenu_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return delete_feature_menu(db, featuremenu_id)
