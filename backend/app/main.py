"""
AdForge AI — FastAPI Backend
"""

import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

from app.database import engine, Base, IS_POSTGRES
from app.models import User, Creative, VideoAd, Template, CreativeVariation  # noqa: F401
from app.routers import auth, creatives, video_ads, templates, dashboard, analytics, upload
from app.seed import seed_database

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("adforge")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Seeding initial data...")
    seed_database()
    logger.info("AdForge AI backend ready [OK]")
    yield
    logger.info("Shutting down AdForge AI backend")


app = FastAPI(
    title="AdForge AI",
    description="AI-Powered Advertising Creative Studio API",
    version="1.0.0",
    lifespan=lifespan,
)

# Parse CORS Origins
raw_cors = os.getenv("CORS_ORIGINS", "*")
if raw_cors.strip() == "*":
    cors_origins = ["*"]
else:
    cors_origins = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]

default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
for origin in default_origins:
    if origin not in cors_origins and "*" not in cors_origins:
        cors_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True if "*" not in cors_origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static uploads (including generated videos)
uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(creatives.router)
app.include_router(video_ads.router)
app.include_router(templates.router)
app.include_router(dashboard.router)
app.include_router(analytics.router)
app.include_router(upload.router)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "database": "PostgreSQL" if IS_POSTGRES else "SQLite (fallback)",
        "version": "1.0.0",
        "cors_origins": cors_origins,
    }
