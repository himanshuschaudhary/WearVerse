import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Star, 
  Heart, 
  Eye, 
  Filter, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Design } from '../types';

export const ShopPage: React.FC = () => {
  const { designs, openDetailModal, openTryOnModal, openOrderModal, toggleLikeDesign } = useApp();

  const [activeSection, setActiveSection] = useState<string>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');

  const shopSections = [
    'All',
    'Trending',
    'New Arrivals',
    'Popular',
    'Minimal',
    'Streetwear',
    'Anime',
    'Indian',
  ];

  const filteredDesigns = designs.filter((d) => {
    if (activeSection === 'All') return true;
    if (activeSection === 'Trending') return d.isTrending;
    if (activeSection === 'New Arrivals') return d.isRecentlyCreated;
    if (activeSection === 'Popular') return d.likesCount > 1200;
    return d.category.toLowerCase() === activeSection.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Banner / Store Header */}
      <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Heavyweight Streetwear On-Demand</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight">
            Official WearVerse Streetwear Store
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every garment is individually crafted using bio-washed 240 GSM combed cotton and cured with 1200 DPI DTG precision inks. Free express domestic delivery on all drops.
          </p>
        </div>

        {/* Ambient lighting element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-600/30 to-transparent pointer-events-none" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          {shopSections.map((sec) => {
            const isActive = activeSection === sec;
            return (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive 
                    ? 'bg-slate-950 text-white shadow-sm' 
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {sec}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
          Showing {filteredDesigns.length} pieces
        </span>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDesigns.map((product) => (
          <div 
            key={product.id}
            className="group bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Image Container */}
            <div 
              onClick={() => openDetailModal(product)}
              className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer"
            >
              <img 
                src={product.frontImage} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm border border-slate-200/60 uppercase">
                {product.category}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLikeDesign(product.id);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-rose-500 hover:scale-110 shadow-sm transition"
              >
                <Heart className={`w-4 h-4 ${product.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Product Meta */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>by {product.creator.name}</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                  </div>
                </div>

                <h3 
                  onClick={() => openDetailModal(product)}
                  className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.description}</p>
              </div>

              {/* Price & Primary Action CTAs */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-slate-900 font-['Space_Grotesk']">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    240 GSM Cotton
                  </span>
                </div>

                {/* SECTION 16 REQUIRED CTAs: View Design, Try On, Order */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openDetailModal(product)}
                    className="py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => openTryOnModal(product)}
                    className="py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Try On</span>
                  </button>

                  <button
                    onClick={() => openOrderModal(product)}
                    className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
