import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Feather, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WearVerseLogo } from './WearVerseLogo';

export const Footer: React.FC = () => {
  const { setCurrentPage, theme } = useApp();

  return (
    <footer className={`border-t mt-16 pb-28 md:pb-12 font-['Plus_Jakarta_Sans',sans-serif] transition-colors ${
      theme === 'dark' 
        ? 'bg-[#090c14] border-slate-800 text-slate-400' 
        : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      
      {/* Premium Garment Promise Badges */}
      <div className={`border-b py-8 transition-colors ${
        theme === 'dark' ? 'border-slate-800/80 bg-[#0f121d]/60' : 'border-slate-200 bg-white/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              theme === 'dark' ? 'bg-indigo-950/80 text-indigo-400 border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
            }`}>
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>240 GSM Terry Cotton</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Heavyweight luxury drape</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              theme === 'dark' ? 'bg-violet-950/80 text-violet-400 border-violet-500/30' : 'bg-violet-50 text-violet-600 border-violet-200'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1200 DPI DTG Print</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Wash-safe vibrant inks</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              theme === 'dark' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Free Express Delivery</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Dispatched in gift box</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              theme === 'dark' ? 'bg-amber-950/80 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Handover Guarantee</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>100% verified fulfillment</p>
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
            <p className={`text-xs leading-relaxed max-w-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              WearVerse empowers creators to design, visualize, virtually try on, and manufacture custom luxury streetwear on-demand using generative artificial intelligence.
            </p>
            <div className={`pt-2 text-[10px] font-semibold tracking-wider ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              DISCOVER • CREATE • EDIT • TRY ON • ORDER
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>Platform</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('create')} className={`${
                  theme === 'dark' ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                } transition`}>
                  AI Design Studio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('explore')} className={`${
                  theme === 'dark' ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                } transition`}>
                  Discovery & Feed
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className={`${
                  theme === 'dark' ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                } transition`}>
                  Curated Streetwear Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('community')} className={`${
                  theme === 'dark' ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                } transition`}>
                  Community Creations
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>Account</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('my-designs')} className={`${
                  theme === 'dark' ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                } transition`}>
                  My Wardrobe
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('orders')} className={`${
                  theme === 'dark' ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                } transition`}>
                  Track Orders & Handover
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('profile')} className={`${
                  theme === 'dark' ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                } transition`}>
                  Virtual Try-On Photo
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <p className={`text-xs font-bold uppercase tracking-wider ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>Drop Alerts</p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>Subscribe for early access to limited edition AI artist drops.</p>
            <div className="flex gap-1.5">
              <input 
                type="email" 
                placeholder="Enter email..." 
                className={`text-base sm:text-xs px-3 py-2 rounded-xl flex-1 outline-none transition border ${
                  theme === 'dark'
                    ? 'bg-[#141826] border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 shadow-xs'
                }`}
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition shadow-md">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        <div className={`border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4 ${
          theme === 'dark' ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
        }`}>
          <p>© 2026 WearVerse Inc. All rights reserved. Crafted for creators & fashion rebels.</p>
          <div className="flex gap-6">
            <span className={`${theme === 'dark' ? 'hover:text-slate-400' : 'hover:text-slate-800'} cursor-pointer`}>Privacy Policy</span>
            <span className={`${theme === 'dark' ? 'hover:text-slate-400' : 'hover:text-slate-800'} cursor-pointer`}>Terms of Service</span>
            <span className={`${theme === 'dark' ? 'hover:text-slate-400' : 'hover:text-slate-800'} cursor-pointer`}>Sizing Guide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
