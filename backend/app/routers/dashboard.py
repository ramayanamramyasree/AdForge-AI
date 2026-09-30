from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Creative, VideoAd
from app.schemas import DashboardStats, CreativeResponse, VideoAdResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


def _to_creative_response(c: Creative) -> CreativeResponse:
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


def _to_video_response(v: VideoAd) -> VideoAdResponse:
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


@router.get("/stats", response_model=DashboardStats)
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Strict User Data Isolation: Only query current_user's records
    image_creatives = (
        db.query(Creative)
        .filter(Creative.user_id == current_user.id)
        .order_by(Creative.created_at.desc())
        .all()
    )

    video_ads = (
        db.query(VideoAd)
        .filter(VideoAd.user_id == current_user.id)
        .order_by(VideoAd.created_at.desc())
        .all()
    )

    one_week_ago = datetime.utcnow() - timedelta(days=7)
    this_week_images = [c for c in image_creatives if c.created_at and c.created_at >= one_week_ago]
    this_week_videos = [v for v in video_ads if v.created_at and v.created_at >= one_week_ago]

    platforms: dict[str, int] = {}
    for c in image_creatives:
        platforms[c.platform] = platforms.get(c.platform, 0) + 1
    for v in video_ads:
        platforms[v.platform] = platforms.get(v.platform, 0) + 1

    recent_creatives = [_to_creative_response(c) for c in image_creatives[:4]]
    recent_videos = [_to_video_response(v) for v in video_ads[:4]]

    total_count = len(image_creatives) + len(video_ads)

    return DashboardStats(
        totalGenerated=total_count,
        imageAdsCount=len(image_creatives),
        videoAdsCount=len(video_ads),
        thisWeek=len(this_week_images) + len(this_week_videos),
        savedCreatives=total_count,
        recentCreatives=recent_creatives,
        recentVideos=recent_videos,
        platforms=platforms,
    )
