const envUrl = import.meta.env.VITE_API_URL;
let BASE_URL = envUrl;

if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  if (!envUrl || envUrl === 'http://localhost:8000' || envUrl === 'http://127.0.0.1:8000') {
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      BASE_URL = `${window.location.protocol}//${hostname}:8000`;
    } else {
      BASE_URL = envUrl || 'http://localhost:8000';
    }
  }
} else {
  BASE_URL = envUrl || 'http://localhost:8000';
}

const TOKEN_KEY = 'adforge_token';
const USER_KEY = 'adforge_user';

function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(method, path, body = null, isJson = true) {
  const opts = { method, headers: getHeaders(isJson) };
  if (body && isJson) opts.body = JSON.stringify(body);
  else if (body && !isJson) opts.body = body;

  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.detail || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  // Auth
  register: (email, password, full_name) =>
    request('POST', '/api/auth/register', { email, password, full_name }),
  login: (email, password) =>
    request('POST', '/api/auth/login', { email, password }),
  getMe: () => request('GET', '/api/auth/me'),

  // Dashboard
  getDashboardStats: () => request('GET', '/api/dashboard/stats'),

  // Image Creatives
  generateCreative: (formData) =>
    request('POST', '/api/creatives/generate', formData),
  saveCreative: (data) => request('POST', '/api/creatives', data),
  getCreatives: () => request('GET', '/api/creatives'),
  getCreative: (id) => request('GET', `/api/creatives/${id}`),
  updateCreative: (id, data) => request('PUT', `/api/creatives/${id}`, data),
  deleteCreative: (id) => request('DELETE', `/api/creatives/${id}`),
  duplicateCreative: (id) => request('POST', `/api/creatives/${id}/duplicate`),

  // Video Ads
  generateVideoAd: (formData) =>
    request('POST', '/api/video-ads/generate', formData),
  getVideoAds: () => request('GET', '/api/video-ads'),
  getVideoAd: (id) => request('GET', `/api/video-ads/${id}`),
  deleteVideoAd: (id) => request('DELETE', `/api/video-ads/${id}`),

  // Templates
  getTemplates: () => request('GET', '/api/templates'),

  // Analytics
  getAnalytics: () => request('GET', '/api/analytics'),

  // Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST', headers, body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.detail || 'Upload failed');
    return data;
  },

  // Health
  healthCheck: () => request('GET', '/api/health'),

  // Token helpers
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.clear();
  },
  isLoggedIn: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  getBaseUrl: () => BASE_URL,
};
