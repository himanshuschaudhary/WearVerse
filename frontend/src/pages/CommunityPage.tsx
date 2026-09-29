import React from 'react';
import { 
  Users, 
  Sparkles, 
  Flame, 
  Award, 
  ArrowRight,
  TrendingUp,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const CommunityPage: React.FC = () => {
  const { designs, setCurrentPage } = useApp();

  const topCreators = [
    {
      name: 'Aryan Designs',
      handle: '@aryandesigns',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      designs: 34,
      orders: 820,
      likes: 12400,
      badge: '#1 Trending',
    },
    {
      name: 'Devika Sharma',
      handle: '@devikastyle',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      designs: 28,
      orders: 610,
      likes: 9800,
      badge: 'Heritage Innovator',
    },
    {
      name: 'Kenji Takahashi',
      handle: '@kenjiofficial',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      designs: 19,
      orders: 440,
      likes: 7200,
      badge: 'JDM Aesthetics',
    },
    {
      name: 'Elena Rostova',
      handle: '@elena_berlin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      designs: 14,
      orders: 310,
      likes: 4120,
      badge: 'Techno Minimalist',
    },
  ];

  const communityDesigns = designs.filter(d => d.isCommunity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      
      {/* Community Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-12 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Fashion Creator Collective</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight">
            Create, Style & Wear Community Fashion
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            WearVerse is where independent digital artists and streetwear enthusiasts publish generative designs. Discover authentic drops, try them on in real-time, and get premium heavy cotton apparel delivered to your door.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentPage('create')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Studio</span>
            </button>
            <button
              onClick={() => setCurrentPage('explore')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm border border-white/10 transition"
            >
              <span>Browse All Creations</span>
            </button>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Top Creators Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Top Creators of the Month</span>
          </div>
          <span className="text-xs text-slate-400">Ranked by verified orders & community love</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCreators.map((creator, idx) => (
            <div 
              key={creator.name}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">{creator.name}</p>
                  <p className="text-[11px] text-indigo-600 font-medium truncate">{creator.handle}</p>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                    {creator.badge}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{creator.designs}</span>
                  <span className="text-[10px] text-slate-400">Drops</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{creator.orders}</span>
                  <span className="text-[10px] text-slate-400">Orders</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{creator.likes}</span>
                  <span className="text-[10px] text-slate-400">Likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Gallery */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-rose-500" />
              <span>Community Drops</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk'] mt-1">
              Trending Community Creations
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Tap any drop to inspect details, try on, or order
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityDesigns.map((design) => (
            <ProductCard key={design.id} design={design} />
          ))}
        </div>
      </div>

    </div>
  );
};
