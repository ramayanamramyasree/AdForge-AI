"""
Backend AI generation service.
Calls Gemini API when GEMINI_API_KEY is set, otherwise uses a deterministic
fallback that produces realistic ad copy from the input metadata.
"""

import os
import json
import logging
import random
import requests
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("adforge.ai")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
USE_FALLBACK_ONLY = os.getenv("USE_FALLBACK_ONLY", "false").lower() == "true"

CURATED_IMAGES = {
    "Instagram": [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    ],
    "Facebook": [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    ],
    "Google Ads": [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    ],
    "LinkedIn": [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    ],
}


def _pick_image(platform: str) -> str:
    imgs = CURATED_IMAGES.get(platform, CURATED_IMAGES["Instagram"])
    return random.choice(imgs)


def _fallback_generate(data: dict) -> dict:
    brand = data.get("productName", "Your Product")
    desc = data.get("productDescription", "A high-quality product.")
    audience = data.get("targetAudience", "discerning customers")
    platform = data.get("platform", "Instagram")
    objective = data.get("objective", "Sales")
    tone = data.get("tone", "Bold")

    headline_map = {
        "Professional": [
            f"Elevate Your Performance with {brand}",
            f"The Intelligent Solution for {audience}",
            f"Transform Your Workflow Using {brand}",
            f"Engineered for Excellence: Discover {brand}",
            f"Why Top Professionals Choose {brand}",
        ],
        "Luxury": [
            f"Unrivaled Elegance. Experience {brand}",
            f"Indulge in Pure Perfection with {brand}",
            f"Crafted for the Exceptional: {brand}",
            f"Redefine Sophistication with {brand}",
            f"The Ultimate Prestige: {brand}",
        ],
        "Friendly": [
            f"Meet {brand}: Your New Daily Essential! ✨",
            f"Say Hello to Better Days with {brand}",
            f"You'll Love What {brand} Can Do for You!",
            f"Ready for an Upgrade? Try {brand} Today",
            f"Simple, Joyful, Effective: Experience {brand}",
        ],
        "Bold": [
            f"Dominate Your Day with {brand} ⚡",
            f"Unstoppable Innovation: {brand} Is Here",
            f"Break All Limits with {brand}",
            f"Never Settle. Upgrade to {brand}",
            f"The Revolution Starts Now with {brand}",
        ],
        "Minimal": [
            f"{brand}. Pure Performance.",
            f"Simply {brand}.",
            f"Fewer Steps. Better Results with {brand}.",
            f"{brand}: Essential Quality.",
            f"Designed Simply for You.",
        ],
        "Creative": [
            f"Imagine More with {brand} 🎨",
            f"Where Ideas Meet {brand}",
            f"Color Outside the Lines with {brand}",
            f"Create Without Limits: {brand}",
            f"Your Canvas, Your {brand}",
        ],
    }

    cta_map = {
        "Sales": ["Shop Now & Save 20%", "Get Yours Today", "Order Now with Free Shipping", "Claim Your Discount"],
        "Lead Generation": ["Get Your Free Quote", "Schedule a Demo", "Download Free Guide", "Start Free Trial"],
        "Brand Awareness": ["Discover the Story", "Explore Features", "Learn More", "Watch Product Video"],
        "App Promotion": ["Download App Free", "Install Now", "Try It Free Today", "Get Started"],
        "Product Launch": ["Be the First", "Pre-Order Now", "Join the Waitlist", "Explore What's New"],
    }

    headlines = headline_map.get(tone, headline_map["Bold"])
    ctas = cta_map.get(objective, cta_map["Sales"])

    primary_text = (
        f"In today's fast-paced environment, {brand} offers a high-impact solution tailored for {audience}. "
        f"Designed around key features like {desc[:80]}..., {brand} delivers measurable results from day one. "
        f"Take the next step to optimize your potential."
        if tone in ("Professional", "Minimal") or platform == "LinkedIn"
        else f"Tired of compromise? {brand} brings you {desc[:90]}! "
        f"Tailored specifically for {audience}, it's time to experience the difference for yourself. "
        f"Order today and join thousands of satisfied customers! 🚀"
    )

    hashtags = [
        f"#{brand.replace(' ', '')}",
        f"#{platform.replace(' ', '')}",
        "#ProductLaunch",
        "#Innovation",
        "#MustHave",
        "#TrendingNow",
        "#QualityCrafted",
        "#SpecialOffer",
    ]

    return {
        "headline": headlines[0],
        "primary_text": primary_text,
        "short_description": f"{brand} • {objective} Campaign • Designed for {platform}",
        "call_to_action": ctas[0],
        "alternative_headlines": headlines[1:],
        "alternative_ctas": ctas[1:4],
        "hashtags": hashtags,
        "visual_prompt": (
            f"A sleek, high-resolution product advertisement photo for {brand}, "
            f"featuring modern studio lighting and {tone.lower()} aesthetic styling."
        ),
        "imageUrl": data.get("uploadedImageUrl") or _pick_image(platform),
        "ai_mode": "fallback",
    }


def generate_ad_creative(data: dict) -> dict:
    """
    Generate an ad creative.  Uses Gemini API when available, otherwise
    falls back to the deterministic engine.
    """
    if USE_FALLBACK_ONLY or not GEMINI_API_KEY:
        logger.info("Using fallback AI engine (no API key configured)")
        return _fallback_generate(data)

    try:
        prompt = f"""You are a world-class advertising creative director and copywriter.
Generate a structured JSON ad creative based on the following input:

Product Name: {data.get('productName', '')}
Product Description: {data.get('productDescription', '')}
Target Audience: {data.get('targetAudience', '')}
Advertising Platform: {data.get('platform', '')}
Ad Objective: {data.get('objective', '')}
Tone: {data.get('tone', '')}

Respond ONLY with valid JSON (no markdown fences). Structure:
{{
  "headline": "Main captivating headline (under 10 words)",
  "primary_text": "Engaging main copy (2-3 sentences)",
  "short_description": "Short secondary caption",
  "call_to_action": "CTA button text (2-4 words)",
  "alternative_headlines": ["Alt 1", "Alt 2", "Alt 3", "Alt 4"],
  "alternative_ctas": ["Alt CTA 1", "Alt CTA 2", "Alt CTA 3"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "visual_prompt": "Detailed AI image prompt for the ad visual"
}}"""

        resp = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=30,
        )
        resp.raise_for_status()
        raw = resp.json()
        text = raw["candidates"][0]["content"]["parts"][0]["text"]
        text = text.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(text)

        platform = data.get("platform", "Instagram")
        return {
            "headline": parsed.get("headline", ""),
            "primary_text": parsed.get("primary_text", ""),
            "short_description": parsed.get("short_description", ""),
            "call_to_action": parsed.get("call_to_action", ""),
            "alternative_headlines": parsed.get("alternative_headlines", []),
            "alternative_ctas": parsed.get("alternative_ctas", []),
            "hashtags": parsed.get("hashtags", []),
            "visual_prompt": parsed.get("visual_prompt", ""),
            "imageUrl": data.get("uploadedImageUrl") or _pick_image(platform),
            "ai_mode": "live",
        }

    except Exception as e:
        logger.warning("Gemini API call failed (%s). Falling back to local engine.", e)
        return _fallback_generate(data)
