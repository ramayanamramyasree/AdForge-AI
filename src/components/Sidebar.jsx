import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Wand2, FolderHeart, LayoutTemplate, BarChart3, Settings, Zap, X } from 'lucide-react';
import { api } from '../services/api';

export default function Sidebar({ activeTab, onNavigate, isOpen, onClose }) {
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    api.getDashboardStats()
      .then((stats) => setSavedCount(stats.savedCreatives))
      .catch(() => {});
  }, [activeTab]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Ad', icon: Wand2, highlight: true },
    { id: 'creatives', label: 'My Creatives', icon: FolderHeart, badge: savedCount || undefined },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile & Tablet Backdrop Overlay (< 1024px) */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar (240px width) */}
      <aside 
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-[240px] h-screen bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col justify-between transition-transform duration-250 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } shrink-0`}
      >
        <div className="space-y-5">
          {/* Drawer Header (< 1024px) */}
          <div className="flex items-center justify-between px-2 lg:hidden border-b border-white/10 pb-3">
            <span className="text-sm font-extrabold text-white font-heading">Navigation</span>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Label */}
          <div className="px-2 hidden lg:block">
            <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Platform Menu
            </p>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1" aria-label="Sidebar Menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 group ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Card */}
        <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 relative overflow-hidden">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
            <Zap className="w-3.5 h-3.5 fill-indigo-400" />
            <span>Pro Creative Studio</span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2.5 leading-relaxed">
            Generate unlimited multi-platform ad variations.
          </p>
          <button
            onClick={() => handleItemClick('create')}
            className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow"
          >
            Create Fast Ad →
          </button>
        </div>
      </aside>
    </>
  );
}
