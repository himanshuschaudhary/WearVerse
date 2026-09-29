import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Flame, 
  ArrowUpDown,
  ArrowRight,
  X,
  Layers,
  Shirt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

type FilterType = 'all' | 't-shirts' | 'hoodies' | 'sweatshirts' | 'streetwear' | 'anime' | 'minimal';

export const ExplorePage: React.FC = () => {
  const { designs, searchQuery, setSearchQuery, setCurrentPage, theme } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'price-low' | 'price-high'>('popular');

  // Filtering Logic
  const filteredDesigns = designs.filter((design) => {
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = design.title.toLowerCase().includes(q);
      const matchesCreator = design.creator.name.toLowerCase().includes(q);
      const matchesTag = design.tags.some(t => t.toLowerCase().includes(q));
      const matchesGarment = (design.garmentType || 'T-Shirt').toLowerCase().includes(q);
      if (!matchesTitle && !matchesCreator && !matchesTag && !matchesGarment) return false;
    }

    // Active Category / Garment Filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 't-shirts') return !design.garmentType || design.garmentType === 'T-Shirt';
    if (activeFilter === 'hoodies') return design.garmentType === 'Hoodie';
    if (activeFilter === 'sweatshirts') return design.garmentType === 'Sweatshirt';
    if (activeFilter === 'anime') {
      return (
        design.category.toLowerCase().includes('anime') || 
        design.tags.some(t => t.toLowerCase().includes('anime') || t.toLowerCase().includes('samurai') || t.toLowerCase().includes('jdm'))
      );
    }
    if (activeFilter === 'minimal') {
      return (
        design.category.toLowerCase().includes('minimal') || 
        design.tags.some(t => t.toLowerCase().includes('minimal') || t.toLowerCase().includes('botanical') || t.toLowerCase().includes('wave') || t.toLowerCase().includes('zen'))
      );
    }
    if (activeFilter === 'streetwear') {
      return (
        design.category.toLowerCase().includes('streetwear') || 
        design.tags.some(t => t.toLowerCase().includes('cyberpunk') || t.toLowerCase().includes('streetwear') || t.toLowerCase().includes('racing') || t.toLowerCase().includes('mecha'))
      );
    }
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

  return (
    <div className={`min-h-screen font-['Plus_Jakarta_Sans',sans-serif] pb-24 transition-colors ${
      theme === 'dark' ? 'bg-[#0b0e14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Sleek Minimal Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b ${
          theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Curated Apparel Drops
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Heavyweight combed boxy tees, fleece hoodies, and French terry sweatshirts synthesized with generative AI.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 !text-white text-white-force font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 flex-shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 !text-white text-white-force" />
            <span className="!text-white text-white-force">Design Your Own in AI Studio</span>
            <ArrowRight className="w-4 h-4 !text-white text-white-force" />
          </button>
        </div>

        {/* INTERACTIVE GARMENT & CATEGORY FILTER TABS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'all' as FilterType, label: '🔥 All Items', count: designs.length },
              { id: 't-shirts' as FilterType, label: '👕 T-Shirts (240 GSM)', count: designs.filter(d => !d.garmentType || d.garmentType === 'T-Shirt').length },
              { id: 'hoodies' as FilterType, label: '🧥 Hoodies (450 GSM)', count: designs.filter(d => d.garmentType === 'Hoodie').length },
              { id: 'sweatshirts' as FilterType, label: '🧶 Sweatshirts (380 GSM)', count: designs.filter(d => d.garmentType === 'Sweatshirt').length },
              { id: 'streetwear' as FilterType, label: '🛹 Streetwear' },
              { id: 'anime' as FilterType, label: '🐉 Anime & Kanji' },
              { id: 'minimal' as FilterType, label: '⛰️ Minimalist' },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
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
                placeholder="Search by apparel type, artwork, style..."
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
              <span>Showing <strong>{sortedDesigns.length}</strong> items</span>
              
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
              No apparel items match your current filter.
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
