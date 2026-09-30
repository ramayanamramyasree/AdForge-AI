from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Image Creative Generation Schemas
class GenerateCreativeRequest(BaseModel):
    productName: str
    productDescription: str
    targetAudience: Optional[str] = None
    platform: str = "Instagram"
    objective: str = "Sales"
    tone: str = "Bold"
    uploadedImageUrl: Optional[str] = None

class GeneratedCreativeData(BaseModel):
    headline: str
    primary_text: str
    short_description: str
    call_to_action: str
    alternative_headlines: List[str] = []
    alternative_ctas: List[str] = []
    hashtags: List[str] = []
    visual_prompt: str = ""
    imageUrl: str
    generatedAt: str
    ai_mode: str = "live"

# Video Ad Generation Schemas
class GenerateVideoRequest(BaseModel):
    product_name: str
    description: str
    target_audience: Optional[str] = None
    platform: str = "Instagram"
    objective: str = "Sales"
    tone: str = "Bold"
    image: Optional[str] = None
    duration: int = 10
    format: str = "9:16"

class VideoAdResponse(BaseModel):
    id: str
    user_id: str
    product_name: str
    product_description: str
    target_audience: Optional[str] = None
    platform: str
    objective: str
    tone: str
    headline: str
    primary_text: str
    call_to_action: str
    video_url: str
    thumbnail_url: Optional[str] = None
    duration: int
    format: str
    status: str
    script: Optional[Dict[str, Any]] = None
    created_at: str

    class Config:
        from_attributes = True

# Creative Save/Update Schemas
class CreativeCreate(BaseModel):
    productName: str
    productDescription: str
    targetAudience: Optional[str] = None
    platform: str
    objective: str
    tone: str
    headline: str
    primaryText: str
    shortDescription: Optional[str] = None
    callToAction: str
    alternativeHeadlines: Optional[List[str]] = []
    alternativeCtas: Optional[List[str]] = []
    hashtags: Optional[List[str]] = []
    imageUrl: str
    visualPrompt: Optional[str] = None

class CreativeUpdate(BaseModel):
    productName: Optional[str] = None
    headline: Optional[str] = None
    primaryText: Optional[str] = None
    callToAction: Optional[str] = None
    status: Optional[str] = None

class CreativeResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    productName: str
    productDescription: str
    targetAudience: Optional[str] = None
    platform: str
    objective: str
    tone: str
    headline: str
    primaryText: str
    shortDescription: Optional[str] = None
    callToAction: str
    alternativeHeadlines: Optional[List[str]] = []
    alternativeCtas: Optional[List[str]] = []
    hashtags: Optional[List[str]] = []
    visualPrompt: Optional[str] = None
    imageUrl: str
    status: str
    isDemo: bool
    createdAt: str

    class Config:
        from_attributes = True

# Template Schema
class TemplateResponse(BaseModel):
    id: str
    title: str
    description: str
    badge: str
    platform: str
    productName: str
    objective: str
    tone: str
    gradient: Optional[str] = None

    class Config:
        from_attributes = True

# Dashboard Stats Schema
class DashboardStats(BaseModel):
    totalGenerated: int
    imageAdsCount: int
    videoAdsCount: int
    thisWeek: int
    savedCreatives: int
    recentCreatives: List[CreativeResponse]
    recentVideos: List[VideoAdResponse] = []
    platforms: Dict[str, int]

# Analytics Schema
class AnalyticsResponse(BaseModel):
    totalCreatives: int
    byPlatform: Dict[str, int]
    byObjective: Dict[str, int]
    createdOverTime: List[Dict[str, Any]]
    savedVsUnsaved: Dict[str, int]
