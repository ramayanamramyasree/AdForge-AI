from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Creative, VideoAd
from app.schemas import AnalyticsResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsResponse)
def get_analytics(
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

    by_platform: dict[str, int] = {}
    by_objective: dict[str, int] = {}

    for c in image_creatives:
        by_platform[c.platform] = by_platform.get(c.platform, 0) + 1
        by_objective[c.objective] = by_objective.get(c.objective, 0) + 1

    for v in video_ads:
        by_platform[v.platform] = by_platform.get(v.platform, 0) + 1
        by_objective[v.objective] = by_objective.get(v.objective, 0) + 1

    created_over_time: dict[str, int] = {}
    for item in image_creatives + video_ads:
        if item.created_at:
            day = item.created_at.strftime("%Y-%m-%d")
            created_over_time[day] = created_over_time.get(day, 0) + 1

    timeline = [{"date": k, "count": v} for k, v in sorted(created_over_time.items())]

    total_count = len(image_creatives) + len(video_ads)

    return AnalyticsResponse(
        totalCreatives=total_count,
        byPlatform=by_platform,
        byObjective=by_objective,
        createdOverTime=timeline,
        savedVsUnsaved={"image_ads": len(image_creatives), "video_ads": len(video_ads)},
    )
