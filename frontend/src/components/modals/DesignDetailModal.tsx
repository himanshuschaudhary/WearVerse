import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Sparkles, 
  ShoppingBag, 
  Share2, 
  Star, 
  Send, 
  Copy,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Design } from '../../types';
import { useApp } from '../../context/AppContext';

interface DesignDetailModalProps {
  design: Design;
}

export const DesignDetailModal: React.FC<DesignDetailModalProps> = ({ design }) => {
  const { 
    closeModal, 
    toggleLikeDesign, 
    openTryOnModal, 
    openOrderModal, 
    reviews, 
    addReview, 
    showToast,
    theme
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  const hasBackView = Boolean(design.backImage && design.backImage !== design.frontImage && !design.backImage.includes('tryon_model_back') && !design.backImage.includes('tryon_black_back'));
  const currentImage = viewSide === 'front' ? design.frontImage : (design.backImage || design.frontImage);

  const designReviews = reviews[design.id] || [];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('info', 'Link copied', `Direct link for "${design.title}" copied.`);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard?.writeText(design.prompt);
    showToast('info', 'Prompt copied', 'AI prompt copied to clipboard.');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    addReview(design.id, newRating, newReviewText.trim());
    setNewReviewText('');
    setActiveTab('reviews');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto backdrop-blur-xl animate-in fade-in duration-200 ${
      theme === 'dark' ? 'bg-slate-950/85' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border transition-colors ${
        theme === 'dark' 
          ? 'bg-[#0c101d] border-slate-700/80 text-slate-100 ring-1 ring-white/10' 
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30 ring-1 ring-slate-900/5'
      }`}>
        
        {/* Top Header */}
        <div className={`px-6 py-4 border-b backdrop-blur-md flex items-center justify-between transition-colors ${
          theme === 'dark' ? 'border-slate-800 bg-[#121626]/80' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full font-extrabold text-[11px] uppercase tracking-wider border shadow-sm ${
              theme === 'dark' 
                ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              {design.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-xl transition ${
                theme === 'dark' 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeModal}
              className={`p-2 rounded-xl transition ${
                theme === 'dark' 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Large Product Image */}
          <div className={`lg:col-span-6 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center relative transition-colors ${
            theme === 'dark' ? 'bg-[#090c14]' : 'bg-slate-50/80 border-r border-slate-200'
          }`}>
            <div className={`relative w-full aspect-square max-w-md rounded-2xl overflow-hidden border shadow-2xl ${
              theme === 'dark' ? 'border-slate-800 bg-slate-950 shadow-black/60' : 'border-slate-200 bg-white shadow-slate-200/80'
            }`}>
              <img 
                src={currentImage} 
                alt={`${design.title} - ${viewSide} view`} 
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className={`absolute top-3 left-3 backdrop-blur-md border px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase z-10 shadow-sm ${
                theme === 'dark' 
                  ? 'bg-slate-950/85 text-emerald-400 border-emerald-500/40' 
                  : 'bg-white/95 text-emerald-700 border-emerald-300'
              }`}>
                ⚡ {design.fabric?.gsm || 240} GSM DTG Cured
              </div>

              {/* Navigation Arrows for Front / Back Views */}
              {hasBackView && (
                <>
                  <button
                    type="button"
                    onClick={() => setViewSide(prev => prev === 'front' ? 'back' : 'front')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 hover:bg-indigo-600 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all hover:scale-110 shadow-2xl z-20"
                    title="Toggle view"
                  >
                    {viewSide === 'front' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>

                  {/* View Indicator Dots (No text labels) */}
                  <div 
                    onClick={() => setViewSide(prev => prev === 'front' ? 'back' : 'front')}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/20 z-20 shadow-xl cursor-pointer hover:bg-slate-950/90 transition"
                  >
                    <span className={`w-2 h-2 rounded-full transition-all ${viewSide === 'front' ? 'bg-indigo-500 w-4' : 'bg-white/40'}`} />
                    <span className={`w-2 h-2 rounded-full transition-all ${viewSide === 'back' ? 'bg-indigo-500 w-4' : 'bg-white/40'}`} />
                  </div>
                </>
              )}
            </div>

            {/* Quick Prompt Tooltip Preview */}
            <div className={`mt-4 w-full max-w-md p-3.5 rounded-2xl border text-xs shadow-sm transition-colors ${
              theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center justify-between font-semibold mb-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span className={`flex items-center gap-1.5 font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  AI Generation Prompt
                </span>
                <button 
                  onClick={handleCopyPrompt}
                  className={`flex items-center gap-1 text-[11px] font-bold ${
                    theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                  }`}
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <p className={`text-[11px] line-clamp-2 italic font-mono p-2 rounded-lg border transition-colors ${
                theme === 'dark' ? 'text-slate-300 bg-slate-900/60 border-slate-800' : 'text-slate-700 bg-slate-50 border-slate-200'
              }`}>
                "{design.prompt}"
              </p>
            </div>
          </div>

          {/* Right Column: Information, Specs, Creator & Reviews */}
          <div className={`lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto transition-colors ${
            theme === 'dark' ? 'bg-[#0f1322]/60' : 'bg-white'
          }`}>
            
            <div className="space-y-6">
              
              {/* Creator & Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={design.creator.avatar} 
                    alt={design.creator.name} 
                    className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                  />
                  <span className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    by {design.creator.name}
                  </span>
                  {design.creator.isVerified && (
                    <span className={`px-1.5 py-0.2 rounded border text-[10px] font-extrabold uppercase ${
                      theme === 'dark' 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                        : 'bg-indigo-100 text-indigo-700 border-indigo-300'
                    }`}>
                      PRO
                    </span>
                  )}
                  <span className="text-xs text-slate-500">• @{design.creator.username}</span>
                </div>

                <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  {design.title}
                </h1>

                {/* Rating & Stats Bar */}
                <div className={`flex items-center gap-4 mt-2.5 text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600 font-medium'
                }`}>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{design.rating}</span>
                    <span className={`font-normal ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({design.reviewsCount} reviews)
                    </span>
                  </div>
                  <span>•</span>
                  <span>{design.likesCount} Likes</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className={`flex items-baseline gap-3 p-4 rounded-2xl border transition-colors shadow-sm ${
                theme === 'dark' 
                  ? 'bg-[#141826] border-slate-800' 
                  : 'bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border-slate-200'
              }`}>
                <span className={`text-2xl font-black font-['Space_Grotesk'] ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  ₹{design.price.toLocaleString()}
                </span>
                {design.originalPrice && (
                  <span className={`text-sm line-through ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    ₹{design.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className={`text-[11px] font-bold border px-2.5 py-0.5 rounded-full ml-auto ${
                  theme === 'dark' 
                    ? 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30' 
                    : 'text-emerald-700 bg-emerald-100 border-emerald-300'
                }`}>
                  Save ₹{(design.originalPrice ? design.originalPrice - design.price : 1000).toLocaleString()} (40% OFF)
                </span>
              </div>

              {/* Tabs: Details vs Reviews */}
              <div className={`border-b flex gap-6 text-xs font-bold uppercase tracking-wider transition-colors ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 transition relative ${
                    activeTab === 'details' 
                      ? (theme === 'dark' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-indigo-600 border-b-2 border-indigo-600') 
                      : (theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-950')
                  }`}
                >
                  Overview & Specs
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 transition relative ${
                    activeTab === 'reviews' 
                      ? (theme === 'dark' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-indigo-600 border-b-2 border-indigo-600') 
                      : (theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-950')
                  }`}
                >
                  Community Reviews ({designReviews.length})
                </button>
              </div>

              {/* TAB 1: DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {design.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {design.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                          theme === 'dark' 
                            ? 'bg-[#141826] border-slate-800 text-slate-300' 
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Fabric Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                    <div className={`p-3 rounded-xl border shadow-sm transition-colors ${
                      theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-500 font-semibold'
                      }`}>Fabric Weight</span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>{design.fabric.gsm} GSM Combed Cotton</span>
                    </div>
                    <div className={`p-3 rounded-xl border shadow-sm transition-colors ${
                      theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-500 font-semibold'
                      }`}>Fit Silhouette</span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>{design.fabric.fit}</span>
                    </div>
                    <div className={`p-3 rounded-xl border shadow-sm transition-colors ${
                      theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-500 font-semibold'
                      }`}>Printing Method</span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>Direct-to-Garment (1200 DPI)</span>
                    </div>
                    <div className={`p-3 rounded-xl border shadow-sm transition-colors ${
                      theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`block text-[10px] uppercase font-bold ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-500 font-semibold'
                      }`}>Wash Treatment</span>
                      <span className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>{design.fabric.wash}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Reviews List */}
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {designReviews.length === 0 ? (
                      <p className={`text-xs italic py-4 text-center ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Be the first verified customer to review this design!
                      </p>
                    ) : (
                      designReviews.map((rev) => (
                        <div key={rev.id} className={`p-3 rounded-xl border text-xs space-y-1.5 shadow-sm transition-colors ${
                          theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={rev.user.avatar} alt={rev.user.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {rev.user.name}
                              </span>
                              {rev.user.isVerifiedBuyer && (
                                <span className={`text-[10px] font-semibold border px-1.5 py-0.2 rounded ${
                                  theme === 'dark' 
                                    ? 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30' 
                                    : 'text-emerald-700 bg-emerald-100 border-emerald-300'
                                }`}>
                                  Verified Buyer
                                </span>
                              )}
                            </div>
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {rev.comment}
                          </p>
                          <span className={`text-[10px] block ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {rev.date}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className={`pt-2 border-t space-y-2 ${
                    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                      }`}>Add Your Review</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-0.5"
                          >
                            <Star 
                              className={`w-4 h-4 ${
                                star <= newRating 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : (theme === 'dark' ? 'text-slate-600' : 'text-slate-300')
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Write your review on fabric drape, print fidelity..."
                        className={`flex-1 px-3.5 py-2.5 text-base sm:text-xs rounded-xl outline-none border transition ${
                          theme === 'dark' 
                            ? 'bg-[#141826] border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500' 
                            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 shadow-sm'
                        }`}
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-indigo-600/20"
                      >
                        <Send className="w-3.5 h-3.5" /> Post
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className={`pt-4 sm:pt-6 border-t flex flex-col sm:flex-row gap-2 ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="grid grid-cols-2 gap-2 flex-1">
                <button
                  onClick={() => toggleLikeDesign(design.id)}
                  className={`py-3 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition active:scale-95 ${
                    design.isLiked 
                      ? (theme === 'dark' ? 'border-rose-500/50 bg-rose-950/40 text-rose-400' : 'border-rose-300 bg-rose-50 text-rose-600') 
                      : (theme === 'dark' ? 'border-slate-800 bg-[#141826] text-slate-300 hover:text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm')
                  }`}
                >
                  <Heart className={`w-4 h-4 ${design.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{design.isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                  onClick={() => {
                    closeModal();
                    openTryOnModal(design);
                  }}
                  className={`py-3 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition active:scale-95 ${
                    theme === 'dark' 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60' 
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Try On</span>
                </button>
              </div>

              <button
                onClick={() => {
                  closeModal();
                  openOrderModal(design);
                }}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now (₹{design.price.toLocaleString()})</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
