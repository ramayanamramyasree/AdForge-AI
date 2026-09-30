import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Download, Sparkles, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export default function VideoAdPreview({ videoAd, onRegenerate, onDownload }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);

  if (!videoAd) return null;

  const rawUrl = videoAd.video_url || videoAd.videoUrl || '';
  const fullVideoUrl = rawUrl.startsWith('http') ? rawUrl : `${api.getBaseUrl()}${rawUrl}`;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* 9:16 Vertical Video Container */}
      <div className="relative w-full max-w-[320px] aspect-[9/16] bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group flex flex-col justify-between">
        
        {/* Real HTML5 Video Player */}
        <video
          ref={videoRef}
          src={fullVideoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              setDuration(videoRef.current.duration || 10);
            }
          }}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Video Overlay Top Header */}
        <div className="relative z-10 p-3 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-600 text-white shadow">
              9:16 Reel
            </span>
            <span className="text-[11px] font-bold text-white truncate max-w-[150px]">
              {videoAd.product_name || videoAd.productName || 'AdForge AI'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Video Center Play/Pause Touch Overlay */}
        <div 
          onClick={togglePlay}
          className="relative z-10 flex-1 flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl transform scale-100 animate-pulse">
              <Play className="w-6 h-6 ml-0.5" />
            </div>
          )}
        </div>

        {/* Video Overlay Bottom CTA Bar */}
        <div className="relative z-10 p-3 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent space-y-2">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white line-clamp-1">
              {videoAd.headline || 'Exclusive Product Offer'}
            </p>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
              {videoAd.primary_text || videoAd.primaryText || ''}
            </p>
          </div>

          <a
            href={fullVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
          >
            <span>{videoAd.call_to_action || videoAd.callToAction || 'Shop Now'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 transition-all duration-100" 
              style={{ width: `${(currentTime / (duration || 10)) * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={togglePlay}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={handleRestart}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>

        <a
          href={fullVideoUrl}
          download={`${(videoAd.product_name || 'ad').replace(/\s+/g, '_')}_video.mp4`}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download MP4</span>
        </a>

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-400 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Regenerate Video</span>
          </button>
        )}
      </div>
    </div>
  );
}
