import React, { useState } from 'react';
import { Instagram, Facebook, Globe, Linkedin, ThumbsUp, MessageCircle, Share2, Bookmark, MoreHorizontal, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdPreview({ 
  productName = 'Brand Name',
  headline = 'Your Catchy Headline Here',
  primaryText = 'Your compelling ad copy description will appear here as you type or generate.',
  callToAction = 'Shop Now',
  shortDescription = 'Limited Time Special Offer',
  hashtags = ['#Brand', '#AdForgeAI'],
  imageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  platform = 'Instagram',
  badgeText = 'Sponsored'
}) {
  const [activePlatform, setActivePlatform] = useState(platform || 'Instagram');

  const platforms = [
    { id: 'Instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-400' },
    { id: 'Facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-400' },
    { id: 'Google Ads', name: 'Google Ads', icon: Globe, color: 'text-emerald-400' },
    { id: 'LinkedIn', name: 'LinkedIn', icon: Linkedin, color: 'text-sky-400' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Platform Switcher Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 p-1.5 rounded-xl border border-white/10">
        <div className="flex items-center gap-1 overflow-x-auto w-full">
          {platforms.map((p) => {
            const Icon = p.icon;
            const isSelected = activePlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : p.color}`} />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Card Container */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl flex flex-col items-center justify-center min-h-[460px]">
        <div className="w-full max-w-md mx-auto transition-all duration-300">

          {/* 1. INSTAGRAM FEED PREVIEW */}
          {activePlatform === 'Instagram' && (
            <div className="insta-ad-card shadow-2xl">
              {/* Insta Header */}
              <div className="flex items-center justify-between p-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-[1.5px]">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-bold">
                      {productName.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">{productName.toLowerCase().replace(/\s+/g, '_')}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Sponsored</p>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-zinc-400 cursor-pointer" />
              </div>

              {/* Insta Creative Image */}
              <div className="relative aspect-square bg-zinc-900 overflow-hidden group">
                <img
                  src={imageUrl}
                  alt="Ad Visual"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-[10px] px-2.5 py-1 rounded-full font-medium text-white">
                  1/1
                </div>
              </div>

              {/* CTA Action Banner */}
              <div className="bg-indigo-600 px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-indigo-500 transition-colors">
                <span className="text-xs font-bold text-white tracking-wide">{callToAction}</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/90" />
              </div>

              {/* Insta Engagement Icons */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between text-zinc-200">
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="w-5 h-5 hover:text-pink-500 cursor-pointer" />
                    <MessageCircle className="w-5 h-5 cursor-pointer" />
                    <Share2 className="w-5 h-5 cursor-pointer" />
                  </div>
                  <Bookmark className="w-5 h-5 cursor-pointer" />
                </div>

                {/* Text Content */}
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-zinc-100">{headline}</p>
                  <p className="text-zinc-300 leading-relaxed">
                    <span className="font-bold mr-1.5">{productName.toLowerCase().replace(/\s+/g, '_')}</span>
                    {primaryText}
                  </p>
                  {hashtags && hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {hashtags.map((tag, idx) => (
                        <span key={idx} className="text-[11px] text-indigo-400 font-medium">
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. FACEBOOK POST PREVIEW */}
          {activePlatform === 'Facebook' && (
            <div className="fb-ad-card shadow-2xl">
              {/* FB Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                    {productName.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-slate-100">{productName}</p>
                      <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/20" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span>Sponsored</span>
                      <span>•</span>
                      <Globe className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>

              {/* FB Primary Text */}
              <div className="px-3 pb-3 text-xs text-slate-200 leading-normal">
                {primaryText}
              </div>

              {/* FB Media */}
              <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                <img src={imageUrl} alt="FB Ad" className="w-full h-full object-cover" />
              </div>

              {/* FB Link Bar */}
              <div className="bg-[#2a2b2c] p-3 flex items-center justify-between border-t border-slate-700/50">
                <div className="pr-2 space-y-0.5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{productName.toLowerCase()}.com</p>
                  <p className="text-xs font-bold text-slate-100 line-clamp-1">{headline}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{shortDescription}</p>
                </div>
                <button className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs shrink-0 transition-colors">
                  {callToAction}
                </button>
              </div>

              {/* FB Social Counters */}
              <div className="p-2.5 px-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                <span>👍 1.4K Likes</span>
                <span>248 Comments • 89 Shares</span>
              </div>
            </div>
          )}

          {/* 3. GOOGLE ADS PREVIEW */}
          {activePlatform === 'Google Ads' && (
            <div className="space-y-4 w-full">
              {/* Google Search Card */}
              <div className="google-ad-card shadow-2xl">
                <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400">
                  <span className="font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded text-[10px]">
                    Sponsored
                  </span>
                  <span className="text-slate-300">https://www.{productName.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
                <h3 className="text-base font-semibold text-indigo-400 hover:underline cursor-pointer mb-1 leading-snug">
                  {headline} — Official Site
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {primaryText} {shortDescription}
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-800 text-xs font-medium text-indigo-400">
                  <span className="hover:underline cursor-pointer flex items-center gap-1">
                    {callToAction} <ArrowRight className="w-3 h-3" />
                  </span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">Free Express Delivery</span>
                </div>
              </div>

              {/* Google Display Banner */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900 p-3 flex items-center gap-3">
                <img src={imageUrl} alt="Banner" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase text-amber-400">Google Display Ad</span>
                  <p className="text-xs font-bold text-white truncate">{headline}</p>
                  <p className="text-[11px] text-slate-400 truncate">{shortDescription}</p>
                  <button className="mt-1.5 px-2.5 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]">
                    {callToAction}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. LINKEDIN POST PREVIEW */}
          {activePlatform === 'LinkedIn' && (
            <div className="linkedin-ad-card shadow-2xl">
              {/* LinkedIn Header */}
              <div className="p-3 flex items-center justify-between border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded bg-sky-600 font-extrabold flex items-center justify-center text-white text-sm">
                    {productName.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{productName} Official</p>
                    <p className="text-[10px] text-zinc-400">Promoted • 12,400 followers</p>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-zinc-400" />
              </div>

              {/* LinkedIn Copy */}
              <div className="p-3 text-xs text-zinc-200 leading-relaxed">
                {primaryText}
              </div>

              {/* LinkedIn Media */}
              <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                <img src={imageUrl} alt="LinkedIn Creative" className="w-full h-full object-cover" />
              </div>

              {/* LinkedIn Action Card */}
              <div className="bg-[#283138] p-3 flex items-center justify-between">
                <div className="pr-2">
                  <p className="text-xs font-bold text-white line-clamp-1">{headline}</p>
                  <p className="text-[10px] text-zinc-400">{productName.toLowerCase()}.com</p>
                </div>
                <button className="px-3.5 py-1.5 rounded-full border border-sky-400 text-sky-400 hover:bg-sky-400/10 font-bold text-xs shrink-0 transition-colors">
                  {callToAction}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
