import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("adforge.database")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/adforge_db")

engine = None
SessionLocal = None
IS_POSTGRES = False

def init_engine():
    global engine, SessionLocal, IS_POSTGRES
    db_url = DATABASE_URL
    
    # Ensure driver prefix for psycopg2
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    # Try PostgreSQL first if configured
    if "postgresql" in db_url:
        try:
            logger.info("Attempting to connect to PostgreSQL: %s", db_url.split('@')[-1])
            temp_engine = create_engine(db_url, pool_pre_ping=True)
            # Test connection
            with temp_engine.connect() as conn:
                pass
            engine = temp_engine
            IS_POSTGRES = True
            logger.info("Successfully connected to PostgreSQL database!")
        except Exception as e:
            logger.warning("PostgreSQL connection failed (%s). Falling back to SQLite.", e)
            db_url = "sqlite:///./adforge.db"
    
    if engine is None:
        logger.info("Initializing SQLite database engine at sqlite:///./adforge.db")
        engine = create_engine(db_url, connect_args={"check_same_thread": False})
        IS_POSTGRES = False

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

init_engine()

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
