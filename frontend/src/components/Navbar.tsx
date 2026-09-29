import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Shirt, 
  User, 
  ShoppingBag, 
  Flame,
  Layers,
  ChevronDown,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WearVerseLogo } from './WearVerseLogo';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    user, 
    orders,
    isLoggedIn,
    openAuthModal,
    logout,
    openEditProfileModal,
    theme,
    toggleTheme,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isStudio = currentPage === 'home' || currentPage === 'create';
  const isExplore = currentPage === 'explore' || currentPage === 'shop';
  const isOrders = currentPage === 'orders';
  const isWardrobe = currentPage === 'my-designs';

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-all select-none ${
      theme === 'dark'
        ? 'bg-[#0a0d14]/90 border-slate-800/80 text-white'
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="cursor-pointer group flex-shrink-0"
        >
          <WearVerseLogo size="md" showStudioBadge={true} />
        </div>

        {/* Primary Navigation Pills */}
        <nav className={`flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl border transition-colors ${
          theme === 'dark'
            ? 'bg-[#121622]/80 border-slate-800/80'
            : 'bg-slate-100/90 border-slate-200'
        }`}>
          {/* AI Studio */}
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isStudio
                ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isStudio ? 'text-indigo-200' : 'text-indigo-500'}`} />
            <span className="hidden sm:inline">AI Studio</span>
            <span className="sm:hidden">Studio</span>
          </button>

          {/* Explore Trending */}
          <button
            onClick={() => setCurrentPage('explore')}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isExplore
                ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${isExplore ? 'text-rose-200' : 'text-rose-500'}`} />
            <span>Explore</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => {
              if (!isLoggedIn) {
                openAuthModal('login');
                return;
              }
              setCurrentPage('orders');
            }}
            className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isOrders
                ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm'
            }`}
          >
            <ShoppingBag className={`w-3.5 h-3.5 ${isOrders ? 'text-slate-200' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Orders</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                {orders.length}
              </span>
            )}
          </button>

          {/* Wardrobe */}
          <button
            onClick={() => {
              if (!isLoggedIn) {
                openAuthModal('login');
                return;
              }
              setCurrentPage('my-designs');
            }}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hidden md:flex ${
              isWardrobe
                ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
                : theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white shadow-sm'
            }`}
          >
            <Shirt className="w-3.5 h-3.5 text-slate-400" />
            <span>Wardrobe</span>
          </button>
        </nav>

        {/* Right Section: Theme Switcher & User Profile Dropdown or Sign In */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button (Dark / Light Mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all duration-200 active:scale-95 flex items-center justify-center shadow-sm ${
              theme === 'dark'
                ? 'text-amber-300 hover:text-white hover:bg-slate-800/80 border-slate-800 bg-[#121622]/60'
                : 'text-indigo-600 hover:text-indigo-900 hover:bg-slate-100 border-slate-200 bg-white'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode (Default)' : 'Switch to Obsidian Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl transition-colors border ${
                  theme === 'dark'
                    ? 'hover:bg-slate-800/80 border-slate-800 bg-[#121622]/60 text-slate-200'
                    : 'hover:bg-slate-100 border-slate-200 bg-white text-slate-800 shadow-sm'
                }`}
                aria-label="User profile menu"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
                />
                <span className={`text-xs font-bold hidden lg:inline max-w-[90px] truncate ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark'
                    ? 'bg-[#141824] border-slate-700/80 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800 shadow-xl'
                }`}>
                  <div className={`p-3.5 border-b ${
                    theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <p className={`text-xs font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                    <p className="text-[11px] text-indigo-500 font-medium">@{user.username}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-medium">
                      <span>{user.stats.designs} Designs</span>
                      <span>•</span>
                      <span>{orders.length} Orders</span>
                    </div>
                  </div>

                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => {
                        setCurrentPage('home');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>AI Studio</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('explore');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                    >
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>Explore Trending Drops</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('my-designs');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                    >
                      <Shirt className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Wardrobe</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('orders');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                      <span>Orders & Handover</span>
                    </button>

                    <button
                      onClick={() => {
                        openEditProfileModal();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Profile</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
