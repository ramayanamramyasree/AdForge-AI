import { DEMO_CREATIVES } from '../data/demoCreatives';
import { INITIAL_TEMPLATES } from '../data/initialTemplates';

const CREATIVES_KEY = 'adforge_creatives_v1';
const TEMPLATES_KEY = 'adforge_templates_v1';
const SETTINGS_KEY = 'adforge_settings_v1';

export const storageService = {
  // --- CREATIVES ---
  getCreatives: () => {
    try {
      const stored = localStorage.getItem(CREATIVES_KEY);
      if (!stored) {
        // Initialize with demo creatives if empty
        localStorage.setItem(CREATIVES_KEY, JSON.stringify(DEMO_CREATIVES));
        return DEMO_CREATIVES;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored creatives:', e);
      return DEMO_CREATIVES;
    }
  },

  saveCreative: (creative) => {
    const list = storageService.getCreatives();
    const newCreative = {
      ...creative,
      id: creative.id || 'creative_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: creative.createdAt || new Date().toISOString(),
      status: creative.status || 'Active',
      isDemo: false
    };
    // Prepend new creative
    const updated = [newCreative, ...list];
    localStorage.setItem(CREATIVES_KEY, JSON.stringify(updated));
    return newCreative;
  },

  updateCreative: (id, updatedFields) => {
    const list = storageService.getCreatives();
    const updated = list.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    localStorage.setItem(CREATIVES_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteCreative: (id) => {
    const list = storageService.getCreatives();
    const updated = list.filter(item => item.id !== id);
    localStorage.setItem(CREATIVES_KEY, JSON.stringify(updated));
    return updated;
  },

  duplicateCreative: (id) => {
    const list = storageService.getCreatives();
    const target = list.find(item => item.id === id);
    if (!target) return list;

    const copy = {
      ...target,
      id: 'creative_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      productName: `${target.productName} (Copy)`,
      createdAt: new Date().toISOString(),
      isDemo: false
    };

    const updated = [copy, ...list];
    localStorage.setItem(CREATIVES_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- TEMPLATES ---
  getTemplates: () => {
    try {
      const stored = localStorage.getItem(TEMPLATES_KEY);
      if (!stored) {
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_TEMPLATES));
        return INITIAL_TEMPLATES;
      }
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_TEMPLATES;
    }
  },

  // --- STATS ---
  getStats: () => {
    const creatives = storageService.getCreatives();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = creatives.filter(c => new Date(c.createdAt) >= oneWeekAgo).length;
    const userGenerated = creatives.filter(c => !c.isDemo).length;
    const savedCount = creatives.length;

    const platforms = creatives.reduce((acc, c) => {
      acc[c.platform] = (acc[c.platform] || 0) + 1;
      return acc;
    }, {});

    return {
      totalGenerated: userGenerated > 0 ? userGenerated + 12 : 12, // Realistic baseline + user created
      thisWeek: thisWeek,
      savedCreatives: savedCount,
      recentCreatives: creatives.slice(0, 4),
      platforms
    };
  },

  // --- SETTINGS ---
  getSettings: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : {
        apiKey: '',
        useFallbackOnly: false,
        brandColor: '#6366f1',
        exportFormat: 'PNG'
      };
    } catch (e) {
      return { apiKey: '', useFallbackOnly: false, brandColor: '#6366f1', exportFormat: 'PNG' };
    }
  },

  saveSettings: (settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  resetToDemo: () => {
    localStorage.setItem(CREATIVES_KEY, JSON.stringify(DEMO_CREATIVES));
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_TEMPLATES));
  }
};
