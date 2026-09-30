import { storageService } from './storageService';

// Category backdrop images for high-end ad creative rendering fallback
const CURATED_IMAGE_PRESETS = {
  Instagram: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80'
  ],
  Facebook: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
  ],
  GoogleAds: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
  ],
  LinkedIn: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80'
  ]
};

// Fallback dynamic generator based on prompt metadata
function generateFallbackAd({ productName, productDescription, targetAudience, platform, objective, tone }) {
  const brand = productName || 'Your Product';
  const desc = productDescription || 'An innovative high-quality product engineered for modern users.';
  const audience = targetAudience || 'discerning customers';

  // Headlines by tone & platform
  const headlineTemplates = {
    Professional: [
      `Elevate Your Performance with ${brand}`,
      `The Intelligent Solution for ${audience}`,
      `Transform Your Workflow Using ${brand}`,
      `Engineered for Excellence: Discover ${brand}`,
      `Why Top Professionals Choose ${brand}`
    ],
    Luxury: [
      `Unrivaled Elegance. Experience ${brand}`,
      `Indulge in Pure Perfection with ${brand}`,
      `Crafted for the Exceptional: ${brand}`,
      `Redefine Sophistication with ${brand}`,
      `The Ultimate Prestige: ${brand}`
    ],
    Friendly: [
      `Meet ${brand}: Your New Daily Essential! ✨`,
      `Say Hello to Better Days with ${brand}`,
      `You'll Love What ${brand} Can Do for You!`,
      `Ready for a Upgrade? Try ${brand} Today`,
      `Simple, Joyful, Effective: Experience ${brand}`
    ],
    Bold: [
      `Dominate Your Day with ${brand} ⚡`,
      `Unstoppable Innovation: ${brand} Is Here`,
      `Break All Limits with ${brand}`,
      `Never Settle. Upgrade to ${brand}`,
      `The Revolution Starts Now with ${brand}`
    ],
    Minimal: [
      `${brand}. Pure Performance.`,
      `Simply ${brand}.`,
      `Fewer Steps. Better Results with ${brand}.`,
      `${brand}: Essential Quality.`,
      `Designed Simply for You.`
    ]
  };

  const ctaTemplates = {
    Sales: ['Shop Now & Save 20%', 'Get Yours Today', 'Order Now with Free Shipping', 'Claim Your Discount', 'Buy ${brand}'],
    Leads: ['Get Your Free Quote', 'Schedule a Demo', 'Download Free Guide', 'Start Free Trial', 'Talk to an Expert'],
    Awareness: ['Discover the Story', 'Explore Features', 'Learn More', 'Watch Product Video', 'Join the Community'],
    'App Promotion': ['Download App Free', 'Install Now & Get $10', 'Try It Free Today', 'Get Started on iOS & Android', 'Claim Free Download']
  };

  const headlines = headlineTemplates[tone] || headlineTemplates.Bold;
  const ctas = ctaTemplates[objective] || ctaTemplates.Sales;

  const primaryText = tone === 'Professional' || platform === 'LinkedIn'
    ? `In today's fast-paced environment, ${brand} offers a high-impact solution tailored for ${audience}. Designed around key features like ${desc.slice(0, 80)}..., ${brand} delivers measurable results from day one. Take the next step to optimize your potential.`
    : `Tired of compromise? ${brand} brings you ${desc.slice(0, 90)}! Tailored specifically for ${audience}, it's time to experience the difference for yourself. Order today and join thousands of satisfied customers! 🚀`;

  const shortDesc = `${brand} • ${objective} Campaign • Designed for ${platform}`;

  const hashtagPool = [
    `#${brand.replace(/[^a-zA-Z0-9]/g, '')}`,
    `#${platform.replace(/\s+/g, '')}`,
    '#ProductLaunch',
    '#Innovation',
    '#MustHave',
    '#TrendingNow',
    '#QualityCrafted',
    '#SpecialOffer'
  ];

  const platformKey = platform.includes('Instagram') ? 'Instagram'
    : platform.includes('Facebook') ? 'Facebook'
    : platform.includes('LinkedIn') ? 'LinkedIn' : 'GoogleAds';

  const presetImages = CURATED_IMAGE_PRESETS[platformKey] || CURATED_IMAGE_PRESETS.Instagram;
  const randomImage = presetImages[Math.floor(Math.random() * presetImages.length)];

  return {
    headline: headlines[0],
    primary_text: primaryText,
    short_description: shortDesc,
    call_to_action: ctas[0],
    alternative_headlines: headlines.slice(1),
    alternative_ctas: ctas.slice(1, 4),
    hashtags: hashtagPool,
    visual_prompt: `A sleek, high-resolution product advertisement photo for ${brand}, featuring modern studio lighting and ${tone.toLowerCase()} aesthetic styling.`,
    fallbackImage: randomImage
  };
}

/**
 * Main AI Generation Function
 */
export async function generateAdCreative(formData, uploadedImageUrl = null) {
  const settings = storageService.getSettings();
  const apiKey = settings.apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';

  // Simulate realistic network latency (1.2 - 2 seconds) for AI loading state
  await new Promise(resolve => setTimeout(resolve, 1400));

  if (settings.useFallbackOnly || !apiKey) {
    console.log('⚡ Using AdForge AI Local Intelligent Engine (Fallback Mode)');
    const fallbackResult = generateFallbackAd(formData);
    return {
      ...fallbackResult,
      imageUrl: uploadedImageUrl || fallbackResult.fallbackImage,
      generatedAt: new Date().toISOString()
    };
  }

  try {
    const promptText = `
You are a world-class advertising creative director and copywriter.
Generate a structured JSON ad creative based on the following input:

Product Name: ${formData.productName}
Product Description: ${formData.productDescription}
Target Audience: ${formData.targetAudience}
Advertising Platform: ${formData.platform}
Ad Objective: ${formData.objective}
Tone: ${formData.tone}

Respond ONLY with valid JSON with no markdown formatting around it (do not wrap in \`\`\`json). The JSON structure MUST be:
{
  "headline": "Main captivating headline (under 10 words)",
  "primary_text": "Engaging main copy formatted for ${formData.platform} (2-3 sentences)",
  "short_description": "Short secondary caption or value prop",
  "call_to_action": "Action oriented CTA button text (2-4 words)",
  "alternative_headlines": ["Alt headline 1", "Alt headline 2", "Alt headline 3", "Alt headline 4", "Alt headline 5"],
  "alternative_ctas": ["Alt CTA 1", "Alt CTA 2", "Alt CTA 3"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "visual_prompt": "Detailed AI image prompt describing ideal background and visual layout"
}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean JSON markdown formatting if present
    const cleanJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJsonText);

    const platformKey = formData.platform.includes('Instagram') ? 'Instagram'
      : formData.platform.includes('Facebook') ? 'Facebook'
      : formData.platform.includes('LinkedIn') ? 'LinkedIn' : 'GoogleAds';
    const presetImages = CURATED_IMAGE_PRESETS[platformKey] || CURATED_IMAGE_PRESETS.Instagram;

    return {
      headline: parsed.headline,
      primary_text: parsed.primary_text,
      short_description: parsed.short_description,
      call_to_action: parsed.call_to_action,
      alternative_headlines: parsed.alternative_headlines || [],
      alternative_ctas: parsed.alternative_ctas || [],
      hashtags: parsed.hashtags || [],
      visual_prompt: parsed.visual_prompt || '',
      imageUrl: uploadedImageUrl || presetImages[0],
      generatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Gemini API call failed or rate limited. Falling back to local engine:', err);
    const fallbackResult = generateFallbackAd(formData);
    return {
      ...fallbackResult,
      imageUrl: uploadedImageUrl || fallbackResult.fallbackImage,
      generatedAt: new Date().toISOString()
    };
  }
}
