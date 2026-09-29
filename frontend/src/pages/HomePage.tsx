import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Search, 
  Bell, 
  Heart, 
  MessageCircle, 
  MoreVertical, 
  ArrowRight, 
  Camera, 
  Palette, 
  Type, 
  Zap, 
  Layers,
  Sun,
  Moon,
  X,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Flame,
  Shirt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WearVerseLogo } from '../components/WearVerseLogo';
import { Design } from '../types';

export const HomePage: React.FC = () => {
  const { 
    user, 
    isLoggedIn, 
    openAuthModal, 
    setCurrentPage, 
    designs, 
    toggleLikeDesign, 
    openTryOnModal, 
    openOrderModal, 
    openDetailModal,
    theme, 
    toggleTheme,
    showToast 
  } = useApp();

  const [promptInput, setPromptInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Minimal',
    'Anime',
    'Streetwear',
    'Quotes',
    'Indian',
    'Abstract'
  ];

  const handleStartGeneration = (customPrompt?: string) => {
    const finalPrompt = customPrompt || promptInput.trim();
    if (!finalPrompt) {
      showToast('info', 'Type an idea first', 'Describe any design (e.g. "Cyberpunk dragon oversized tee") to generate!');
      return;
    }

    // Save prompt to session storage so AI Chat Studio picks it up immediately
    sessionStorage.setItem('wearverse_initial_prompt', finalPrompt);
    setCurrentPage('create');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleStartGeneration();
    }
  };

  // Trending designs curated for the hero section matching Image 4
  const trendingList = [
    {
      id: 'wv-001',
      title: 'Dragon Legacy',
      creator: { name: 'Aryan Sharma', username: 'aryan_designs', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 2400,
      commentsCount: 236,
      image: '/assets/dragon_legacy.jpg',
      price: 1499,
      category: 'Anime',
    },
    {
      id: 'wv-002',
      title: 'Mountain Vibes',
      creator: { name: 'Nature Studio', username: 'nature.studio', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      likesCount: 1800,
      commentsCount: 120,
      image: '/assets/mountain_vibes.jpg',
      price: 1299,
      category: 'Minimal',
    },
    {
      id: 'wv-005',
      title: 'Lost Soul',
      creator: { name: 'Ryan Ink', username: 'ryan.ink', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      likesCount: 3100,
      commentsCount: 410,
      image: '/assets/void.jpg',
      price: 1599,
      category: 'Streetwear',
    },
    {
      id: 'wv-003',
      title: 'Tokyo Drift 1982',
      creator: { name: 'Kenji Sato', username: 'tokyodrift', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
      likesCount: 2900,
      commentsCount: 194,
      image: '/assets/tokyo_drift.jpg',
      price: 1599,
      category: 'Streetwear',
    },
  ];

  const communityList = [
    {
      id: 'wv-006',
      title: 'Good Days Ahead',
      creator: { name: 'Vibe Creator', username: 'goodvibes', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150' },
      likesCount: 1450,
      commentsCount: 98,
      image: '/assets/broken_reality.jpg',
      price: 1399,
    },
    {
      id: 'wv-008',
      title: 'Mountain Sun',
      creator: { name: 'Devanagari Neo', username: 'urban_desi', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
      likesCount: 2150,
      commentsCount: 142,
      image: '/assets/mountain_vibes.jpg',
      price: 1399,
    },
    {
      id: 'wv-007',
      title: 'Cyber Tiger 2026',
      creator: { name: 'Neo Tokyo', username: 'neotokyo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 3890,
      commentsCount: 312,
      image: '/assets/cyber_tiger.jpg',
      price: 1699,
    },
  ];

  // Filtered designs based on active category
  const filteredTrending = activeCategory === 'All' 
    ? trendingList 
    : trendingList.filter(d => d.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className={`min-h-screen pb-28 md:pb-16 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>

      {/* TOP MOBILE APP BAR (Matching Image 4) */}
      <header className={`sticky top-0 z-40 px-4 py-3 backdrop-blur-xl border-b transition-colors ${
        theme === 'dark' 
          ? 'bg-[#07090e]/90 border-slate-800/80 text-white' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <span className="text-white font-black text-sm tracking-wider font-['Outfit']">W</span>
            </div>
            <span className={`text-lg font-black tracking-tight font-['Outfit'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              WearVerse
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden md:flex items-center gap-1.5 p-1 rounded-2xl border transition-colors ${
            theme === 'dark' ? 'bg-[#121622]/80 border-slate-800/80' : 'bg-slate-100/90 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setCurrentPage('create')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>AI Chat Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('explore')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Explore</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  openAuthModal('login');
                  return;
                }
                setCurrentPage('my-designs');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-slate-400" />
              <span>Wardrobe</span>
            </button>
          </nav>

          {/* Right Header Icons */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition active:scale-90 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700/80 text-amber-300'
                  : 'bg-slate-100 border-slate-200 text-indigo-600'
              }`}
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setCurrentPage('explore')}
              className={`p-2 rounded-full border transition active:scale-90 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
              }`}
              title="Search drops"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell with Red Badge */}
            <button
              type="button"
              onClick={() => {
                showToast('info', '🔥 New Drop Alert', 'Dragon Legacy 240 GSM Boxy Tee is the featured drop of the week!');
              }}
              className={`relative p-2 rounded-full border transition active:scale-90 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* User Profile Avatar */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setCurrentPage('profile')}
                className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-500/50 active:scale-95 transition"
                title="View Profile"
              >
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 !text-white text-white-force text-xs font-bold shadow-md shadow-indigo-600/30 active:scale-95 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 pt-4 sm:pt-6 space-y-6">

        {/* HERO SECTION MATCHING IMAGE 4 */}
        <div className={`relative rounded-3xl overflow-hidden p-6 sm:p-8 border shadow-xl transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#121626] via-[#0d101c] to-[#07090e] border-indigo-500/30'
            : 'bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 border-indigo-100 shadow-indigo-100/50'
        }`}>
          {/* Fashion Model Background Graphic (Right Side Image 4) */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 pointer-events-none opacity-40 sm:opacity-90 overflow-hidden flex items-center justify-end">
            <img 
              src="/assets/hero_model.jpg" 
              alt="Fashion Model wearing graphic streetwear" 
              className="h-full w-full object-cover object-center mask-radial-hero transform scale-105"
            />
            <div className={`absolute inset-0 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-[#121626] via-[#121626]/60 to-transparent' 
                : 'bg-gradient-to-r from-white via-white/70 to-transparent'
            }`} />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-lg space-y-3">
            {/* Small Glowing Pill */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              theme === 'dark'
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                : 'bg-indigo-100 border-indigo-200 text-indigo-700 shadow-xs'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Powered</span>
            </div>

            {/* Big Headline */}
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              Turn Your Ideas Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Wearable Art
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Describe an idea, a mood, a graphic, or a style. We'll turn it into a T-shirt you can actually wear.
            </p>
          </div>
        </div>

        {/* EMBEDDED IN-PAGE AI PROMPT COMPOSER CARD (Matching Image 4) */}
        <div className={`p-4 rounded-3xl border shadow-xl space-y-3 transition-colors ${
          theme === 'dark'
            ? 'bg-[#121626]/95 border-indigo-500/30 shadow-indigo-500/5'
            : 'bg-white border-slate-200/90 shadow-lg shadow-indigo-100/40'
        }`}>
          {/* Main Input Row */}
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              theme === 'dark' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>

            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your T-shirt design... e.g. A black oversized T-shirt with a minimal Japanese dragon"
              className={`flex-1 text-xs sm:text-sm bg-transparent outline-none placeholder:text-slate-400 leading-normal ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            />

            {/* Vibrant Circular Send Button (Matching Image 4) */}
            <button
              type="button"
              onClick={() => handleStartGeneration()}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 !text-white text-white-force flex items-center justify-center shadow-lg shadow-indigo-600/40 transition active:scale-90 flex-shrink-0"
              title="Generate with AI"
            >
              <Send className="w-4 h-4 !text-white text-white-force ml-0.5" />
            </button>
          </div>

          {/* Quick Helper Action Chips Below Input (Matching Image 4) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => handleStartGeneration('Cyberpunk Neo-Tokyo street art')}
              className={`px-3 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 flex-shrink-0 transition active:scale-95 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Style</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartGeneration('Onyx black heavy washed 240 GSM')}
              className={`px-3 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 flex-shrink-0 transition active:scale-95 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-violet-500" />
              <span>Color</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartGeneration('Vintage 80s motorsport analog drift')}
              className={`px-3 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 flex-shrink-0 transition active:scale-95 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Vibe</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartGeneration('Tokyo Kanji Typography on heavy tee')}
              className={`px-3 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 flex-shrink-0 transition active:scale-95 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-pink-500" />
              <span>Add Text</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('create')}
              className={`px-3 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 flex-shrink-0 transition active:scale-95 ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 shadow-xs'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-emerald-500" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* HORIZONTAL CATEGORY PILLS (Matching Image 4) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md'
                    : theme === 'dark'
                      ? 'bg-[#141824] text-slate-400 hover:text-white border border-slate-800'
                      : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200 shadow-xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* SECTION 1: TRENDING DESIGNS (Matching Image 4) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg sm:text-xl font-extrabold font-['Space_Grotesk'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              Trending Designs
            </h2>
            <button
              type="button"
              onClick={() => setCurrentPage('explore')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Scrolling Card Carousel */}
          <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {filteredTrending.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  const match = designs.find(d => d.id === item.id) || designs[0];
                  openDetailModal(match);
                }}
                className={`w-44 sm:w-56 rounded-3xl border shadow-lg overflow-hidden flex-shrink-0 cursor-pointer group transition-all duration-300 hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'bg-[#141824] border-slate-800'
                    : 'bg-white border-slate-200 shadow-slate-200/50'
                }`}
              >
                {/* Image & Heart Button */}
                <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Like Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeDesign(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/60 text-white hover:text-rose-500 transition"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-3 space-y-1.5">
                  <h3 className={`font-bold text-xs sm:text-sm truncate ${
                    theme === 'dark' ? 'text-white' : 'text-slate-950'
                  }`}>
                    {item.title}
                  </h3>

                  {/* Creator Tag with Avatar */}
                  <div className="flex items-center gap-1.5">
                    <img 
                      src={item.creator.avatar} 
                      alt={item.creator.name} 
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className={`text-[11px] truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      @{item.creator.username}
                    </span>
                  </div>

                  {/* Social Counters: Likes, Comments, More */}
                  <div className={`flex items-center justify-between pt-1 text-[11px] border-t ${
                    theme === 'dark' ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500" />
                        <span>{(item.likesCount / 1000).toFixed(1)}K</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-indigo-500" />
                        <span>{item.commentsCount}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const match = designs.find(d => d.id === item.id) || designs[0];
                        openOrderModal(match);
                      }}
                      className="p-1 hover:text-indigo-500 transition"
                      title="Quick Order"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: TOP COMMUNITY DESIGNS (Matching Image 4) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg sm:text-xl font-extrabold font-['Space_Grotesk'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              Top Community Designs
            </h2>
            <button
              type="button"
              onClick={() => setCurrentPage('community')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Scrolling Community Carousel */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {communityList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  const match = designs.find(d => d.id === item.id) || designs[0];
                  openDetailModal(match);
                }}
                className={`w-44 sm:w-56 rounded-3xl border shadow-lg overflow-hidden flex-shrink-0 cursor-pointer group transition-all duration-300 hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'bg-[#141824] border-slate-800'
                    : 'bg-white border-slate-200 shadow-slate-200/50'
                }`}
              >
                <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeDesign(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/60 text-white hover:text-rose-500 transition"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 space-y-1">
                  <h3 className={`font-bold text-xs sm:text-sm truncate ${
                    theme === 'dark' ? 'text-white' : 'text-slate-950'
                  }`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                      @{item.creator.username}
                    </span>
                    <span className="font-extrabold text-indigo-500">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FLOATING MOBILE AI CHAT SHORTCUT (Always visible on mobile) */}
      <button
        type="button"
        onClick={() => setCurrentPage('create')}
        className="fixed bottom-20 right-4 z-40 md:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-600/50 font-extrabold text-xs active:scale-95 border border-white/20 animate-bounce-subtle"
        title="Open AI Chat Studio"
      >
        <Sparkles className="w-4 h-4 fill-white text-white" />
        <span>AI Chat</span>
      </button>
    </div>
  );
};
