import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Plus, FolderHeart, Calendar, Zap, ArrowRight, 
  Instagram, Facebook, Globe, Linkedin, CheckCircle2, Film, ImageIcon 
} from 'lucide-react';
import { api } from '../services/api';
import AdPreview from './AdPreview';

export default function Dashboard({ onNavigate, onSelectTemplate, addToast }) {
  const [stats, setStats] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboardStats().catch(() => null),
      api.getTemplates().catch(() => []),
    ]).then(([s, t]) => {
      setStats(s);
      setTemplates((t || []).slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const demoCreative = stats?.recentCreatives?.[0] || {
    productName: 'AeroPulse Earbuds',
    headline: 'Immerse in pure sound with AeroPulse.',
    primaryText: 'Experience crystal-clear spatial audio with noise cancellation engineered for non-stop action. Get 20% off today!',
    callToAction: 'Shop Now',
    platform: 'Instagram',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 w-full max-w-[1400px] mx-auto pb-8">
        <div className="rounded-3xl h-72 skeleton-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card p-5 rounded-2xl h-28 skeleton-shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-[1400px] mx-auto pb-8">
      
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-white/10 p-5 sm:p-8 lg:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Image & 9:16 Video Ad Platform</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading leading-tight tracking-tight">
              Create <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">image & video ads</span> with AI.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Turn your product idea into ready-to-publish image graphics and 9:16 vertical video reels in seconds.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('create')}
                className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create New Ad</span>
              </button>

              <button
                onClick={() => onNavigate('templates')}
                className="px-4 sm:px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm border border-white/10 transition-colors flex items-center gap-2"
              >
                <span>Browse Templates</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Image Ads</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" /> 9:16 Video Ads</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Strict Data Isolation</span>
            </div>
          </div>

          {/* Hero Right Demo Preview */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Sample Preview
                </span>
              </div>
              <AdPreview
                productName={demoCreative.productName}
                headline={demoCreative.headline}
                primaryText={demoCreative.primaryText}
                callToAction={demoCreative.callToAction}
                platform={demoCreative.platform}
                imageUrl={demoCreative.imageUrl}
              />
            </div>
          </div>

        </div>
      </div>

      {/* STATS METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Creatives</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">{stats?.totalGenerated ?? 0}</p>
          <p className="text-xs text-slate-400 font-medium">In your account</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Image Ads</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">{stats?.imageAdsCount ?? 0}</p>
          <p className="text-xs text-slate-400 font-medium">Generated images</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Video Ads</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">{stats?.videoAdsCount ?? 0}</p>
          <p className="text-xs text-slate-400 font-medium">Generated 9:16 videos</p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Platforms</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 text-slate-300">
            <Instagram className="w-4 h-4 text-pink-400" />
            <Facebook className="w-4 h-4 text-blue-400" />
            <Globe className="w-4 h-4 text-emerald-400" />
            <Linkedin className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xs text-slate-400 font-medium">4 social networks</p>
        </div>

      </div>

      {/* POPULAR TEMPLATES PREVIEW */}
      {templates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading">High-Converting Presets</h2>
              <p className="text-xs text-slate-400">Click any preset to pre-fill your ad generator.</p>
            </div>
            <button
              onClick={() => onNavigate('templates')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 ml-2"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl)}
                className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 cursor-pointer group hover:border-indigo-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {tmpl.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{tmpl.platform}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
                <div className="pt-1 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Use Preset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECENT CREATIVES FEED (Shows current user's recent items, or empty state for new user) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white font-heading">Recent Creatives</h2>
          <button
            onClick={() => onNavigate('creatives')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 ml-2"
          >
            Open Gallery →
          </button>
        </div>

        {stats?.recentCreatives?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentCreatives.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate('creatives')}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden cursor-pointer group hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-white/10">
                      {c.platform}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <img src={c.imageUrl} alt={c.productName} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/10 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{c.productName}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{c.headline}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 px-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</span>
                  <span className="text-indigo-400 font-semibold group-hover:underline">View Ad →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-200">No recent creatives yet.</p>
            <p className="text-xs text-slate-400">Generate your first image or video ad to populate your dashboard.</p>
            <button
              onClick={() => onNavigate('create')}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
            >
              + Create Your First Ad
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
