import React from 'react';
import { Home, Compass, Plus, ShoppingBag, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationPage } from '../types';

export const MobileNav: React.FC = () => {
  const { currentPage, setCurrentPage, theme } = useApp();

  const isHome = currentPage === 'home';
  const isExplore = currentPage === 'explore';
  const isCreate = currentPage === 'create' || currentPage === 'editor';
  const isShop = currentPage === 'shop';
  const isCommunity = currentPage === 'community' || currentPage === 'profile' || currentPage === 'my-designs';

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-3 pt-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] shadow-2xl transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-[#0c101d]/95 border-slate-800/90 text-slate-300'
        : 'bg-white/95 border-slate-200 text-slate-700 shadow-[0_-5px_20px_rgba(0,0,0,0.06)]'
    }`}>
      <div className="flex items-center justify-around relative max-w-md mx-auto">
        
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center py-0.5 px-3 transition active:scale-95 ${
            isHome
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* 2. Explore */}
        <button
          type="button"
          onClick={() => setCurrentPage('explore')}
          className={`flex flex-col items-center justify-center py-0.5 px-3 transition active:scale-95 ${
            isExplore
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Explore</span>
        </button>

        {/* 3. Floating Center Action: Create (+) */}
        <button
          type="button"
          onClick={() => setCurrentPage('create')}
          className="flex flex-col items-center justify-center -mt-6 group active:scale-90 transition-transform duration-200"
          title="Create New AI T-Shirt Design"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-xl shadow-indigo-600/40 group-hover:shadow-indigo-600/60 ring-4 ring-white dark:ring-[#0c101d] transition-all flex items-center justify-center">
            <div className="w-full h-full rounded-full flex items-center justify-center bg-indigo-600 text-white">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <span className={`text-[10px] mt-1 font-bold ${
            isCreate 
              ? 'text-indigo-600 dark:text-indigo-400' 
              : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Create
          </span>
        </button>

        {/* 4. Shop */}
        <button
          type="button"
          onClick={() => setCurrentPage('explore')}
          className={`flex flex-col items-center justify-center py-0.5 px-3 transition active:scale-95 ${
            isShop
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-1">Shop</span>
        </button>

        {/* 5. Community / Wardrobe */}
        <button
          type="button"
          onClick={() => setCurrentPage('community')}
          className={`flex flex-col items-center justify-center py-0.5 px-3 transition active:scale-95 ${
            isCommunity
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-1">Community</span>
        </button>

      </div>
    </div>
  );
};
