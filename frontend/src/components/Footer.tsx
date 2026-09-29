import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Feather, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WearVerseLogo } from './WearVerseLogo';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-[#090c14] border-t border-slate-800 mt-16 pb-28 md:pb-12 text-slate-400 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Premium Garment Promise Badges */}
      <div className="border-b border-slate-800/80 bg-[#0f121d]/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141826] border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">240 GSM Terry Cotton</p>
              <p className="text-[11px] text-slate-400">Heavyweight luxury drape</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141826] border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-violet-950/80 text-violet-400 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">1200 DPI DTG Print</p>
              <p className="text-[11px] text-slate-400">Wash-safe vibrant inks</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141826] border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Free Express Delivery</p>
              <p className="text-[11px] text-slate-400">Dispatched in gift box</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141826] border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Handover Guarantee</p>
              <p className="text-[11px] text-slate-400">100% verified fulfillment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => setCurrentPage('home')}>
              <WearVerseLogo size="md" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              WearVerse empowers creators to design, visualize, virtually try on, and manufacture custom luxury streetwear on-demand using generative artificial intelligence.
            </p>
            <div className="pt-2 text-[10px] text-slate-500 font-semibold tracking-wider">
              DISCOVER • CREATE • EDIT • TRY ON • ORDER
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('create')} className="text-slate-400 hover:text-indigo-400 transition">
                  AI Design Studio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('explore')} className="text-slate-400 hover:text-indigo-400 transition">
                  Discovery & Feed
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="text-slate-400 hover:text-indigo-400 transition">
                  Curated Streetwear Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('community')} className="text-slate-400 hover:text-indigo-400 transition">
                  Community Creations
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Account</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('my-designs')} className="text-slate-400 hover:text-indigo-400 transition">
                  My Wardrobe
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('orders')} className="text-slate-400 hover:text-indigo-400 transition">
                  Track Orders & Handover
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('profile')} className="text-slate-400 hover:text-indigo-400 transition">
                  Virtual Try-On Photo
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Drop Alerts</p>
            <p className="text-xs text-slate-400">Subscribe for early access to limited edition AI artist drops.</p>
            <div className="flex gap-1.5">
              <input 
                type="email" 
                placeholder="Enter email..." 
                className="bg-[#141826] border border-slate-800 text-white placeholder:text-slate-600 text-base sm:text-xs px-3 py-2 rounded-xl flex-1 outline-none focus:border-indigo-500 transition"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition shadow-md">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 WearVerse Inc. All rights reserved. Crafted for creators & fashion rebels.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Sizing Guide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
