import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CreateAd from './components/CreateAd';
import MyCreatives from './components/MyCreatives';
import Templates from './components/Templates';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => api.getUser());
  const [showAuth, setShowAuth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (api.isLoggedIn()) {
      api.getMe()
        .then((user) => { setCurrentUser(user); api.setUser(user); })
        .catch(() => { api.clearAuth(); setCurrentUser(null); });
    }
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => { removeToast(id); }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplateData(template);
    setActiveTab('create');
    addToast(`Loaded template: "${template.title}"`, 'success');
  };

  const handleNavigate = (tabId) => {
    if (tabId !== 'create') {
      setSelectedTemplateData(null);
    }
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuth = (user) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    api.clearAuth();
    setCurrentUser(null);
    setActiveTab('dashboard');
    addToast('Logged out successfully.', 'info');
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* 1. LEFT SIDEBAR (240px Desktop Fixed / Mobile Collapsible Drawer) */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. RIGHT MAIN WRAPPER (Full available width) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Navbar */}
        <Navbar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onShowAuth={() => setShowAuth(true)}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Main Content Area: Max Width 1400px Centered, Responsive Padding */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard 
              onNavigate={handleNavigate} 
              onSelectTemplate={handleSelectTemplate}
              addToast={addToast}
            />
          )}

          {activeTab === 'create' && (
            <CreateAd
              initialData={selectedTemplateData}
              addToast={addToast}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'creatives' && (
            <MyCreatives
              onNavigate={handleNavigate}
              addToast={addToast}
            />
          )}

          {activeTab === 'templates' && (
            <Templates
              onSelectTemplate={handleSelectTemplate}
              addToast={addToast}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              addToast={addToast}
              currentUser={currentUser}
              onShowAuth={() => setShowAuth(true)}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/5 py-4 text-center text-xs text-slate-400 bg-slate-950/80 px-4 mt-auto">
          <div className="max-w-[1400px] mx-auto">
            <p>© 2026 AdForge AI. Turn ideas into high-converting ad creatives in seconds.</p>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={handleAuth}
          addToast={addToast}
        />
      )}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
