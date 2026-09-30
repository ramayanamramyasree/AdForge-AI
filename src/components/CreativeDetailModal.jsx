import React, { useState } from 'react';
import { X, Copy, Download, Trash2, Edit, Save, Check } from 'lucide-react';
import AdPreview from './AdPreview';
import { downloadAdCreativeAsPng } from '../services/imageExport';

export default function CreativeDetailModal({ creative, onClose, onDelete, onUpdate, addToast }) {
  if (!creative) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(creative.headline);
  const [primaryText, setPrimaryText] = useState(creative.primaryText || creative.primary_text);
  const [callToAction, setCallToAction] = useState(creative.callToAction || creative.call_to_action);
  const [copied, setCopied] = useState(false);

  const handleSaveEdit = () => {
    onUpdate(creative.id, {
      headline,
      primaryText,
      callToAction
    });
    setIsEditing(false);
    addToast('Creative updated successfully!', 'success');
  };

  const handleCopyText = () => {
    const text = `HEADLINE:\n${headline}\n\nPRIMARY TEXT:\n${primaryText}\n\nCTA:\n${callToAction}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Ad text copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    try {
      await downloadAdCreativeAsPng({
        productName: creative.productName,
        headline,
        callToAction,
        platform: creative.platform,
        imageUrl: creative.imageUrl
      });
      addToast('Creative downloaded!', 'success');
    } catch (e) {
      addToast('Download failed', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {creative.platform} Creative
            </span>
            <h3 className="text-xl font-bold text-white font-heading mt-1">
              {creative.productName}
            </h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Preview */}
          <div className="lg:col-span-6 space-y-4">
            <AdPreview
              productName={creative.productName}
              headline={headline}
              primaryText={primaryText}
              callToAction={callToAction}
              platform={creative.platform}
              imageUrl={creative.imageUrl}
              hashtags={creative.hashtags}
            />
          </div>

          {/* Right: Details & Editor */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Creative Specifications
              </h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Copy'}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-indigo-500/30">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Primary Text</label>
                  <textarea
                    value={primaryText}
                    onChange={(e) => setPrimaryText(e.target.value)}
                    rows={4}
                    className="form-textarea text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Call To Action</label>
                  <input
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>
                <button
                  onClick={handleSaveEdit}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Headline:</span>
                  <p className="text-slate-100 font-bold text-sm leading-snug">{headline}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Primary Copy:</span>
                  <p className="text-slate-300 leading-relaxed">{primaryText}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">CTA Button:</span>
                  <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold inline-block">{callToAction}</span>
                </div>
              </div>
            )}

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Text!' : 'Copy Ad Text'}</span>
              </button>

              <button
                onClick={handleDownloadImage}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold text-xs transition-colors"
              >
                <Download className="w-4 h-4 text-pink-400" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={() => {
                  onDelete(creative.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs transition-colors ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
