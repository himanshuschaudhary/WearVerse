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
  const { designs, searchQuery, setSearchQuery, setCurrentPage, openTryOnModal, openOrderModal } = useApp();

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
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* TOP INTRO BANNER & PROMPT CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Streetwear Drops & Capsules</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              Explore Trending Streetwear
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              Discover curated luxury graphic T-shirts synthesized with generative AI. Try on any design on your photo or order directly with free express delivery.
            </p>
            
            {/* Value Props Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px] font-semibold text-slate-300">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-indigo-400" />
                240 GSM Boxy Cotton
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                1200 DPI Vector DTG
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Handcrafted & Quality Checked
              </span>
            </div>
          </div>

          {/* Quick Switch to AI Chat Studio CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="px-3.5 py-3 rounded-2xl bg-[#141824] hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-bold text-xs transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">How It Works</span>
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Design Your Own in AI Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OPTIONAL HOW IT WORKS ACCORDION */}
        {showHowItWorks && (
          <div className="bg-[#141824] rounded-3xl border border-indigo-500/30 p-5 sm:p-6 relative shadow-xl overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>WearVerse 3-Step Experience</span>
              </div>
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="text-xs text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#1b2030] border border-slate-800 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-300 font-extrabold flex items-center justify-center flex-shrink-0 border border-indigo-500/40">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Browse or Generate</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pick any trending graphic below or describe your custom T-shirt idea in the AI Studio.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1b2030] border border-slate-800 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 text-violet-300 font-extrabold flex items-center justify-center flex-shrink-0 border border-violet-500/40">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Instant Virtual Try-On</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click "Try On Me" to see realistic neural rendering of the tee draped on your body or model.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1b2030] border border-slate-800 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-300 font-extrabold flex items-center justify-center flex-shrink-0 border border-emerald-500/40">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Secure Order & Delivery</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Order with UPI or Card. Every tee is printed on 240 GSM combed cotton with free delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURED CAPSULE SPOTLIGHT */}
        {featuredDesign && (
          <div className="bg-gradient-to-r from-[#151928] via-[#121624] to-[#0e111a] rounded-3xl border border-indigo-500/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center gap-6 justify-between relative z-10">
              
              <div className="space-y-3 max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Featured Drop of the Week</span>
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                  {featuredDesign.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {featuredDesign.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80">
                    👕 {featuredDesign.fabric.gsm} GSM Combed Cotton
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80">
                    ⚡ {featuredDesign.fabric.fit}
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock • Dispatches in 24h
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="text-2xl sm:text-3xl font-black text-white mr-2">
                    ₹{featuredDesign.price.toLocaleString()}
                  </div>

                  <button
                    onClick={() => openOrderModal(featuredDesign)}
                    className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order This T-Shirt</span>
                  </button>

                  <button
                    onClick={() => openTryOnModal(featuredDesign)}
                    className="py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition active:scale-95 border border-slate-700 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-indigo-400" />
                    <span>Try On Me</span>
                  </button>
                </div>
              </div>

              {/* T-Shirt Preview image */}
              <div className="w-48 sm:w-64 aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-2xl flex-shrink-0 group">
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
                      : 'bg-[#141824] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
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
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#141824] border border-slate-800 focus:border-indigo-500 text-base sm:text-xs text-white placeholder:text-slate-500 outline-none transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Count & Sort Dropdown */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs text-slate-400">
              <span>Showing <strong>{sortedDesigns.length}</strong> T-shirts</span>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-[#141824] border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3.5 py-2.5 pr-8 focus:border-indigo-500 outline-none cursor-pointer"
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
          <div className="text-center py-20 bg-[#141824] rounded-3xl border border-slate-800 p-8 space-y-4">
            <p className="text-slate-400 text-sm">No T-shirts match your current filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold transition active:scale-95"
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
