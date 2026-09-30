import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const PLATFORM_COLORS = {
  Instagram: { bg: 'bg-pink-500', text: 'text-pink-400' },
  Facebook: { bg: 'bg-blue-500', text: 'text-blue-400' },
  'Google Ads': { bg: 'bg-emerald-500', text: 'text-emerald-400' },
  LinkedIn: { bg: 'bg-sky-500', text: 'text-sky-400' },
};

const OBJECTIVE_COLORS = ['bg-indigo-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-cyan-500'];

function BarIndicator({ label, count, max, colorClass }) {
  const pct = max > 0 ? Math.max((count / max) * 100, 4) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-300 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-5 bg-slate-900/80 rounded-full overflow-hidden border border-white/5">
        <div className={`h-full rounded-full ${colorClass} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-white w-8 text-right">{count}</span>
    </div>
  );
}

export default function Analytics({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="pb-4 border-b border-white/10">
          <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
          <div className="h-4 w-72 skeleton-shimmer rounded mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl h-48 skeleton-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 glass-panel p-8 rounded-2xl border border-rose-500/30 text-center space-y-3">
        <p className="text-rose-400 font-bold">Failed to load analytics</p>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.totalCreatives === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="pb-4 border-b border-white/10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-400" /> Analytics
          </h1>
        </div>
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-heading">No Analytics Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate and save some ad creatives first. Analytics will appear here once you have data.
          </p>
          <button onClick={() => onNavigate('create')} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Create Your First Ad
          </button>
        </div>
      </div>
    );
  }

  const platformMax = Math.max(...Object.values(data.byPlatform), 1);
  const objectiveMax = Math.max(...Object.values(data.byObjective), 1);
  const userCreated = data.savedVsUnsaved?.user_created || 0;
  const demo = data.savedVsUnsaved?.demo || 0;
  const total = userCreated + demo || 1;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-indigo-400" /> Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">Insights from your advertising creative library.</p>
      </div>

      {/* Total stat */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-5">
        <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-black text-white font-heading">{data.totalCreatives}</p>
          <p className="text-xs text-slate-400 font-medium">Total Creatives in Database</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Platform */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-pink-400" /> Creatives by Platform
          </h3>
          <div className="space-y-3">
            {Object.entries(data.byPlatform).map(([platform, count]) => (
              <BarIndicator
                key={platform}
                label={platform}
                count={count}
                max={platformMax}
                colorClass={PLATFORM_COLORS[platform]?.bg || 'bg-slate-500'}
              />
            ))}
          </div>
        </div>

        {/* By Objective */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Creatives by Objective
          </h3>
          <div className="space-y-3">
            {Object.entries(data.byObjective).map(([obj, count], idx) => (
              <BarIndicator
                key={obj}
                label={obj}
                count={count}
                max={objectiveMax}
                colorClass={OBJECTIVE_COLORS[idx % OBJECTIVE_COLORS.length]}
              />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Created Over Time
          </h3>
          {data.createdOverTime.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {data.createdOverTime.map((entry) => (
                <div key={entry.date} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-xs">
                  <span className="text-slate-300">{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="font-bold text-indigo-400">{entry.count} creative{entry.count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No timeline data yet.</p>
          )}
        </div>

        {/* User vs Demo */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" /> User Created vs Demo
          </h3>
          <div className="h-6 flex rounded-full overflow-hidden bg-slate-900 border border-white/5">
            <div className="bg-indigo-500 transition-all duration-700" style={{ width: `${(userCreated / total) * 100}%` }} />
            <div className="bg-amber-500 transition-all duration-700" style={{ width: `${(demo / total) * 100}%` }} />
          </div>
          <div className="flex items-center justify-center gap-6 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> User Created ({userCreated})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Demo ({demo})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
