from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, VideoAd
from app.schemas import GenerateVideoRequest, VideoAdResponse
from app.auth import get_current_user
from app.services.video_generator import generate_video_ad

router = APIRouter(prefix="/api/video-ads", tags=["Video Ads"])


def _to_response(v: VideoAd) -> VideoAdResponse:
    return VideoAdResponse(
        id=v.id,
        user_id=v.user_id,
        product_name=v.product_name,
        product_description=v.product_description,
        target_audience=v.target_audience,
        platform=v.platform,
        objective=v.objective,
        tone=v.tone,
        headline=v.headline,
        primary_text=v.primary_text,
        call_to_action=v.call_to_action,
        video_url=v.video_url,
        thumbnail_url=v.thumbnail_url,
        duration=v.duration or 10,
        format=v.format or "9:16",
        status=v.status or "completed",
        script=v.script,
        created_at=v.created_at.isoformat() if v.created_at else "",
    )


@router.post("/generate", response_model=VideoAdResponse, status_code=status.HTTP_201_CREATED)
def generate_video(
    body: GenerateVideoRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = generate_video_ad(body.model_dump())

    video_ad = VideoAd(
        user_id=current_user.id,
        product_name=body.product_name,
        product_description=body.description,
        target_audience=body.target_audience,
        platform=body.platform,
        objective=body.objective,
        tone=body.tone,
        headline=result["headline"],
        primary_text=result["primary_text"],
        call_to_action=result["call_to_action"],
        video_url=result["video_url"],
        duration=result["duration"],
        format=result["format"],
        status="completed",
        script=result["script"],
    )
    db.add(video_ad)
    db.commit()
    db.refresh(video_ad)

    return _to_response(video_ad)


@router.get("", response_model=List[VideoAdResponse])
def list_video_ads(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    videos = (
        db.query(VideoAd)
        .filter(VideoAd.user_id == current_user.id)
        .order_by(VideoAd.created_at.desc())
        .all()
    )
    return [_to_response(v) for v in videos]


@router.get("/{video_id}", response_model=VideoAdResponse)
def get_video_ad(
    video_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    video = db.query(VideoAd).filter(VideoAd.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video ad not found")
    if video.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return _to_response(video)


@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video_ad(
    video_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    video = db.query(VideoAd).filter(VideoAd.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video ad not found")
    if video.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    db.delete(video)
    db.commit()
