import React, { useState, useEffect } from 'react';
import { 
  FolderHeart, Search, Eye, Copy, Trash2, Plus, 
  Sparkles, ImageIcon, Film, Play, Download, ExternalLink 
} from 'lucide-react';
import { api } from '../services/api';
import CreativeDetailModal from './CreativeDetailModal';

export default function MyCreatives({ onNavigate, addToast }) {
  const [activeTab, setActiveTab] = useState('images'); // 'images' | 'videos'
  const [creatives, setCreatives] = useState([]);
  const [videoAds, setVideoAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [activeModalCreative, setActiveModalCreative] = useState(null);

  const platforms = ['All', 'Instagram', 'Facebook', 'Google Ads', 'LinkedIn'];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getCreatives().catch(() => []),
      api.getVideoAds().catch(() => []),
    ]).then(([imgList, vidList]) => {
      setCreatives(imgList || []);
      setVideoAds(vidList || []);
    }).finally(() => setLoading(false));
  }, []);

  const filteredCreatives = creatives.filter((item) => {
    const matchesPlatform = selectedPlatform === 'All' || item.platform === selectedPlatform;
    const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.headline?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const filteredVideos = videoAds.filter((item) => {
    const matchesPlatform = selectedPlatform === 'All' || item.platform === selectedPlatform;
    const matchesSearch = item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.headline?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const handleDeleteImage = async (id) => {
    try {
      await api.deleteCreative(id);
      setCreatives(prev => prev.filter(c => c.id !== id));
      addToast('Image creative deleted.', 'info');
    } catch (e) {
      addToast(e.message || 'Failed to delete', 'error');
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await api.deleteVideoAd(id);
      setVideoAds(prev => prev.filter(v => v.id !== id));
      addToast('Video ad deleted.', 'info');
    } catch (e) {
      addToast(e.message || 'Failed to delete video ad', 'error');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const copy = await api.duplicateCreative(id);
      setCreatives(prev => [copy, ...prev]);
      addToast('Creative duplicated!', 'success');
    } catch (e) {
      addToast(e.message || 'Failed to duplicate', 'error');
    }
  };

  const handleUpdate = async (id, fields) => {
    try {
      const updated = await api.updateCreative(id, fields);
      setCreatives(prev => prev.map(c => c.id === id ? updated : c));
    } catch (e) {
      addToast(e.message || 'Failed to update', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full max-w-[1400px] mx-auto pb-8">
        <div className="h-10 w-64 skeleton-shimmer rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-72 skeleton-shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto pb-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading flex items-center gap-2">
            <FolderHeart className="w-6 h-6 text-pink-400" />
            My Creatives & Video Ads Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your saved image creatives and AI video ads.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Generate New Ad</span>
        </button>
      </div>

      {/* Main Mode Selector: [ Image Ads ] [ Video Ads ] */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/10 max-w-sm">
        <button
          onClick={() => setActiveTab('images')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'images'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image Ads ({creatives.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'videos'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Video Ads ({videoAds.length})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-white/10 w-full">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product or headline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPlatform === p
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: IMAGE ADS GRID */}
      {activeTab === 'images' && (
        filteredCreatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCreatives.map((creative) => (
              <div
                key={creative.id}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-200 shadow-xl"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={creative.imageUrl}
                    alt={creative.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-900/90 text-indigo-300 border border-indigo-500/30 backdrop-blur-md shadow">
                      {creative.platform}
                    </span>
                    {creative.isDemo && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/90 text-slate-950 shadow">
                        Demo
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      onClick={() => setActiveModalCreative(creative)}
                      className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl transform hover:scale-105 transition-transform"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {creative.createdAt ? new Date(creative.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {creative.status || 'Active'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {creative.productName}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                    "{creative.headline}"
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalCreative(creative)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(creative.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteImage(creative.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">No Image Creatives</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {searchTerm ? `No image ad matches "${searchTerm}".` : "You haven't generated any image ads yet."}
            </p>
            <button
              onClick={() => onNavigate('create')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Image Ad</span>
            </button>
          </div>
        )
      )}

      {/* TAB 2: VIDEO ADS GRID */}
      {activeTab === 'videos' && (
        filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVideos.map((video) => {
              const fullUrl = video.video_url.startsWith('http') ? video.video_url : `${api.getBaseUrl()}${video.video_url}`;
              return (
                <div
                  key={video.id}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-200 shadow-xl"
                >
                  {/* Video Player Card Banner */}
                  <div className="relative aspect-[9/16] max-h-[360px] bg-slate-950 overflow-hidden flex items-center justify-center">
                    <video
                      src={fullUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-pink-600 text-white shadow">
                        9:16 Video
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-indigo-300 border border-indigo-500/30">
                        {video.platform}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {video.created_at ? new Date(video.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {video.status || 'completed'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {video.product_name}
                    </h3>

                    <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                      "{video.headline}"
                    </p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="bg-slate-950/60 p-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <a
                      href={fullUrl}
                      download={`${video.product_name.replace(/\s+/g, '_')}_video.mp4`}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-pink-400" />
                      <span>Download MP4</span>
                    </a>

                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-md mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400">
              <Film className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">No Video Ads</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {searchTerm ? `No video ad matches "${searchTerm}".` : "You haven't generated any 9:16 video ads yet."}
            </p>
            <button
              onClick={() => onNavigate('create')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow inline-flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Generate Video Ad</span>
            </button>
          </div>
        )
      )}

      {/* Detail Modal */}
      {activeModalCreative && (
        <CreativeDetailModal
          creative={activeModalCreative}
          onClose={() => setActiveModalCreative(null)}
          onDelete={handleDeleteImage}
          onUpdate={handleUpdate}
          addToast={addToast}
        />
      )}

    </div>
  );
}
