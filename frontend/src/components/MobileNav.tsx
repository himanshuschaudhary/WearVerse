import React from 'react';
import { Sparkles, Shirt, ShoppingBag, User, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationPage } from '../types';

export const MobileNav: React.FC = () => {
  const { currentPage, setCurrentPage, orders, isLoggedIn, openAuthModal } = useApp();

  const isStudio = currentPage === 'home' || currentPage === 'create';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#10131e]/95 backdrop-blur-xl border-t border-slate-800/90 px-2 sm:px-3 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-slate-300 shadow-2xl">
      <div className="flex items-center justify-around">
        
        {/* AI Studio */}
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 transition active:scale-95 ${
            isStudio ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">AI Studio</span>
        </button>

        {/* Explore Trending */}
        <button
          onClick={() => setCurrentPage('explore')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
            currentPage === 'explore' || currentPage === 'shop' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-5 h-5 text-rose-400" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </button>

        {/* Orders */}
        <button
          onClick={() => {
            if (!isLoggedIn) {
              openAuthModal('login');
              return;
            }
            setCurrentPage('orders');
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
            currentPage === 'orders' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {orders.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-indigo-600 text-white">
                {orders.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Orders</span>
        </button>

        {/* My Wardrobe */}
        <button
          onClick={() => {
            if (!isLoggedIn) {
              openAuthModal('login');
              return;
            }
            setCurrentPage('my-designs');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 transition-colors ${
            currentPage === 'my-designs' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shirt className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Wardrobe</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => {
            if (!isLoggedIn) {
              openAuthModal('login');
              return;
            }
            setCurrentPage('profile');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            currentPage === 'profile' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>

      </div>
    </div>
  );
};
