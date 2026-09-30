import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, JSON, Integer
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    creatives = relationship("Creative", back_populates="user", cascade="all, delete-orphan")
    video_ads = relationship("VideoAd", back_populates="user", cascade="all, delete-orphan")

class Creative(Base):
    __tablename__ = "creatives"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    product_name = Column(String, nullable=False)
    product_description = Column(Text, nullable=False)
    target_audience = Column(String, nullable=True)
    platform = Column(String, nullable=False, default="Instagram")
    objective = Column(String, nullable=False, default="Sales")
    tone = Column(String, nullable=False, default="Bold")
    headline = Column(String, nullable=False)
    primary_text = Column(Text, nullable=False)
    short_description = Column(String, nullable=True)
    call_to_action = Column(String, nullable=False)
    alternative_headlines = Column(JSON, nullable=True)
    alternative_ctas = Column(JSON, nullable=True)
    hashtags = Column(JSON, nullable=True)
    visual_prompt = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    status = Column(String, default="Active")
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="creatives")
    variations = relationship("CreativeVariation", back_populates="creative", cascade="all, delete-orphan")

class VideoAd(Base):
    __tablename__ = "video_ads"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    product_name = Column(String, nullable=False)
    product_description = Column(Text, nullable=False)
    target_audience = Column(String, nullable=True)
    platform = Column(String, nullable=False, default="Instagram")
    objective = Column(String, nullable=False, default="Sales")
    tone = Column(String, nullable=False, default="Bold")
    headline = Column(String, nullable=False)
    primary_text = Column(Text, nullable=False)
    call_to_action = Column(String, nullable=False)
    video_url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    duration = Column(Integer, default=10)
    format = Column(String, default="9:16")
    status = Column(String, default="completed")
    script = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="video_ads")

class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    badge = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    product_name = Column(String, nullable=False)
    objective = Column(String, nullable=False)
    tone = Column(String, nullable=False)
    gradient = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CreativeVariation(Base):
    __tablename__ = "creative_variations"

    id = Column(String, primary_key=True, default=generate_uuid)
    creative_id = Column(String, ForeignKey("creatives.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    headline = Column(String, nullable=False)
    primary_text = Column(Text, nullable=False)
    call_to_action = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    creative = relationship("Creative", back_populates="variations")
