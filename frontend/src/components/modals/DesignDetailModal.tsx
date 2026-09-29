import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Sparkles, 
  ShoppingBag, 
  Share2, 
  Star, 
  ShieldCheck, 
  Send, 
  Copy,
  ArrowRight,
  Eye,
  Bookmark
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
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0c101d] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh] text-slate-100 ring-1 ring-white/10">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#121626]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-extrabold text-[11px] uppercase tracking-wider">
              {design.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Large Product Image */}
          <div className="lg:col-span-6 p-4 sm:p-6 md:p-8 bg-[#090c14] flex flex-col items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
              <img 
                src={design.frontImage} 
                alt={design.title} 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                ⚡ 240 GSM DTG Cured
              </div>
            </div>

            {/* Quick Prompt Tooltip Preview */}
            <div className="mt-4 w-full max-w-md p-3.5 bg-[#141826] rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  AI Generation Prompt
                </span>
                <button 
                  onClick={handleCopyPrompt}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] font-bold"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 italic font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                "{design.prompt}"
              </p>
            </div>
          </div>

          {/* Right Column: Information, Specs, Creator & Reviews */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#0f1322]/60">
            
            <div className="space-y-6">
              
              {/* Creator & Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={design.creator.avatar} 
                    alt={design.creator.name} 
                    className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    by {design.creator.name}
                  </span>
                  {design.creator.isVerified && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold uppercase">
                      PRO
                    </span>
                  )}
                  <span className="text-xs text-slate-500">• @{design.creator.username}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
                  {design.title}
                </h1>

                {/* Rating & Stats Bar */}
                <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{design.rating}</span>
                    <span className="text-slate-400 font-normal">({design.reviewsCount} reviews)</span>
                  </div>
                  <span>•</span>
                  <span>{design.likesCount} Likes</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 p-4 bg-[#141826] rounded-2xl border border-slate-800">
                <span className="text-2xl font-black text-white font-['Space_Grotesk']">
                  ₹{design.price.toLocaleString()}
                </span>
                {design.originalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    ₹{design.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full ml-auto">
                  Save ₹{(design.originalPrice ? design.originalPrice - design.price : 1000).toLocaleString()} (40% OFF)
                </span>
              </div>

              {/* Tabs: Details vs Reviews */}
              <div className="border-b border-slate-800 flex gap-6 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 transition relative ${
                    activeTab === 'details' 
                      ? 'text-indigo-400 border-b-2 border-indigo-500' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  Overview & Specs
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 transition relative ${
                    activeTab === 'reviews' 
                      ? 'text-indigo-400 border-b-2 border-indigo-500' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  Community Reviews ({designReviews.length})
                </button>
              </div>

              {/* TAB 1: DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {design.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {design.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-1 rounded-lg bg-[#141826] border border-slate-800 text-slate-300 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Fabric Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                    <div className="p-3 bg-[#141826] rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Fabric Weight</span>
                      <span className="font-bold text-white">{design.fabric.gsm} GSM Combed Cotton</span>
                    </div>
                    <div className="p-3 bg-[#141826] rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Fit Silhouette</span>
                      <span className="font-bold text-white">{design.fabric.fit}</span>
                    </div>
                    <div className="p-3 bg-[#141826] rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Printing Method</span>
                      <span className="font-bold text-white">Direct-to-Garment (1200 DPI)</span>
                    </div>
                    <div className="p-3 bg-[#141826] rounded-xl border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Wash Treatment</span>
                      <span className="font-bold text-white">{design.fabric.wash}</span>
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
                      <p className="text-xs text-slate-400 italic py-4 text-center">
                        Be the first verified customer to review this design!
                      </p>
                    ) : (
                      designReviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-[#141826] rounded-xl border border-slate-800 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={rev.user.avatar} alt={rev.user.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="font-bold text-white">{rev.user.name}</span>
                              {rev.user.isVerifiedBuyer && (
                                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded">
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
                          <p className="text-slate-300 text-xs">{rev.comment}</p>
                          <span className="text-[10px] text-slate-500 block">{rev.date}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Add Your Review</span>
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
                                star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
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
                        className="flex-1 px-3.5 py-2.5 text-base sm:text-xs bg-[#141826] border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-white placeholder:text-slate-500"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" /> Post
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 sm:pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <div className="grid grid-cols-2 gap-2 flex-1">
                <button
                  onClick={() => toggleLikeDesign(design.id)}
                  className={`py-3 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition active:scale-95 ${
                    design.isLiked 
                      ? 'border-rose-500/50 bg-rose-950/40 text-rose-400' 
                      : 'border-slate-800 bg-[#141826] text-slate-300 hover:text-white'
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
                  className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 flex items-center justify-center gap-1.5 text-xs font-bold transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
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
