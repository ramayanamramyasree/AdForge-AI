from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Creative
from app.schemas import (
    CreativeCreate,
    CreativeUpdate,
    CreativeResponse,
    GenerateCreativeRequest,
    GeneratedCreativeData,
)
from app.auth import get_current_user
from app.ai_service import generate_ad_creative

router = APIRouter(prefix="/api/creatives", tags=["Creatives"])


def _to_response(c: Creative) -> CreativeResponse:
    return CreativeResponse(
        id=c.id,
        user_id=c.user_id,
        productName=c.product_name,
        productDescription=c.product_description,
        targetAudience=c.target_audience,
        platform=c.platform,
        objective=c.objective,
        tone=c.tone,
        headline=c.headline,
        primaryText=c.primary_text,
        shortDescription=c.short_description,
        callToAction=c.call_to_action,
        alternativeHeadlines=c.alternative_headlines or [],
        alternativeCtas=c.alternative_ctas or [],
        hashtags=c.hashtags or [],
        visualPrompt=c.visual_prompt,
        imageUrl=c.image_url or "",
        status=c.status or "Active",
        isDemo=c.is_demo or False,
        createdAt=c.created_at.isoformat() if c.created_at else "",
    )


@router.post("/generate", response_model=GeneratedCreativeData)
def generate_creative(
    body: GenerateCreativeRequest,
    current_user: User = Depends(get_current_user),
):
    result = generate_ad_creative(body.model_dump())
    return GeneratedCreativeData(
        headline=result["headline"],
        primary_text=result["primary_text"],
        short_description=result["short_description"],
        call_to_action=result["call_to_action"],
        alternative_headlines=result.get("alternative_headlines", []),
        alternative_ctas=result.get("alternative_ctas", []),
        hashtags=result.get("hashtags", []),
        visual_prompt=result.get("visual_prompt", ""),
        imageUrl=result.get("imageUrl", ""),
        generatedAt=datetime.utcnow().isoformat(),
        ai_mode=result.get("ai_mode", "fallback"),
    )


@router.post("", response_model=CreativeResponse, status_code=status.HTTP_201_CREATED)
def save_creative(
    body: CreativeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    creative = Creative(
        user_id=current_user.id,
        product_name=body.productName,
        product_description=body.productDescription,
        target_audience=body.targetAudience,
        platform=body.platform,
        objective=body.objective,
        tone=body.tone,
        headline=body.headline,
        primary_text=body.primaryText,
        short_description=body.shortDescription,
        call_to_action=body.callToAction,
        alternative_headlines=body.alternativeHeadlines,
        alternative_ctas=body.alternativeCtas,
        hashtags=body.hashtags,
        visual_prompt=body.visualPrompt,
        image_url=body.imageUrl,
        status="Active",
        is_demo=False,
    )
    db.add(creative)
    db.commit()
    db.refresh(creative)
    return _to_response(creative)


@router.get("", response_model=List[CreativeResponse])
def list_creatives(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Strict User Data Isolation: Only return current_user's creatives
    creatives = (
        db.query(Creative)
        .filter(Creative.user_id == current_user.id)
        .order_by(Creative.created_at.desc())
        .all()
    )
    return [_to_response(c) for c in creatives]


@router.get("/{creative_id}", response_model=CreativeResponse)
def get_creative(
    creative_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    creative = db.query(Creative).filter(Creative.id == creative_id).first()
    if not creative:
        raise HTTPException(status_code=404, detail="Creative not found")
    if creative.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return _to_response(creative)


@router.put("/{creative_id}", response_model=CreativeResponse)
def update_creative(
    creative_id: str,
    body: CreativeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    creative = db.query(Creative).filter(Creative.id == creative_id).first()
    if not creative:
        raise HTTPException(status_code=404, detail="Creative not found")
    if creative.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    update_data = body.model_dump(exclude_unset=True)
    field_map = {
        "productName": "product_name",
        "headline": "headline",
        "primaryText": "primary_text",
        "callToAction": "call_to_action",
        "status": "status",
    }
    for key, val in update_data.items():
        db_field = field_map.get(key, key)
        setattr(creative, db_field, val)
    creative.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(creative)
    return _to_response(creative)


@router.delete("/{creative_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_creative(
    creative_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    creative = db.query(Creative).filter(Creative.id == creative_id).first()
    if not creative:
        raise HTTPException(status_code=404, detail="Creative not found")
    if creative.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    db.delete(creative)
    db.commit()


@router.post("/{creative_id}/duplicate", response_model=CreativeResponse, status_code=status.HTTP_201_CREATED)
def duplicate_creative(
    creative_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    original = db.query(Creative).filter(Creative.id == creative_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Creative not found")
    if original.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    copy = Creative(
        user_id=current_user.id,
        product_name=f"{original.product_name} (Copy)",
        product_description=original.product_description,
        target_audience=original.target_audience,
        platform=original.platform,
        objective=original.objective,
        tone=original.tone,
        headline=original.headline,
        primary_text=original.primary_text,
        short_description=original.short_description,
        call_to_action=original.call_to_action,
        alternative_headlines=original.alternative_headlines,
        alternative_ctas=original.alternative_ctas,
        hashtags=original.hashtags,
        visual_prompt=original.visual_prompt,
        image_url=original.image_url,
        status="Active",
        is_demo=False,
    )
    db.add(copy)
    db.commit()
    db.refresh(copy)
    return _to_response(copy)
