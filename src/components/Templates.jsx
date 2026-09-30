import React, { useState, useEffect } from 'react';
import { LayoutTemplate, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function Templates({ onSelectTemplate, addToast }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTemplates()
      .then(setTemplates)
      .catch((err) => {
        if (addToast) addToast('Failed to load templates from database', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div className="h-10 w-64 skeleton-shimmer rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-64 skeleton-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading flex items-center gap-2.5">
            <LayoutTemplate className="w-7 h-7 text-indigo-400" />
            Ad Creative Templates ({templates.length} Presets)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Choose a battle-tested high-converting preset to instantly populate the AI Generator.
          </p>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => onSelectTemplate(tmpl)}
            className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between group hover:border-indigo-500/50 cursor-pointer transition-all duration-300 shadow-xl relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tmpl.gradient || 'from-indigo-500 to-purple-500'} opacity-15 rounded-full blur-2xl pointer-events-none`}></div>

            <div className="space-y-4 relative z-10">
              {/* Badge & Platform */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {tmpl.badge}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {tmpl.platform}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors font-heading">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              {/* Pre-fill Details Card */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 space-y-1 text-xs">
                <p className="text-slate-400 text-[11px]">
                  <strong>Product:</strong> {tmpl.productName}
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Objective:</strong> {tmpl.objective} • <strong>Tone:</strong> {tmpl.tone}
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-5 border-t border-white/5 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Use This Template
              </span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
