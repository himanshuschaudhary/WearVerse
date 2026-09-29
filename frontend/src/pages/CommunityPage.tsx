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
  const { designs, setCurrentPage, theme } = useApp();

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

  // Show rich catalog of community drops
  const communityDesigns = designs.length > 0 ? designs : [];

  return (
    <div className={`min-h-screen py-6 sm:py-8 space-y-8 sm:space-y-12 pb-24 transition-colors ${
      theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Community Hero Header (Theme Adaptive for 100% Readability in Light & Dark Modes) */}
        <div className={`relative rounded-3xl p-5 sm:p-12 overflow-hidden transition-all shadow-xl border ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border-indigo-500/20 shadow-2xl'
            : 'bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/80 text-slate-900 border-indigo-200/80 shadow-lg shadow-indigo-500/5'
        }`}>
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border ${
              theme === 'dark'
                ? 'bg-white/10 text-indigo-300 border-white/10'
                : 'bg-indigo-100 text-indigo-800 border-indigo-200'
            }`}>
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Open Fashion Creator Collective</span>
            </div>
            <h1 className={`text-2xl sm:text-5xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              Create, Style & Wear Community Fashion
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600 font-medium'
            }`}>
              WearVerse is where independent digital artists and streetwear enthusiasts publish generative designs. Discover authentic drops, try them on in real-time, and get premium heavy cotton apparel delivered to your door.
            </p>
            <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3">
              <button
                onClick={() => setCurrentPage('create')}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch AI Studio</span>
              </button>
              <button
                onClick={() => setCurrentPage('explore')}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs transition border ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                }`}
              >
                <span>Browse All Creations</span>
              </button>
            </div>
          </div>

          {/* Ambient glow */}
          <div className={`absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none ${
            theme === 'dark'
              ? 'bg-gradient-to-l from-indigo-500/20 to-transparent'
              : 'bg-gradient-to-l from-indigo-500/10 to-transparent'
          }`} />
        </div>

        {/* Top Creators Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Top Creators of the Month</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Ranked by verified orders & community love</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {topCreators.map((creator, idx) => (
              <div 
                key={creator.name}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  theme === 'dark'
                    ? 'bg-[#121624] border-slate-800 text-white hover:border-indigo-500/50 shadow-md'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-indigo-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative">
                    <img src={creator.avatar} alt={creator.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-950 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-xs truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{creator.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">{creator.handle}</p>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.2 rounded mt-1 inline-block">
                      {creator.badge}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs">
                  <div>
                    <span className={`font-bold text-xs sm:text-sm block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{creator.designs}</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">Drops</span>
                  </div>
                  <div>
                    <span className={`font-bold text-xs sm:text-sm block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{creator.orders}</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">Orders</span>
                  </div>
                  <div>
                    <span className={`font-bold text-xs sm:text-sm block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{creator.likes}</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">Likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Gallery: 3 per row on mobile, then next 3 below */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-rose-500" />
                <span>Community Drops</span>
              </div>
              <h2 className={`text-lg sm:text-2xl font-bold font-['Space_Grotesk'] mt-1 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Trending Community Creations
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Tap any drop to inspect details, try on, or order
            </span>
          </div>

          {/* 3 IN A ROW ON MOBILE */}
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
            {communityDesigns.map((design) => (
              <ProductCard key={design.id} design={design} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
