"""
Seed the database with initial templates and (optionally) demo creatives.
Run:  python -m app.seed
"""

from datetime import datetime, timedelta
import random
from app.database import engine, SessionLocal, Base
from app.models import Template, Creative

SEED_TEMPLATES = [
    {
        "id": "tmpl_product_launch",
        "title": "Product Launch",
        "description": "Build hype and excitement around a brand-new product release with bold messaging and urgency.",
        "badge": "Launch",
        "platform": "Instagram",
        "product_name": "QuantumX Pro Headphones",
        "objective": "Product Launch",
        "tone": "Bold",
        "gradient": "from-indigo-500 to-purple-500",
    },
    {
        "id": "tmpl_limited_time_offer",
        "title": "Limited Time Offer",
        "description": "Drive immediate conversions with scarcity and time-bound promotional messaging.",
        "badge": "Urgency",
        "platform": "Facebook",
        "product_name": "FitMax Smart Watch",
        "objective": "Sales",
        "tone": "Bold",
        "gradient": "from-rose-500 to-orange-500",
    },
    {
        "id": "tmpl_discount_sale",
        "title": "Discount Sale",
        "description": "Announce a seasonal or flash sale with clear value proposition and discount details.",
        "badge": "Sale",
        "platform": "Google Ads",
        "product_name": "CloudComfort Shoes",
        "objective": "Sales",
        "tone": "Friendly",
        "gradient": "from-emerald-500 to-teal-500",
    },
    {
        "id": "tmpl_new_product",
        "title": "New Product",
        "description": "Introduce a new offering with feature highlights, benefits, and a professional look.",
        "badge": "New",
        "platform": "LinkedIn",
        "product_name": "NexaBoard AI Dashboard",
        "objective": "Brand Awareness",
        "tone": "Professional",
        "gradient": "from-blue-500 to-cyan-500",
    },
    {
        "id": "tmpl_luxury_brand",
        "title": "Luxury Brand",
        "description": "Communicate premium quality and exclusivity for high-end products and brands.",
        "badge": "Luxury",
        "platform": "Instagram",
        "product_name": "Aurelius Gold Cologne",
        "objective": "Brand Awareness",
        "tone": "Luxury",
        "gradient": "from-amber-500 to-yellow-500",
    },
    {
        "id": "tmpl_social_media_promotion",
        "title": "Social Media Promotion",
        "description": "Boost engagement and reach with scroll-stopping creative and compelling CTA.",
        "badge": "Social",
        "platform": "Instagram",
        "product_name": "BrewCraft Cold Brew Coffee",
        "objective": "Brand Awareness",
        "tone": "Creative",
        "gradient": "from-pink-500 to-violet-500",
    },
]

DEMO_CREATIVES = [
    {
        "product_name": "AeroPulse Earbuds",
        "product_description": "Premium wireless earbuds with ANC, spatial audio, and 36-hour battery.",
        "target_audience": "Tech-savvy professionals and audiophiles",
        "platform": "Instagram",
        "objective": "Sales",
        "tone": "Bold",
        "headline": "Immerse in pure sound with AeroPulse.",
        "primary_text": "Experience crystal-clear spatial audio with noise cancellation engineered for non-stop action. Get 20% off today!",
        "short_description": "AeroPulse • Premium Audio for Modern Listeners",
        "call_to_action": "Shop Now",
        "hashtags": ["#AeroPulse", "#WirelessAudio", "#PremiumSound"],
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        "is_demo": True,
    },
    {
        "product_name": "LumiGlow Serum",
        "product_description": "Vitamin C brightening serum with hyaluronic acid. Dermatologist approved.",
        "target_audience": "Beauty enthusiasts 25-45",
        "platform": "Facebook",
        "objective": "Sales",
        "tone": "Luxury",
        "headline": "Radiance, Redefined.",
        "primary_text": "Unveil your natural glow with our clinically proven Vitamin C serum. Luxurious skincare meets visible results.",
        "short_description": "LumiGlow • Luxury Skincare",
        "call_to_action": "Get Yours",
        "hashtags": ["#LumiGlow", "#Skincare", "#GlowUp"],
        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        "is_demo": True,
    },
    {
        "product_name": "NexaBoard Pro",
        "product_description": "AI-powered analytics dashboard for enterprise teams.",
        "target_audience": "CTOs, data analysts, product managers",
        "platform": "LinkedIn",
        "objective": "Lead Generation",
        "tone": "Professional",
        "headline": "Data-Driven Decisions Made Simple.",
        "primary_text": "NexaBoard Pro unifies your metrics, surfaces actionable insights, and accelerates growth. Trusted by Fortune 500 teams.",
        "short_description": "NexaBoard • Enterprise Analytics",
        "call_to_action": "Start Free Trial",
        "hashtags": ["#NexaBoard", "#Analytics", "#DataDriven"],
        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        "is_demo": True,
    },
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed templates if empty
        if db.query(Template).count() == 0:
            for t in SEED_TEMPLATES:
                db.add(Template(**t))
            db.commit()
            print(f"[OK] Seeded {len(SEED_TEMPLATES)} templates")
        else:
            print("[OK] Templates already exist - skipping")

        # Seed demo creatives if empty
        if db.query(Creative).count() == 0:
            now = datetime.utcnow()
            for i, c in enumerate(DEMO_CREATIVES):
                c["created_at"] = now - timedelta(days=random.randint(1, 14))
                c["status"] = "Active"
                db.add(Creative(**c))
            db.commit()
            print(f"[OK] Seeded {len(DEMO_CREATIVES)} demo creatives")
        else:
            print("[OK] Creatives already exist - skipping")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
