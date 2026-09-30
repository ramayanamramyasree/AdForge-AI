import React from 'react';
import { Sparkles, Plus, Cpu, LogIn, LogOut, Menu } from 'lucide-react';

export default function Navbar({ onNavigate, activeTab, currentUser, onShowAuth, onLogout, onToggleMobileMenu }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between max-w-[1400px] mx-auto gap-3">
        
        {/* Left Section: Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 border border-white/10 lg:hidden transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent font-heading">
                  AdForge <span className="text-indigo-400 font-black">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full hidden sm:inline-block">
                  MVP 1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                AI Advertising Creative Studio
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* AI Status Badge */}
          <div 
            onClick={() => onNavigate('settings')}
            className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs text-slate-300 cursor-pointer hover:border-indigo-500/30 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-400" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-[11px]">Backend AI Active</span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('create')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow duration-150 ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white shadow-indigo-500/20'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Create New Ad</span>
            <span className="sm:hidden">Create</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="relative cursor-pointer" onClick={() => onNavigate('settings')}>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
                      {(currentUser.full_name || currentUser.email || '?')[0].toUpperCase()}
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors hidden sm:block"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-white/10 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
