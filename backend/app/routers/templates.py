from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Template
from app.schemas import TemplateResponse

router = APIRouter(prefix="/api/templates", tags=["Templates"])


@router.get("", response_model=List[TemplateResponse])
def list_templates(db: Session = Depends(get_db)):
    templates = db.query(Template).order_by(Template.created_at).all()
    return [
        TemplateResponse(
            id=t.id,
            title=t.title,
            description=t.description,
            badge=t.badge,
            platform=t.platform,
            productName=t.product_name,
            objective=t.objective,
            tone=t.tone,
            gradient=t.gradient,
        )
        for t in templates
    ]
