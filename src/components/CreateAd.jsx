import React, { useState } from 'react';
import { 
  Sparkles, Upload, Image as ImageIcon, Copy, Download, BookmarkPlus, 
  RotateCw, Layers, Check, Wand2, Info, CheckCircle2, Video, Film 
} from 'lucide-react';
import AdPreview from './AdPreview';
import VideoAdPreview from './VideoAdPreview';
import { api } from '../services/api';
import { downloadAdCreativeAsPng } from '../services/imageExport';

function triggerCelebration() {
  try {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const colors = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.style.position = 'absolute';
      p.style.width = Math.random() * 6 + 5 + 'px';
      p.style.height = Math.random() * 6 + 5 + 'px';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = '50%';
      p.style.left = '50%';
      p.style.top = '60%';
      p.style.opacity = '1';
      p.style.transform = `translate(-50%, -50%) scale(1)`;
      p.style.transition = 'all 1.2s cubic-bezier(0.1, 0.8, 0.3, 1)';
      container.appendChild(p);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200 + 60;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - 60;

      setTimeout(() => {
        p.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
        p.style.opacity = '0';
      }, 20);
    }

    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }, 1500);
  } catch (e) {}
}

const IMAGE_STEPS = [
  'Analyzing product details…',
  'Crafting headline copy…',
  'Generating hashtags & CTAs…',
  'Preparing creative image…',
];

const VIDEO_STEPS = [
  'Writing 3-scene video script…',
  'Designing 9:16 vertical frames…',
  'Applying animated typography…',
  'Rendering MP4 video stream…',
];

export default function CreateAd({ initialData = null, addToast, onNavigate }) {
  const [adType, setAdType] = useState('image'); // 'image' | 'video'
  
  const [formData, setFormData] = useState({
    productName: initialData?.productName || '',
    productDescription: initialData?.productDescription || '',
    targetAudience: initialData?.targetAudience || '',
    platform: initialData?.platform || 'Instagram',
    objective: initialData?.objective || 'Sales',
    tone: initialData?.tone || 'Bold'
  });

  const [uploadedImage, setUploadedImage] = useState(initialData?.imagePlaceholder || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  
  const [generatedCreative, setGeneratedCreative] = useState(null);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  
  const [copiedField, setCopiedField] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [aiMode, setAiMode] = useState(null);

  const platforms = ['Instagram', 'Facebook', 'Google Ads', 'LinkedIn'];
  const objectives = ['Sales', 'Lead Generation', 'Brand Awareness', 'App Promotion', 'Product Launch'];
  const tones = ['Professional', 'Luxury', 'Friendly', 'Bold', 'Minimal', 'Creative'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image size should be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        addToast('Product image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.productName.trim() || !formData.productDescription.trim()) {
      addToast('Please enter Product Name and Description', 'error');
      return;
    }

    setIsGenerating(true);
    setIsSaved(false);
    setGenerationStep(0);

    const stepsList = adType === 'video' ? VIDEO_STEPS : IMAGE_STEPS;
    const stepInterval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < stepsList.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      if (adType === 'video') {
        const videoRes = await api.generateVideoAd({
          product_name: formData.productName,
          description: formData.productDescription,
          target_audience: formData.targetAudience,
          platform: formData.platform,
          objective: formData.objective,
          tone: formData.tone,
          image: uploadedImage || null,
          format: '9:16',
          duration: 10,
        });
        setGeneratedVideo(videoRes);
        setGeneratedCreative(null);
        triggerCelebration();
        addToast('🎬 AI Video Ad Generated & Saved!', 'success');
      } else {
        const imageRes = await api.generateCreative({
          ...formData,
          uploadedImageUrl: uploadedImage || null,
        });
        setGeneratedCreative(imageRes);
        setGeneratedVideo(null);
        setAiMode(imageRes.ai_mode);
        triggerCelebration();
        addToast('🚀 AI Ad Creative Generated!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to generate ad. Please sign in.', 'error');
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleSaveCreative = async () => {
    if (!generatedCreative) return;

    try {
      await api.saveCreative({
        productName: formData.productName,
        productDescription: formData.productDescription,
        targetAudience: formData.targetAudience,
        platform: formData.platform,
        objective: formData.objective,
        tone: formData.tone,
        headline: generatedCreative.headline,
        primaryText: generatedCreative.primary_text,
        shortDescription: generatedCreative.short_description,
        callToAction: generatedCreative.call_to_action,
        alternativeHeadlines: generatedCreative.alternative_headlines,
        alternativeCtas: generatedCreative.alternative_ctas,
        hashtags: generatedCreative.hashtags,
        imageUrl: generatedCreative.imageUrl,
        visualPrompt: generatedCreative.visual_prompt,
      });
      setIsSaved(true);
      addToast('Ad Creative saved to database!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save creative.', 'error');
    }
  };

  const handleCopyText = (text, fieldName = 'all') => {
    const targetData = generatedCreative || generatedVideo;
    if (!targetData) return;

    const textToCopy = text || `HEADLINE:\n${targetData.headline}\n\nPRIMARY TEXT:\n${targetData.primary_text}\n\nCTA:\n${targetData.call_to_action}`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopiedField(fieldName);
    addToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = async () => {
    if (!generatedCreative) return;
    setIsDownloading(true);
    try {
      await downloadAdCreativeAsPng({
        productName: formData.productName,
        headline: generatedCreative.headline,
        callToAction: generatedCreative.call_to_action,
        platform: formData.platform,
        imageUrl: generatedCreative.imageUrl
      });
      addToast('Creative image downloaded!', 'success');
    } catch (e) {
      addToast('Failed to download image.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-indigo-400" />
            AI Ad Studio Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Fill in product details to generate image or video ad campaigns.
          </p>
        </div>

        {initialData && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Template: <strong>{initialData.title}</strong></span>
          </div>
        )}
      </div>

      {/* Format Selector: [ Generate Image Ad ] [ Generate Video Ad ] */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10 max-w-md">
        <button
          onClick={() => setAdType('image')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
            adType === 'image'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Generate Image Ad</span>
        </button>

        <button
          onClick={() => setAdType('video')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
            adType === 'video'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Generate Video Ad (9:16)</span>
        </button>
      </div>

      {/* Grid: Desktop (1024px+) = 2 cols, Mobile/Tablet = Stacked 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT FORM */}
        <div className="lg:col-span-6 w-full glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Product / Brand Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. AeroPulse Earbuds"
                className="form-input"
                required
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Product Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Describe key features, benefits, and value proposition..."
                className="form-textarea"
                required
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="e.g. Fitness lovers, tech commuters"
                className="form-input"
              />
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="form-select text-xs"
                >
                  {platforms.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Objective
                </label>
                <select
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  className="form-select text-xs"
                >
                  {objectives.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="form-select text-xs"
                >
                  {tones.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Product Image (Optional)
              </label>
              <div className="relative border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-xl p-3 text-center transition-all bg-slate-900/50 group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                {uploadedImage ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={uploadedImage} alt="Uploaded preview" className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0" />
                      <div className="text-left min-w-0">
                        <p className="text-xs font-semibold text-emerald-400 truncate">Custom Image Loaded</p>
                        <p className="text-[10px] text-slate-400">Click to replace</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                      }}
                      className="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded transition-colors z-20 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    <p className="text-xs font-medium text-slate-300">
                      Upload image or drag and drop
                    </p>
                    <p className="text-[10px] text-slate-400">
                      PNG, JPG or WEBP up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Generate Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-3 px-5 rounded-xl text-white font-bold text-sm shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 ${
                adType === 'video'
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 shadow-pink-600/25'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-600/25'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{(adType === 'video' ? VIDEO_STEPS : IMAGE_STEPS)[generationStep]}</span>
                </>
              ) : (
                <>
                  {adType === 'video' ? <Film className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  <span>{adType === 'video' ? 'Generate AI Video Ad (9:16)' : 'Generate AI Image Ad'}</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* RIGHT PREVIEW & RESULTS */}
        <div className="lg:col-span-6 w-full space-y-5">
          
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white font-heading flex items-center gap-2">
              {adType === 'video' ? <Film className="w-4 h-4 text-purple-400" /> : <ImageIcon className="w-4 h-4 text-pink-400" />}
              {adType === 'video' ? 'Live 9:16 Video Preview' : 'Live Ad Preview'}
            </h2>
            <span className="text-xs text-slate-400">
              {generatedVideo ? '🎬 Video Output Ready' : generatedCreative ? '✨ AI Generated' : 'Interactive Mock'}
            </span>
          </div>

          {/* Render Video Preview or Image Ad Preview */}
          {generatedVideo ? (
            <VideoAdPreview
              videoAd={generatedVideo}
              onRegenerate={handleGenerate}
            />
          ) : (
            <AdPreview
              productName={formData.productName || 'Brand Name'}
              headline={generatedCreative ? generatedCreative.headline : (formData.productName ? `Discover ${formData.productName} Today` : 'Your Catchy Headline')}
              primaryText={generatedCreative ? generatedCreative.primary_text : (formData.productDescription || 'Your primary ad copy description will appear here after generation.')}
              callToAction={generatedCreative ? generatedCreative.call_to_action : 'Shop Now'}
              shortDescription={generatedCreative ? generatedCreative.short_description : 'Special Offer'}
              hashtags={generatedCreative ? generatedCreative.hashtags : ['#Brand', '#AdForgeAI']}
              imageUrl={generatedCreative ? generatedCreative.imageUrl : (uploadedImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80')}
              platform={formData.platform}
            />
          )}

          {/* GENERATED IMAGE RESULTS PANEL */}
          {generatedCreative && !generatedVideo && (
            <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-indigo-500/30 space-y-5 animate-fade-in w-full">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={handleSaveCreative}
                  disabled={isSaved}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSaved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                  }`}
                >
                  {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                  <span>{isSaved ? 'Saved to DB' : 'Save Creative'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-pink-400" />
                  <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
                </button>

                <button
                  onClick={() => handleCopyText()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{copiedField === 'all' ? 'Copied All!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Regenerate</span>
                </button>
              </div>

              {generatedCreative.alternative_headlines?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Alternative Headlines
                  </h4>
                  <div className="space-y-1.5">
                    {generatedCreative.alternative_headlines.map((alt, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-white/5 text-xs text-slate-200 hover:border-indigo-500/30 group">
                        <span className="truncate pr-2">{alt}</span>
                        <button
                          onClick={() => handleCopyText(alt, `alt_h_${idx}`)}
                          className="text-slate-400 hover:text-white shrink-0 p-1"
                        >
                          {copiedField === `alt_h_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
