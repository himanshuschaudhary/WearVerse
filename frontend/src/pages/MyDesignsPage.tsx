import React, { useState } from 'react';
import { 
  Shirt, 
  Heart, 
  Sparkles, 
  Edit3, 
  Eye, 
  ShoppingBag, 
  Trash2, 
  Calendar,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Design } from '../types';

export const MyDesignsPage: React.FC = () => {
  const { 
    user, 
    designs, 
    isLoggedIn,
    openAuthModal,
    setCurrentPage, 
    openEditorWithDesign, 
    openTryOnModal, 
    openOrderModal, 
    deleteDesign 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my-designs' | 'liked'>('my-designs');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0d0f17] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#141826] border border-slate-800 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Sign In to View Wardrobe
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Create an account or sign in to save bespoke designs, organize your favorites, and manage your AI fashion creations.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95"
            >
              Sign In / Create Account
            </button>
            <button
              onClick={() => setCurrentPage('create')}
              className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Back to AI Studio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter collections
  const myDesigns = designs.filter(d => 
    d.creator.username === user.username || 
    d.id.startsWith('saved') || 
    d.id.startsWith('gen')
  );

  const likedDesigns = designs.filter(d => d.isLiked);

  const getActiveList = () => {
    if (activeTab === 'liked') return likedDesigns;
    return myDesigns;
  };

  const list = getActiveList();

  return (
    <div className="min-h-screen bg-[#0d0f17] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Shirt className="w-4 h-4" />
              <span>Personal Wardrobe</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              My Wardrobe & Saved Designs
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your AI creations, saved custom pieces, and favorited drops.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('create')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Design New T-Shirt</span>
          </button>
        </div>

        {/* Tabs: My Designs, Liked */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: 'my-designs', label: `My Designs (${myDesigns.length})`, icon: Shirt },
            { id: 'liked', label: `Liked (${likedDesigns.length})`, icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 whitespace-nowrap active:scale-95 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'bg-[#151926] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid of Designs */}
        {list.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-[#151926] rounded-3xl border border-slate-800 p-8">
            <Shirt className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white">No designs in this folder yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Start crafting a custom streetwear design in the AI studio or explore community drops.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('create')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              Create in AI Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((design) => (
              <div 
                key={design.id}
                className="bg-[#151926] rounded-3xl border border-slate-800 hover:border-indigo-500/60 shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Media */}
                <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={design.frontImage} 
                    alt={design.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-slate-800">
                    ₹{design.price.toLocaleString()}
                  </div>
                </div>

                {/* Info Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white truncate">{design.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(design.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-rose-400">
                        <Heart className="w-3 h-3 fill-rose-500" />
                        {design.likesCount}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Edit, Try On, Order, Delete */}
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => openEditorWithDesign(design)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold flex items-center justify-center transition active:scale-95"
                      title="Refine in AI Chat"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    </button>

                    <button
                      onClick={() => openTryOnModal(design)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center justify-center transition active:scale-95"
                      title="Virtual Try-On"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openOrderModal(design)}
                      className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center transition active:scale-95 shadow-md shadow-indigo-600/30"
                      title="Order T-Shirt"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition flex items-center justify-center active:scale-95"
                      title="Delete Design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
