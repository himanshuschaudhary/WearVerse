import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Flame, 
  Users, 
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Eye,
  ShoppingBag,
  ArrowRight,
  HelpCircle,
  X,
  Layers,
  ShieldCheck,
  Feather
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const ExplorePage: React.FC = () => {
  const { designs, searchQuery, setSearchQuery, setCurrentPage, openTryOnModal, openOrderModal, theme } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'streetwear' | 'anime' | 'minimal' | 'indian' | 'community'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'price-low' | 'price-high'>('popular');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Filtering Logic
  const filteredDesigns = designs.filter((design) => {
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = design.title.toLowerCase().includes(q);
      const matchesCreator = design.creator.name.toLowerCase().includes(q);
      const matchesTag = design.tags.some(t => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesCreator && !matchesTag) return false;
    }

    // Active Category Filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'community') return design.isCommunity || !design.isTrending;
    if (activeFilter === 'anime') return design.category.toLowerCase().includes('anime') || design.tags.some(t => t.toLowerCase().includes('anime') || t.toLowerCase().includes('samurai') || t.toLowerCase().includes('jdm'));
    if (activeFilter === 'minimal') return design.category.toLowerCase().includes('minimal') || design.tags.some(t => t.toLowerCase().includes('minimal') || t.toLowerCase().includes('nature'));
    if (activeFilter === 'indian') return design.category.toLowerCase().includes('indian') || design.tags.some(t => t.toLowerCase().includes('mumbai') || t.toLowerCase().includes('indian'));
    if (activeFilter === 'streetwear') return design.category.toLowerCase().includes('streetwear') || design.tags.some(t => t.toLowerCase().includes('cyberpunk') || t.toLowerCase().includes('streetwear'));
    return true;
  });

  // Sorting
  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    if (sortBy === 'popular') return b.likesCount - a.likesCount;
    if (sortBy === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  // Featured Capsule Drop (Top Trending Design)
  const featuredDesign = designs.find(d => d.isTrending) || designs[0];

  return (
    <div className={`min-h-screen font-['Plus_Jakarta_Sans',sans-serif] pb-24 transition-colors ${
      theme === 'dark' ? 'bg-[#0b0e14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* TOP INTRO BANNER & PROMPT CTA */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${
          theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Streetwear Drops & Capsules</span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Explore Trending Streetwear
            </h1>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Discover curated luxury graphic T-shirts synthesized with generative AI. Try on any design on your photo or order directly with free express delivery.
            </p>
            
            {/* Value Props Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px] font-semibold">
              <span className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-slate-800 text-slate-300' 
                  : 'bg-white border-slate-200 text-slate-700 shadow-sm'
              }`}>
                <Feather className="w-3.5 h-3.5 text-indigo-500" />
                240 GSM Boxy Cotton
              </span>
              <span className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-slate-800 text-slate-300' 
                  : 'bg-white border-slate-200 text-slate-700 shadow-sm'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                1200 DPI Vector DTG
              </span>
              <span className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-slate-800 text-slate-300' 
                  : 'bg-white border-slate-200 text-slate-700 shadow-sm'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Handcrafted & Quality Checked
              </span>
            </div>
          </div>

          {/* Quick Switch to AI Chat Studio CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className={`px-3.5 py-3 rounded-2xl border font-bold text-xs transition flex items-center gap-1.5 active:scale-95 ${
                theme === 'dark'
                  ? 'bg-[#141824] hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 shadow-sm'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">How It Works</span>
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 !text-white text-white-force font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 !text-white text-white-force" />
              <span className="!text-white text-white-force">Design Your Own in AI Studio</span>
              <ArrowRight className="w-4 h-4 !text-white text-white-force" />
            </button>
          </div>
        </div>

        {/* OPTIONAL HOW IT WORKS ACCORDION */}
        {showHowItWorks && (
          <div className={`rounded-3xl p-5 sm:p-6 relative shadow-xl overflow-hidden border animate-in fade-in duration-200 ${
            theme === 'dark'
              ? 'bg-[#141824] border-indigo-500/30 text-white'
              : 'bg-white border-indigo-100 text-slate-900 shadow-indigo-100/40'
          }`}>
            <div className={`flex items-center justify-between pb-3 mb-4 border-b ${
              theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-100 text-slate-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>WearVerse 3-Step Experience</span>
              </div>
              <button 
                onClick={() => setShowHowItWorks(false)}
                className={`text-xs p-1 rounded-lg transition ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-3.5 rounded-2xl border flex gap-3 items-start ${
                theme === 'dark' ? 'bg-[#1b2030] border-slate-800' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-600 font-extrabold flex items-center justify-center flex-shrink-0 border border-indigo-500/40">
                  1
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Browse or Generate</h4>
                  <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Pick any trending graphic below or describe your custom T-shirt idea in the AI Studio.
                  </p>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex gap-3 items-start ${
                theme === 'dark' ? 'bg-[#1b2030] border-slate-800' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 text-violet-600 font-extrabold flex items-center justify-center flex-shrink-0 border border-violet-500/40">
                  2
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Instant Virtual Try-On</h4>
                  <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Click "Try On Me" to see realistic neural rendering of the tee draped on your body or model.
                  </p>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex gap-3 items-start ${
                theme === 'dark' ? 'bg-[#1b2030] border-slate-800' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-600 font-extrabold flex items-center justify-center flex-shrink-0 border border-emerald-500/40">
                  3
                </div>
                <div>
                  <h4 className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Secure Order & Delivery</h4>
                  <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Order with UPI or Card. Every tee is printed on 240 GSM combed cotton with free delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURED CAPSULE SPOTLIGHT */}
        {featuredDesign && (
          <div className={`rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-colors border ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-[#151928] via-[#121624] to-[#0e111a] border-indigo-500/30 text-white'
              : 'bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/70 border-indigo-200 text-slate-900 shadow-xl shadow-indigo-100/40'
          }`}>
            {/* Ambient background glow */}
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
              theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-400/15'
            }`} />

            <div className="flex flex-col lg:flex-row items-center gap-6 justify-between relative z-10">
              
              <div className="space-y-3 max-w-xl text-left">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                  theme === 'dark'
                    ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                    : 'bg-indigo-100/90 border-indigo-200 text-indigo-700 shadow-sm'
                }`}>
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Featured Drop of the Week</span>
                </div>

                <h2 className={`text-xl sm:text-3xl font-extrabold font-['Space_Grotesk'] tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {featuredDesign.title}
                </h2>

                <p className={`text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {featuredDesign.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold pt-1">
                  <span className={`px-2.5 py-1 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-slate-900/90 border-slate-700/80 text-slate-300' 
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  }`}>
                    👕 {featuredDesign.fabric.gsm} GSM Combed Cotton
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-slate-900/90 border-slate-700/80 text-slate-300' 
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  }`}>
                    ⚡ {featuredDesign.fabric.fit}
                  </span>
                  <span className={`font-bold text-[11px] flex items-center gap-1 ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock • Dispatches in 24h
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className={`text-2xl sm:text-3xl font-black mr-2 font-['Space_Grotesk'] ${
                    theme === 'dark' ? 'text-white' : 'text-slate-950'
                  }`}>
                    ₹{featuredDesign.price.toLocaleString()}
                  </div>

                  <button
                    onClick={() => openOrderModal(featuredDesign)}
                    className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 !text-white text-white-force font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 !text-white text-white-force" />
                    <span className="!text-white text-white-force">Order This T-Shirt</span>
                  </button>

                  <button
                    onClick={() => openTryOnModal(featuredDesign)}
                    className={`py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 border flex items-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span>Try On Me</span>
                  </button>
                </div>
              </div>

              {/* T-Shirt Preview image */}
              <div className={`w-48 sm:w-64 aspect-square rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 group border ${
                theme === 'dark' ? 'bg-slate-900 border-slate-700/80' : 'bg-white border-slate-200 shadow-slate-200/60'
              }`}>
                <img 
                  src={featuredDesign.frontImage} 
                  alt={featuredDesign.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

            </div>
          </div>
        )}

        {/* INTERACTIVE CATEGORY FILTER TABS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'all', label: '🔥 All Drops', count: designs.length },
              { id: 'streetwear', label: '🛹 Streetwear' },
              { id: 'anime', label: '🐉 Anime & Kanji' },
              { id: 'minimal', label: '⛰️ Minimalist' },
              { id: 'indian', label: '🇮🇳 Desi Culture' },
              { id: 'community', label: '👥 Community Drops' },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400' 
                      : theme === 'dark'
                        ? 'bg-[#141824] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                        : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-sm'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search T-shirts (e.g. dragon, samurai, tokyo, minimal)..."
                className={`w-full pl-10 pr-9 py-2.5 rounded-xl border focus:border-indigo-500 text-base sm:text-xs outline-none transition ${
                  theme === 'dark'
                    ? 'bg-[#141824] border-slate-800 text-white placeholder:text-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${
                    theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Count & Sort Dropdown */}
            <div className={`flex items-center justify-between w-full sm:w-auto gap-3 text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600 font-medium'
            }`}>
              <span>Showing <strong>{sortedDesigns.length}</strong> T-shirts</span>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`appearance-none border text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 focus:border-indigo-500 outline-none cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#141824] border-slate-800 text-slate-200'
                      : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  <option value="popular">Most Popular</option>
                  <option value="latest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {sortedDesigns.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl border p-8 space-y-4 ${
            theme === 'dark' ? 'bg-[#141824] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              No T-shirts match your current filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold transition active:scale-95 shadow-md shadow-indigo-600/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDesigns.map((design) => (
              <ProductCard key={design.id} design={design} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
