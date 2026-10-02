import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles,
  ShoppingBag, 
  Eye, 
  Star, 
  Crown,
  Users,
  Tag,
  Truck,
  CheckCircle2,
  Flame,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Design } from '../types';
import { useApp } from '../context/AppContext';
import { getFallbackImage } from '../services/aiService';

interface ProductCardProps {
  design: Design;
  showCategoryBadge?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ design, showCategoryBadge = true }) => {
  const { 
    toggleLikeDesign, 
    openTryOnModal, 
    openOrderModal, 
    openDetailModal, 
    setCurrentPage,
    showToast,
    theme 
  } = useApp();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(design.frontImage);
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  const hasBackView = Boolean(design.backImage && design.backImage !== design.frontImage && !design.backImage.includes('tryon_model_back') && !design.backImage.includes('tryon_black_back'));
  const currentImg = viewSide === 'front' ? (imgSrc || design.frontImage) : (design.backImage || design.frontImage);

  const handleImgError = () => {
    setImgSrc(getFallbackImage(0));
  };

  return (
    <div 
      className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg ${
        theme === 'dark'
          ? 'bg-[#151926] text-slate-100 border-slate-800 hover:border-indigo-500/70 hover:shadow-2xl hover:shadow-indigo-500/10'
          : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-400 hover:shadow-xl shadow-slate-200/50'
      }`}
    >
      {/* MEDIA CONTAINER */}
      <div 
        onClick={() => openDetailModal(design)}
        className="relative aspect-square w-full bg-slate-900 overflow-hidden cursor-pointer"
      >
        <img 
          src={currentImg} 
          alt={design.title} 
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={handleImgError}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Navigation Button > to flip side */}
        {hasBackView && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewSide(prev => prev === 'front' ? 'back' : 'front');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl z-20"
              title="Toggle view"
            >
              {viewSide === 'front' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* View Indicator Dots (No text labels) */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setViewSide(prev => prev === 'front' ? 'back' : 'front');
              }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-slate-950/70 hover:bg-slate-950/90 border border-white/20 backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 z-20 shadow-md"
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${viewSide === 'front' ? 'bg-indigo-400 w-3' : 'bg-white/40'}`} />
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${viewSide === 'back' ? 'bg-indigo-400 w-3' : 'bg-white/40'}`} />
            </div>
          </>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 right-1.5 sm:right-3 flex items-center justify-between z-10 pointer-events-none">
          {/* Garment Type Badge */}
          <span className="pointer-events-auto flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-wider rounded-md sm:rounded-lg bg-indigo-600/90 text-white backdrop-blur-md border border-indigo-400/40 shadow-sm">
            {design.garmentType === 'Hoodie' ? (
              <>
                <span>🧥</span>
                <span className="hidden sm:inline">450 GSM Hoodie</span>
                <span className="sm:hidden">450 GSM</span>
              </>
            ) : design.garmentType === 'Sweatshirt' ? (
              <>
                <span>🧶</span>
                <span className="hidden sm:inline">380 GSM Sweatshirt</span>
                <span className="sm:hidden">380 GSM</span>
              </>
            ) : (
              <>
                <span>👕</span>
                <span className="hidden sm:inline">240 GSM Boxy Tee</span>
                <span className="sm:hidden">240 GSM</span>
              </>
            )}
          </span>

          {/* Like Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeDesign(design.id);
            }}
            className={`pointer-events-auto p-1 sm:p-2 rounded-full transition-all duration-200 backdrop-blur-md shadow-md ${
              design.isLiked 
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 scale-105' 
                : theme === 'dark'
                  ? 'bg-slate-950/70 text-slate-300 hover:text-rose-400 hover:scale-105 border border-slate-700/60'
                  : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:scale-105 border border-slate-200 shadow-sm'
            }`}
            aria-label="Like design"
          >
            <Heart 
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
                design.isLiked ? 'fill-rose-500 text-rose-500' : theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`} 
            />
          </button>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between">
        
        {/* Title & Creator */}
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1">
            <span className="truncate font-medium max-w-[65px] sm:max-w-none">
              {design.creator.name.split(' ')[0]}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-400 font-bold text-[10px] sm:text-xs flex-shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{design.rating}</span>
              <span className="text-slate-500 text-[9px] font-normal hidden sm:inline">({design.reviewsCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => openDetailModal(design)}
            className={`font-bold text-xs sm:text-base transition-colors line-clamp-1 cursor-pointer ${
              theme === 'dark' ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'
            }`}
          >
            {design.title}
          </h3>
          
          <p className={`text-[10px] sm:text-xs line-clamp-1 mt-0.5 hidden sm:block ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {design.description}
          </p>
        </div>

        {/* Pricing & Free Delivery Guarantee */}
        <div className={`pt-1 sm:pt-2 border-t flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-800/80' : 'border-slate-100'
        }`}>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className={`text-xs sm:text-lg font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              ₹{design.price.toLocaleString()}
            </span>
            {design.originalPrice && (
              <span className="text-[10px] sm:text-xs text-slate-500 line-through hidden sm:inline">
                ₹{design.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <span className={`hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            theme === 'dark' 
              ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30' 
              : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
          }`}>
            <Truck className="w-3 h-3" />
            <span>Free Delivery</span>
          </span>
        </div>

        {/* ALWAYS-VISIBLE ACTION BUTTONS (Optimized for 3-col mobile) */}
        <div className="space-y-1 sm:space-y-1.5 pt-0.5">
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            {/* Try On Button */}
            <button
              onClick={() => openTryOnModal(design)}
              className={`py-1.5 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition active:scale-95 border ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 shadow-sm'
              }`}
              title="Try On"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
              <span className="hidden sm:inline">Try On Me</span>
              <span className="sm:hidden">Try</span>
            </button>

            {/* Direct Order & Pay Button */}
            <button
              onClick={() => openOrderModal(design)}
              className="py-1.5 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-xs font-extrabold flex items-center justify-center gap-1 transition shadow-md active:scale-95 shadow-indigo-600/30"
              title="Order Now"
            >
              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Order Now</span>
              <span className="sm:hidden">Buy</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
