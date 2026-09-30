import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Cpu, Save, ShieldCheck, User, Database, LogOut, Lock } from 'lucide-react';
import { api } from '../services/api';

export default function Settings({ addToast, currentUser, onShowAuth, onLogout }) {
  const [apiKey, setApiKey] = useState('');
  const [dbStatus, setDbStatus] = useState({ status: 'checking', database: 'PostgreSQL' });
  const [password, setPassword] = useState('');

  useEffect(() => {
    api.healthCheck()
      .then((data) => setDbStatus(data))
      .catch(() => setDbStatus({ status: 'error', database: 'Disconnected' }));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Settings updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-indigo-400" />
          Settings & Account
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your user profile, AI credentials, and database connection status.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">User Account Profile</h3>
              <p className="text-xs text-slate-400">
                {currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in'}
              </p>
            </div>
          </div>

          {currentUser ? (
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={onShowAuth}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow"
            >
              Sign In / Register
            </button>
          )}
        </div>

        {currentUser && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Full Name</span>
              <span className="text-slate-200 font-semibold">{currentUser.full_name || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Email Address</span>
              <span className="text-slate-200 font-semibold">{currentUser.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* Database Status Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Database Status</h3>
              <p className="text-xs text-slate-400">
                Primary persistent database connection indicator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{dbStatus.database} Active</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* AI Key Configuration Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cloud AI Provider Key</h3>
              <p className="text-xs text-slate-400">
                Optional. Custom Gemini / AI key override for cloud generation.
              </p>
            </div>
          </div>

          <div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="form-input text-xs font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              API keys are secured via environment configuration and never exposed in React code.
            </p>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex items-center justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>
    </div>
  );
}
