import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Shirt, 
  Heart, 
  ShoppingBag, 
  Camera, 
  Edit3, 
  Trash2, 
  Eye, 
  Upload,
  Lock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const ProfilePage: React.FC = () => {
  const { 
    user, 
    designs, 
    orders, 
    isLoggedIn,
    openAuthModal,
    setCurrentPage, 
    openEditProfileModal, 
    updateTryOnPhoto, 
    openEditorWithDesign,
    openTryOnModal,
    openOrderModal,
    deleteDesign 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'designs' | 'liked' | 'orders'>('designs');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0d0f17] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#141824] border border-slate-800 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white font-['Space_Grotesk']">
              Sign In to View Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Create an account or sign in to customize your creator profile, personal wardrobe, avatars, and try-on photos.
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
              onClick={() => setCurrentPage('home')}
              className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter lists
  const myCreatedDesigns = designs.filter(d => d.creator.username === user.username || d.id.startsWith('saved') || d.id.startsWith('gen'));
  const myLikedDesigns = designs.filter(d => d.isLiked);

  const handleTryOnUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateTryOnPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f17] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-[#151926] rounded-3xl border border-slate-800 shadow-xl p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-lg flex-shrink-0">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk'] leading-tight">
                    {user.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                    Creator
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-400">
                  @{user.username}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {user.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={openEditProfileModal}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <label className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-indigo-600/30 active:scale-95">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Try-On Photo</span>
                <input type="file" accept="image/*" onChange={handleTryOnUpload} className="hidden" />
              </label>
            </div>

          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {user.bio}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 max-w-md text-center sm:text-left">
            <div>
              <span className="text-xl font-black text-white font-['Space_Grotesk'] block">
                {myCreatedDesigns.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Designs</span>
            </div>

            <div>
              <span className="text-xl font-black text-white font-['Space_Grotesk'] block">
                {myLikedDesigns.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Likes</span>
            </div>

            <div>
              <span className="text-xl font-black text-white font-['Space_Grotesk'] block">
                {orders.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Orders</span>
            </div>
          </div>

        </div>

        {/* Tabs Section: My Designs, Liked, Orders */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'designs', label: `My Designs (${myCreatedDesigns.length})`, icon: Shirt },
              { id: 'liked', label: `Liked (${myLikedDesigns.length})`, icon: Heart },
              { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
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

        {/* TAB CONTENT */}
        {activeTab === 'designs' && (
          <div>
            {myCreatedDesigns.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-[#151926] rounded-3xl border border-slate-800 p-8">
                <Shirt className="w-12 h-12 text-slate-600 mx-auto" />
                <div>
                  <h3 className="text-base font-bold text-white">No custom designs saved yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Open the AI Studio to describe your first custom streetwear piece.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage('create')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95"
                >
                  Launch AI Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {myCreatedDesigns.map((d) => (
                  <div key={d.id} className="relative group">
                    <ProductCard design={d} />
                    <div className="mt-2 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => openEditorWithDesign(d)}
                        className="flex-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Refine
                      </button>
                      <button
                        onClick={() => openTryOnModal(d)}
                        className="flex-1 py-2 px-2 bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" /> Try On
                      </button>
                      <button
                        onClick={() => deleteDesign(d.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition active:scale-95"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            {myLikedDesigns.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-[#151926] rounded-3xl border border-slate-800 p-8">
                <Heart className="w-12 h-12 text-slate-600 mx-auto" />
                <div>
                  <h3 className="text-base font-bold text-white">No liked designs yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Click the heart icon on any design in the Explore feed to curate your favorites.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage('explore')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95"
                >
                  Explore Feed
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {myLikedDesigns.map((d) => (
                  <ProductCard key={d.id} design={d} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 sm:p-5 bg-[#151926] rounded-2xl border border-slate-800 flex items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <img src={ord.designImage} alt={ord.designTitle} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-slate-900 border border-slate-700/80 shadow-md flex-shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white">{ord.orderNumber} • {ord.designTitle}</span>
                    <p className="text-[11px] text-slate-400">Size: {ord.size} • Qty: {ord.quantity} • ₹{ord.totalAmount.toLocaleString()}</p>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block mt-1">
                      {ord.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage('orders')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 flex-shrink-0"
                >
                  Track Order
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  </div>
  );
};
