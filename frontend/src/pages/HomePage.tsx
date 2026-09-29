import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bell, 
  Heart, 
  MessageCircle, 
  ArrowRight, 
  Camera, 
  Palette, 
  Type, 
  Zap, 
  Sun, 
  Moon, 
  X, 
  ShoppingBag, 
  Eye, 
  CheckCircle2, 
  Flame, 
  Shirt, 
  Menu,
  Terminal,
  Code,
  Coffee,
  Plus,
  Trash2,
  RefreshCw,
  Maximize2,
  Lock,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WearVerseLogo } from '../components/WearVerseLogo';
import { Design, AIVariation, TShirtSize } from '../types';
import { aiService } from '../services/aiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  variations?: AIVariation[];
  isGenerating?: boolean;
  stepText?: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  lastThumbnail?: string;
}

const SESSIONS_STORAGE_KEY = 'wearverse_chat_sessions_v4';

export const HomePage: React.FC = () => {
  const { 
    user, 
    isLoggedIn, 
    openAuthModal, 
    setCurrentPage, 
    toggleLikeDesign, 
    openTryOnModal, 
    openOrderModal, 
    openDetailModal,
    theme, 
    toggleTheme,
    showToast,
    creditsRemaining,
    hasUnlimitedPass,
    consumeCredit,
    openUpgradeCreditsModal
  } = useApp();

  // Navigation & Drawer
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // In-Page AI Design Generation State (NO REDIRECTION — Stays on same screen!)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [activeVariations, setActiveVariations] = useState<AIVariation[]>([]);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('#0f0f11');
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('L');
  const [geminiDialogue, setGeminiDialogue] = useState<string>('');
  const [refinementInput, setRefinementInput] = useState('');
  const [inPageMessages, setInPageMessages] = useState<ChatMessage[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Sessions from localStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const studioResultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Color options for DTG t-shirt customizer
  const garmentColors = [
    { name: 'Obsidian Black', hex: '#0f0f11', border: 'border-slate-700' },
    { name: 'Washed Charcoal', hex: '#282c37', border: 'border-slate-600' },
    { name: 'Chalk White', hex: '#ffffff', border: 'border-slate-300' },
    { name: 'Midnight Navy', hex: '#1e1b4b', border: 'border-indigo-900' },
  ];

  const tshirtSizes: TShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Helper to convert variation to Design object
  const varToDesign = (v: AIVariation, colorHex?: string): Design => ({
    id: `synth-${v.id}`,
    title: v.name || 'WearVerse Bespoke Tee',
    slug: (v.name || 'bespoke-tee').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    creator: {
      id: user?.id || 'usr_creator',
      name: user?.name && user.name !== 'Guest User' ? user.name : 'WearVerse Creator',
      username: user?.username && user.username !== 'guest' ? user.username : 'creator',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isVerified: true,
    },
    description: `Custom synthesized 240 GSM heavy combed cotton streetwear tee: "${v.prompt}". Direct-to-Garment 1200 DPI vector graphic with drop-shoulder boxy drape.`,
    tags: v.tags || ['#streetwear', '#dev', '#coder', '#techwear'],
    fabric: {
      gsm: 240,
      material: '100% Combed Compact Cotton',
      fit: 'Oversized Boxy Drop-Shoulder',
      wash: 'Bio-Silicon Pre-Shrunk Wash',
    },
    colors: ['#0f0f11', '#282c37', '#ffffff', '#1e1b4b'],
    defaultColor: colorHex || selectedColor || '#0f0f11',
    price: 1499,
    originalPrice: 2299,
    rating: 4.95,
    reviewsCount: 1,
    likesCount: 1,
    viewsCount: 1,
    isLiked: false,
    isSaved: false,
    frontImage: v.mockupUrl,
    backImage: '/assets/tryon_black_back.jpg',
    graphicImage: v.graphicUrl || v.mockupUrl,
    prompt: v.prompt,
    style: 'Generative Techwear',
    category: 'Streetwear',
    isTrending: true,
    createdAt: new Date().toISOString(),
  });

  // Save sessions to storage
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // IN-PAGE GENERATION (NO REDIRECTION!)
  const handleGenerateInPage = async (customPrompt?: string) => {
    const query = (customPrompt || promptInput).trim();
    if (!query) {
      showToast('info', 'Type a streetwear idea first', 'e.g. "Git commit neon terminal boxy tee" or "LeetCode binary search tree graphic"');
      return;
    }

    // Credits guard
    if (creditsRemaining <= 0 && user?.role !== 'admin' && !hasUnlimitedPass) {
      showToast('warning', 'Generation Limit Reached (3/3)', 'You have used all 3 free generations. Refill tokens or sign in as Founder to continue.');
      openUpgradeCreditsModal();
      return;
    }

    consumeCredit();
    setIsGenerating(true);
    setGenerationStep('🧠 Analyzing developer techwear concept...');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsgId = `ai-${Date.now()}`;
    const aiLoadingMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: `Synthesizing custom 240 GSM streetwear design for "${query}"...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGenerating: true,
      stepText: '🧠 Analyzing developer concept & vector print geometry...',
    };

    const nextMessages = [...inPageMessages, userMsg, aiLoadingMsg];
    setInPageMessages(nextMessages);

    // Scroll to active generation preview smoothly
    setTimeout(() => {
      studioResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      // Parallel execution: AI Graphic Generation + Google Gemini Fashion Dialogue
      const [variations, geminiText] = await Promise.all([
        aiService.generateDesign({
          prompt: query,
          garmentColor: selectedColor || '#0f0f11',
        }, (step) => setGenerationStep(step)),
        aiService.generateFashionDialogue(query, [
          ...inPageMessages.slice(-4).map(m => ({
            role: m.sender === 'user' ? ('user' as const) : ('model' as const),
            text: m.text,
          }))
        ]).catch(err => {
          console.warn('Gemini dialogue fallback:', err);
          return `⚡ Synthesized bespoke 240 GSM streetwear design for "${query}":`;
        })
      ]);

      setActiveVariations(variations);
      setActiveVariationIndex(0);
      setGeminiDialogue(geminiText || `⚡ Synthesized bespoke 240 GSM streetwear design for "${query}":`);

      const finalizedMessages: ChatMessage[] = nextMessages.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            text: geminiText,
            isGenerating: false,
            variations,
          };
        }
        return m;
      });

      setInPageMessages(finalizedMessages);

      // Save or update session
      const sessionTitle = query.length > 32 ? query.substring(0, 30) + '...' : query;
      const lastThumb = variations[0]?.mockupUrl;

      if (!activeSessionId) {
        const newId = `sess-${Date.now()}`;
        const newSession: ChatSession = {
          id: newId,
          title: sessionTitle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: finalizedMessages,
          lastThumbnail: lastThumb,
        };
        const allSessions = [newSession, ...sessions];
        saveSessions(allSessions);
        setActiveSessionId(newId);
      } else {
        const allSessions = sessions.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: finalizedMessages,
              lastThumbnail: lastThumb || s.lastThumbnail,
            };
          }
          return s;
        });
        saveSessions(allSessions);
      }

      showToast('success', 'Design Synthesized! ⚡', 'Direct-to-Garment print preview generated on the page.');

    } catch (err) {
      console.error(err);
      setInPageMessages(prev => prev.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            text: `Finished processing "${query}".`,
            isGenerating: false,
          };
        }
        return m;
      }));
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // IN-PAGE CONVERSATIONAL REFINEMENT
  const handleRefineInPage = async () => {
    const tweak = refinementInput.trim();
    if (!tweak || isGenerating || activeVariations.length === 0) return;

    setRefinementInput('');
    setIsGenerating(true);
    setGenerationStep('Interpreting design tweak...');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: tweak,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsgId = `ai-${Date.now()}`;
    const aiLoadingMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: `Refining T-shirt design with: "${tweak}"...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGenerating: true,
      stepText: 'Regenerating graphic vectors and garment wash...',
    };

    const updated = [...inPageMessages, userMsg, aiLoadingMsg];
    setInPageMessages(updated);

    try {
      const [result, geminiCritique] = await Promise.all([
        aiService.refineDesign({
          instruction: tweak,
          currentVariations: activeVariations,
          activeVariationId: activeVariations[activeVariationIndex]?.id || '1',
          hasProPass: hasUnlimitedPass,
        }, (step) => setGenerationStep(step)),
        aiService.generateFashionDialogue(
          `Customer requested tweak: "${tweak}". Give a 1-sentence senior streetwear stylist approval.`,
          []
        ).catch(() => null)
      ]);

      if (result.updatedVariations && result.updatedVariations.length > 0) {
        setActiveVariations(result.updatedVariations);
      }

      const responseText = result.message + (geminiCritique ? `\n\n✨ Stylist Note: ${geminiCritique}` : '');
      setGeminiDialogue(responseText);

      const finalized: ChatMessage[] = updated.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            text: responseText,
            isGenerating: false,
            variations: result.updatedVariations,
          };
        }
        return m;
      });

      setInPageMessages(finalized);

      if (activeSessionId) {
        const allSessions = sessions.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: finalized,
            };
          }
          return s;
        });
        saveSessions(allSessions);
      }

      showToast('success', 'Design Refined! ✨', tweak);

    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Start fresh in-page chat
  const handleStartNewChat = () => {
    setActiveSessionId(null);
    setInPageMessages([]);
    setActiveVariations([]);
    setGeminiDialogue('');
    setPromptInput('');
    setRefinementInput('');
    setIsHistoryDrawerOpen(false);
    showToast('info', 'New Canvas Ready', 'Describe any concept to synthesize a fresh custom tee.');
    inputRef.current?.focus();
  };

  // Load past session
  const handleLoadSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setInPageMessages(session.messages);
    const lastWithVars = [...session.messages].reverse().find(m => m.variations && m.variations.length > 0);
    if (lastWithVars?.variations) {
      setActiveVariations(lastWithVars.variations);
      setActiveVariationIndex(0);
      setGeminiDialogue(lastWithVars.text);
    } else {
      setActiveVariations([]);
      setGeminiDialogue('');
    }
    setIsHistoryDrawerOpen(false);
    showToast('success', 'Chat Session Loaded', session.title);
    setTimeout(() => {
      studioResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  // Delete session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    if (activeSessionId === id) {
      handleStartNewChat();
    }
    showToast('info', 'Deleted', 'Chat session removed.');
  };

  // Curated Luxury Heavyweight Hoodies & Sweatshirts
  const hoodieAndSweatList = [
    {
      id: 'wv-hoodie-01',
      title: 'Tokyo Cyber Heavyweight Hoodie',
      badge: '450 GSM HOODIE',
      creator: { name: 'WearVerse Studio', username: 'wearverse_studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 3820,
      commentsCount: 168,
      image: '/assets/cyber_hoodie.jpg',
      price: 2499,
      tags: ['#hoodie', '#cyberpunk', '#heavyweight', '#450gsm'],
      garmentType: 'Hoodie',
    },
    {
      id: 'wv-hoodie-02',
      title: 'Neo-Tokyo Rebel Cyber Hoodie',
      badge: '450 GSM HOODIE',
      creator: { name: 'WearVerse Studio', username: 'wearverse_studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 3240,
      commentsCount: 142,
      image: '/assets/tokyo_rebel_hoodie.jpg',
      price: 2599,
      tags: ['#hoodie', '#neotokyo', '#anime', '#kanji'],
      garmentType: 'Hoodie',
    },
    {
      id: 'wv-sweat-01',
      title: 'Celestial Sun French Terry Sweatshirt',
      badge: '380 GSM SWEATSHIRT',
      creator: { name: 'WearVerse Studio', username: 'wearverse_studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 2460,
      commentsCount: 118,
      image: '/assets/celestial_sweatshirt.jpg',
      price: 2199,
      tags: ['#sweatshirt', '#frenchterry', '#minimal', '#380gsm'],
      garmentType: 'Sweatshirt',
    },
    {
      id: 'wv-sweat-02',
      title: 'Urban Zen Botanical Crewneck',
      badge: '380 GSM SWEATSHIRT',
      creator: { name: 'Yuki Morita', username: 'yukimorita', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
      likesCount: 1980,
      commentsCount: 94,
      image: '/assets/urban_zen_sweatshirt.jpg',
      price: 2199,
      tags: ['#sweatshirt', '#botanical', '#zen', '#charcoal'],
      garmentType: 'Sweatshirt',
    },
  ];

  // Curated Luxury Streetwear Graphic Tees (240 GSM)
  const trendingList = [
    {
      id: 'wv-tee-01',
      title: 'Mecha Ronin Streetwear Tee',
      badge: '240 GSM TEE',
      creator: { name: 'WearVerse Studio', username: 'wearverse_studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 3950,
      commentsCount: 184,
      image: '/assets/cyber_samurai_tee.jpg',
      price: 1599,
      category: '🛹 Streetwear',
      garmentType: 'T-Shirt',
    },
    {
      id: 'wv-tee-02',
      title: 'Dragon Legacy Graphic Tee',
      badge: '240 GSM TEE',
      creator: { name: 'WearVerse Studio', username: 'wearverse_studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 1890,
      commentsCount: 142,
      image: '/assets/dragon_legacy.jpg',
      price: 1499,
      category: '🛹 Streetwear',
      garmentType: 'T-Shirt',
    },
    {
      id: 'wv-tee-03',
      title: 'Tokyo Drift Midnight Racer',
      badge: '240 GSM TEE',
      creator: { name: 'WearVerse Studio', username: 'wearverse_studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 1650,
      commentsCount: 98,
      image: '/assets/tokyo_drift.jpg',
      price: 1549,
      category: '🐉 Anime & Kanji',
      garmentType: 'T-Shirt',
    },
    {
      id: 'wv-tee-04',
      title: 'Speed Demon Turbo Racing',
      badge: '240 GSM TEE',
      creator: { name: 'WearVerse Studio', username: 'wearverse_studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 2100,
      commentsCount: 138,
      image: '/assets/speed_demon.jpg',
      price: 1499,
      category: '🛹 Streetwear',
      garmentType: 'T-Shirt',
    },
    {
      id: 'wv-tee-05',
      title: 'Blood Moon Sakura Ronin',
      badge: '240 GSM TEE',
      creator: { name: 'WearVerse Studio', username: 'wearverse_studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      likesCount: 3120,
      commentsCount: 172,
      image: '/assets/sakura_ronin.jpg',
      price: 1599,
      category: '🐉 Anime & Kanji',
      garmentType: 'T-Shirt',
    },
    {
      id: 'wv-tee-06',
      title: 'Kanagawa Minimal Wave',
      badge: '220 GSM TEE',
      creator: { name: 'Yuki Morita', username: 'yukimorita', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
      likesCount: 1580,
      commentsCount: 104,
      image: '/assets/minimal_wave.jpg',
      price: 1399,
      category: '⛰️ Minimalist',
      garmentType: 'T-Shirt',
    },
  ];

  // Active variation currently shown
  const activeVar = activeVariations[activeVariationIndex] || null;

  return (
    <div className={`min-h-screen pb-28 md:pb-16 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>

      {/* 1. TOP HEADER: HAMBURGER ON TOP LEFT, BEST GOOD LOOKING LOGO, NO SEARCH ICON */}
      <header className={`sticky top-0 z-40 px-3 sm:px-6 py-3 backdrop-blur-xl border-b transition-colors ${
        theme === 'dark' 
          ? 'bg-[#07090e]/92 border-slate-800/80 text-white shadow-xl shadow-black/40' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm shadow-slate-200/50'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* LEFT: HAMBURGER MENU (Chat History) + BEST GOOD LOOKING LOGO */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsHistoryDrawerOpen(true)}
              className={`p-2 rounded-2xl border transition-all active:scale-90 flex items-center gap-1.5 shadow-sm ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:text-white hover:border-indigo-400'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-200'
              }`}
              title="Open Chat History (Past Design Sessions)"
              aria-label="Open Chat History"
            >
              <Menu className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-bold hidden sm:inline">Chats</span>
              {sessions.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse hidden sm:inline" />
              )}
            </button>

            {/* Elevated WearVerse Logo */}
            <div 
              onClick={() => {
                setActiveSessionId(null);
                setInPageMessages([]);
                setActiveVariations([]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <WearVerseLogo size="md" showStudioBadge={true} />
            </div>
          </div>

          {/* CENTER: DESKTOP PILLS (Explore, Wardrobe) */}
          <nav className={`hidden md:flex items-center gap-1.5 p-1 rounded-2xl border transition-colors ${
            theme === 'dark' ? 'bg-[#121622]/80 border-slate-800/80' : 'bg-slate-100/90 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => inputRef.current?.focus()}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Synthesize Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('explore')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Explore Grails</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  openAuthModal('login');
                  return;
                }
                setCurrentPage('my-designs');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-slate-400" />
              <span>Wardrobe</span>
            </button>
          </nav>

          {/* RIGHT HEADER ICONS: THEME TOGGLE, NOTIFICATIONS, USER AVATAR (NO SEARCH ICON!) */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition active:scale-90 shadow-sm ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700/80 text-amber-300 hover:bg-slate-850'
                  : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
              }`}
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => {
                showToast('info', '🔥 Coder Drop Alert', 'Git Commit --force 240 GSM Boxy Tee is live with DTG glow print!');
              }}
              className={`relative p-2 rounded-xl border transition active:scale-90 shadow-sm ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* User Profile Avatar / Sign In */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setCurrentPage('profile')}
                className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-500/50 active:scale-95 transition"
                title="View Profile & Orders"
              >
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 !text-white text-white-force text-xs font-bold shadow-md shadow-indigo-600/30 active:scale-95 transition"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. CHAT HISTORY SLIDING DRAWER (ACCESSED VIA TOP-LEFT HAMBURGER) */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsHistoryDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Drawer Sidebar */}
          <div className={`relative z-10 w-80 max-w-[85vw] h-full flex flex-col border-r shadow-2xl transition-colors duration-200 animate-in slide-in-from-left duration-250 ${
            theme === 'dark' ? 'bg-[#0c101d] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Drawer Top Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <WearVerseLogo size="sm" showStudioBadge={false} />
                <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-500">History</span>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* New Design Chat Button */}
            <div className="p-3">
              <button
                type="button"
                onClick={handleStartNewChat}
                className="w-full py-2.5 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>New T-Shirt Design</span>
              </button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-none">
              <p className={`text-[10px] font-bold uppercase tracking-wider px-2 pb-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-700'
              }`}>
                Recent Design Chats ({sessions.length})
              </p>

              {sessions.length === 0 ? (
                <div className="py-12 text-center text-xs space-y-2 text-slate-400">
                  <Terminal className="w-7 h-7 mx-auto opacity-40 text-indigo-400" />
                  <p className="font-semibold">No design sessions yet.</p>
                  <p className="text-[11px] max-w-[200px] mx-auto text-slate-400">Type any prompt on the home screen to synthesize your first T-shirt!</p>
                </div>
              ) : (
                sessions.map((sess) => {
                  const isCurrent = activeSessionId === sess.id;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => handleLoadSession(sess)}
                      className={`group w-full p-2.5 rounded-2xl cursor-pointer transition flex items-center gap-2.5 border ${
                        isCurrent 
                          ? (theme === 'dark' ? 'bg-[#181f33] text-white border-indigo-500/60 shadow-md' : 'bg-indigo-50 text-indigo-950 border-indigo-300 shadow-sm')
                          : (theme === 'dark' ? 'bg-[#101424]/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80' : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100')
                      }`}
                    >
                      {sess.lastThumbnail ? (
                        <img 
                          src={sess.lastThumbnail} 
                          alt="Thumbnail" 
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-indigo-500/30"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                          <Shirt className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-bold truncate">{sess.title}</p>
                        <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {new Date(sess.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        title="Delete chat"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer Quota Pill */}
            <div className={`p-3 border-t text-[11px] flex items-center justify-between ${
              theme === 'dark' ? 'border-slate-800 bg-[#080b14]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold">
                  {user?.role === 'admin' || hasUnlimitedPass ? '👑 Unlimited AI' : `${creditsRemaining} / 3 Free Left`}
                </span>
              </div>
              <button
                type="button"
                onClick={openUpgradeCreditsModal}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Refill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN HOMEPAGE CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 pt-4 sm:pt-6 space-y-6">

        {/* HERO SECTION: TARGETED AT GEN-Z, CODERS, DEVELOPERS, COLLEGE STUDENTS */}
        <div className={`relative rounded-3xl overflow-hidden p-6 sm:p-8 border shadow-xl transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#121626] via-[#0d101c] to-[#07090e] border-indigo-500/30'
            : 'bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/60 border-indigo-100 shadow-indigo-100/50'
        }`}>
          {/* Fashion Model Background Graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 pointer-events-none opacity-40 sm:opacity-90 overflow-hidden flex items-center justify-end">
            <img 
              src="/assets/hero_model.jpg" 
              alt="Fashion Model wearing graphic streetwear" 
              className="h-full w-full object-cover object-center mask-radial-hero transform scale-105"
            />
            <div className={`absolute inset-0 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-[#121626] via-[#121626]/60 to-transparent' 
                : 'bg-gradient-to-r from-white via-white/70 to-transparent'
            }`} />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-lg space-y-3">
            {/* Headline */}
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              Turn Your Ideas Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Wearable Art
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Curated luxury streetwear synthesized with generative AI. Design bespoke boxy tees, heavyweight hoodies, and French terry sweatshirts.
            </p>
          </div>
        </div>

        {/* EMBEDDED IN-PAGE AI PROMPT COMPOSER CARD (NO REDIRECTION!) */}
        <div className={`p-3.5 sm:p-4 rounded-3xl border shadow-xl transition-colors ${
          theme === 'dark'
            ? 'bg-[#121626]/95 border-indigo-500/30 shadow-indigo-500/5'
            : 'bg-white border-slate-200/90 shadow-lg shadow-indigo-100/40'
        }`}>
          {/* Main Input Row */}
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              theme === 'dark' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerateInPage();
                }
              }}
              placeholder="Describe your streetwear idea... e.g. An oversized boxy tee with cyberpunk mecha dragon"
              className={`flex-1 text-xs sm:text-sm bg-transparent outline-none placeholder:text-slate-400 leading-normal ${
                theme === 'dark' ? 'text-white' : 'text-slate-900 font-medium'
              }`}
            />

            {/* Vibrant Circular Send Button */}
            <button
              type="button"
              onClick={() => handleGenerateInPage()}
              disabled={isGenerating || !promptInput.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 !text-white text-white-force flex items-center justify-center shadow-lg shadow-indigo-600/40 transition active:scale-90 flex-shrink-0 disabled:opacity-40"
              title="Synthesize In-Page"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin !text-white text-white-force" />
              ) : (
                <Send className="w-4 h-4 !text-white text-white-force ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* 4. ACTIVE IN-PAGE AI GENERATION STREAM (STAYS ON SAME SCREEN!) */}
        <div ref={studioResultRef}>
          {/* Active Generation Progress Visualizer */}
          {isGenerating && (
            <div className={`p-5 rounded-3xl border space-y-3.5 shadow-xl backdrop-blur-md animate-in fade-in duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border-indigo-500/40 text-slate-100'
                : 'bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-white border-indigo-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <Sparkles className="w-2.5 h-2.5 text-indigo-500 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold tracking-wide">
                    WearVerse Neural DTG Studio
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                  theme === 'dark' ? 'text-indigo-300 bg-indigo-900/60 border-indigo-500/30' : 'text-indigo-700 bg-indigo-100 border-indigo-300'
                }`}>
                  Flux Diffusion Active
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-500 dark:text-indigo-300">
                    {generationStep || 'Synthesizing live streetwear graphic...'}
                  </span>
                  <span className="text-indigo-500 font-bold text-[10px] animate-pulse">Live</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse w-full rounded-full transition-all duration-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                <div className={`p-2 rounded-xl border text-center ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <span className="font-bold block text-indigo-500">1200 DPI</span>
                  <span>Vector DTG</span>
                </div>
                <div className={`p-2 rounded-xl border text-center ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <span className="font-bold block text-indigo-500">240 GSM</span>
                  <span>Combed Cotton</span>
                </div>
                <div className={`p-2 rounded-xl border text-center ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <span className="font-bold block text-indigo-500">Boxy Fit</span>
                  <span>Drop Shoulder</span>
                </div>
              </div>
            </div>
          )}

          {/* Synthesized Design Result Card (Rendered directly in-page!) */}
          {activeVar && (
            <div className={`p-5 sm:p-6 rounded-3xl border shadow-2xl space-y-5 transition-all animate-in fade-in duration-300 ${
              theme === 'dark' 
                ? 'bg-[#121626] border-indigo-500/40 shadow-indigo-600/10' 
                : 'bg-white border-indigo-200 shadow-xl shadow-indigo-100/50'
            }`}>
              
              {/* Stylist & Gemini Dialogue Header */}
              {geminiDialogue && (
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                  theme === 'dark'
                    ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-indigo-500 dark:text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>WearVerse AI Senior Fashion Director</span>
                  </div>
                  <p className="whitespace-pre-line text-xs font-medium">{geminiDialogue}</p>
                </div>
              )}

              {/* Main Product Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                {/* Left: High-Res T-Shirt Mockup */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/40 shadow-xl group aspect-square flex items-center justify-center bg-black/30">
                  <img 
                    src={activeVar.mockupUrl} 
                    alt={activeVar.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                    onClick={() => setLightboxImg(activeVar.mockupUrl)}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                    240 GSM HEAVY COTTON
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxImg(activeVar.mockupUrl)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white hover:text-indigo-400 transition"
                    title="Inspect High-Res"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Specifications & Direct Buy / Try-On Controls */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      GENERATED ATELIER DROP
                    </span>
                    <h2 className={`text-xl sm:text-2xl font-black font-['Space_Grotesk'] mt-1 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-950'
                    }`}>
                      {activeVar.name}
                    </h2>
                    <p className={`text-xs mt-1 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {activeVar.prompt}
                    </p>
                  </div>

                  {/* Pricing Badge */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-indigo-500">
                      ₹1,499
                    </span>
                    <span className={`text-xs line-through ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      ₹2,299
                    </span>
                    <span className="text-xs font-bold text-emerald-500">
                      Free Express Delivery
                    </span>
                  </div>

                  {/* Garment Color Selector */}
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold flex items-center justify-between ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <span>Garment Color</span>
                      <span className="text-[11px] text-indigo-500 font-semibold">
                        {garmentColors.find(c => c.hex === selectedColor)?.name}
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      {garmentColors.map(c => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setSelectedColor(c.hex)}
                          className={`w-7 h-7 rounded-full border-2 transition-all active:scale-90 ${
                            selectedColor === c.hex ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'opacity-80'
                          } ${c.border}`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Select Boxy Fit Size
                    </label>
                    <div className="flex items-center gap-2">
                      {tshirtSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 border ${
                            selectedSize === size
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                              : theme === 'dark'
                                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                                : 'bg-slate-100 border-slate-300 text-slate-800 hover:text-slate-950'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direct Action Buttons: Try On Me & Order & Pay */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => openTryOnModal(varToDesign(activeVar, selectedColor))}
                      className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 border shadow-sm ${
                        theme === 'dark'
                          ? 'bg-slate-800/90 hover:bg-slate-750 text-slate-100 border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-indigo-400" />
                      <span>Try On Me</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openOrderModal(varToDesign(activeVar, selectedColor), selectedColor, selectedSize)}
                      className="py-3 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-xl shadow-indigo-600/40 active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order & Pay ₹1,499</span>
                    </button>
                  </div>

                  {/* In-Place Conversational Refinement Input */}
                  <div className={`p-2.5 rounded-2xl border flex items-center gap-2 ${
                    theme === 'dark' ? 'bg-[#0a0d18] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={refinementInput}
                      onChange={(e) => setRefinementInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleRefineInPage();
                        }
                      }}
                      placeholder="Refine this tee ('make it cyber matrix', 'smaller chest print')..."
                      className={`flex-1 text-xs bg-transparent outline-none ${
                        theme === 'dark' ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400 font-medium'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleRefineInPage}
                      disabled={isGenerating || !refinementInput.trim()}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-95 disabled:opacity-40"
                    >
                      Refine
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* 6. SECTION 1: HEAVYWEIGHT HOODIES & FRENCH TERRY SWEATSHIRTS */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className={`text-lg sm:text-xl font-extrabold font-['Space_Grotesk'] ${
                theme === 'dark' ? 'text-white' : 'text-slate-950'
              }`}>
                Heavyweight Hoodies & Sweatshirts
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage('explore')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Scrolling Hoodies & Sweatshirts Carousel */}
          <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {hoodieAndSweatList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setPromptInput(item.title);
                  handleGenerateInPage(item.title);
                }}
                className={`w-64 sm:w-72 flex-shrink-0 rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer group ${
                  theme === 'dark'
                    ? 'bg-[#121624] border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/10'
                    : 'bg-white border-slate-200 hover:border-indigo-500 shadow-md hover:shadow-indigo-100'
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                    {item.badge}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeDesign(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/60 text-white hover:text-rose-500 transition"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 space-y-2">
                  <div>
                    <h3 className={`font-bold text-sm truncate ${
                      theme === 'dark' ? 'text-white' : 'text-slate-950'
                    }`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span>@{item.creator.username}</span>
                      <span>•</span>
                      <span>{item.likesCount.toLocaleString()} likes</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/40">
                    <span className="font-black text-indigo-500 text-sm">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPromptInput(item.title);
                        handleGenerateInPage(item.title);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition shadow-sm"
                    >
                      Remix in AI
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. SECTION 2: CURATED GRAPHIC TEES */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
              <h2 className={`text-lg sm:text-xl font-extrabold font-['Space_Grotesk'] ${
                theme === 'dark' ? 'text-white' : 'text-slate-950'
              }`}>
                Curated Luxury Graphic Tees (240 GSM)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage('explore')}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Scrolling Card Carousel */}
          <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {trendingList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setPromptInput(item.title);
                  handleGenerateInPage(item.title);
                }}
                className={`w-60 sm:w-64 flex-shrink-0 rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group ${
                  theme === 'dark'
                    ? 'bg-[#121624] border-slate-800 hover:border-indigo-500/50'
                    : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-violet-500/40 text-violet-300 text-[10px] font-black uppercase tracking-wider">
                    {item.badge}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeDesign(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-700/60 text-white hover:text-rose-500 transition"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 space-y-1">
                  <h3 className={`font-bold text-xs sm:text-sm truncate ${
                    theme === 'dark' ? 'text-white' : 'text-slate-950'
                  }`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                      @{item.creator.username}
                    </span>
                    <span className="font-extrabold text-indigo-500">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 8. LIGHTBOX MODAL */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/60 text-white hover:text-rose-400 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImg} alt="High resolution preview" className="w-full h-auto object-cover max-h-[80vh]" />
          </div>
        </div>
      )}

    </div>
  );
};
