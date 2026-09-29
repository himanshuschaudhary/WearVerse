import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Camera, 
  ShoppingBag, 
  Eye, 
  RefreshCw, 
  X, 
  Flame, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Maximize2, 
  Menu, 
  Shirt, 
  ChevronDown, 
  Layers, 
  Zap, 
  LogOut, 
  LogIn, 
  RotateCcw, 
  ShieldCheck, 
  Dices, 
  Sliders, 
  Download,
  Tag,
  Truck,
  Lock,
  Sun,
  Moon,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Design, AIVariation } from '../types';
import { aiService, getFallbackImage, enhancePromptWithAI } from '../services/aiService';
import { isEditRequest } from '../services/promptMatchingEngine';
import { generateCanvasComposite } from '../services/tryOnCanvasService';
import { WearVerseLogo } from './WearVerseLogo';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  userPhotoUrl?: string;
  variations?: AIVariation[];
  isGenerating?: boolean;
  stepText?: string;
  isUpgradePrompt?: boolean;
  requestedTweak?: string;
  
  // In-Chat Virtual Try-On Result
  isTryOnResult?: boolean;
  tryOnResultUrl?: string;
  tryOnOriginalPhotoUrl?: string;
  tryOnDesign?: Design | AIVariation;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  lastThumbnail?: string;
}

const AESTHETIC_PRESETS = [
  { label: '🎲 Surprise Me', prompt: 'RANDOM', isSpecial: true },
  { label: '🐅 Cyber Tiger', prompt: 'Futuristic neo-tokyo cyberpunk robotic tiger with bioluminescent neon highlights on pitch black tee' },
  { label: '🏎️ Speed Demon', prompt: 'Speed Demon 1982 vintage racing club drift sports car with neon smoke on acid wash charcoal tee' },
  { label: '⚔️ Sakura Ronin', prompt: 'Blood Moon Sakura Ronin Japanese sumi-e ink brush samurai under falling cherry blossoms on charcoal tee' },
  { label: '🍻 Beer Evolution', prompt: 'Monday to Friday human evolution silhouette diving into a mug of cold frothy beer on a black t-shirt' },
  { label: '🚀 Need My Space', prompt: 'Cute white line art astronaut floating in space holding a steaming coffee cup with planets and bold text Need My Space on black tee' },
  { label: '🌀 Cosmic Portal', prompt: 'Lone traveler silhouette standing before a massive glowing cosmic portal and multidimensional event horizon with light rays on black t-shirt' },
  { label: '🏛️ Vintage Old Money', prompt: 'Retro acid-wash heavy boxy streetwear tee with renaissance classical statue glitch art' },
  { label: '⛰️ Minimalist Nature', prompt: 'Minimalist geometric alpine mountain peaks with pine forest line art on washed olive tee' },
  { label: '🏍️ 70s Biker Heritage', prompt: 'Vintage 70s cafe racer motorcycle with weathered typography and eagle wings on washed black tee' }
];

const SURPRISE_PROMPTS = [
  "Futuristic neo-tokyo cyberpunk robotic tiger with bioluminescent neon highlights on pitch black tee",
  "Speed Demon 1982 vintage racing club drift sports car with neon smoke on acid wash charcoal tee",
  "Blood Moon Sakura Ronin Japanese sumi-e ink brush samurai under falling cherry blossoms on charcoal tee",
  "Monday to Friday human evolution silhouette diving into a mug of cold frothy beer on a black t-shirt",
  "Cute white line art astronaut floating in space holding a steaming coffee cup with planets and bold text Need My Space on black tee",
  "Lone traveler silhouette standing before a massive glowing cosmic portal and multidimensional event horizon with light rays on black t-shirt",
  "Oversized black streetwear tee with glowing cyber dragon and red kanji typography",
  "90s retro Tokyo drift sports car with neon smoke and vintage japanese tuning typography",
  "Sumi-e ink brush samurai warrior with dual katana and cherry blossoms on charcoal tee",
  "Minimalist geometric alpine mountain peaks with pine forest line art on washed olive tee",
  "Vintage 70s cafe racer motorcycle with weathered typography and eagle wings on washed black tee",
  "Retro acid-wash heavy boxy streetwear tee with renaissance classical statue glitch art"
];

const HERO_ANIMATION_TEXT = "Type any graphic idea or streetwear aesthetic. Synthesize bespoke 240 GSM heavy cotton tees with direct-to-garment print realism and instant virtual try-on.";

const HERO_SEGMENTS_DARK = [
  { text: "Type any graphic idea or streetwear aesthetic. ", className: "text-white font-semibold drop-shadow-sm" },
  { text: "Synthesize bespoke ", className: "text-slate-200 font-normal" },
  { text: "240 GSM heavy cotton", className: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-200 font-bold drop-shadow-sm" },
  { text: " tees with ", className: "text-slate-200 font-normal" },
  { text: "direct-to-garment print realism", className: "text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-200 font-bold drop-shadow-sm" },
  { text: " and ", className: "text-slate-200 font-normal" },
  { text: "instant virtual try-on.", className: "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-pink-300 to-amber-200 font-bold drop-shadow-sm" }
];

const HERO_SEGMENTS_LIGHT = [
  { text: "Type any graphic idea or streetwear aesthetic. ", className: "text-slate-950 font-bold" },
  { text: "Synthesize bespoke ", className: "text-slate-700 font-medium" },
  { text: "240 GSM heavy cotton", className: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 font-extrabold" },
  { text: " tees with ", className: "text-slate-700 font-medium" },
  { text: "direct-to-garment print realism", className: "text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-purple-700 to-pink-600 font-extrabold" },
  { text: " and ", className: "text-slate-700 font-medium" },
  { text: "instant virtual try-on.", className: "text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 font-extrabold" }
];

// Sub-component for individual T-shirt Card with resilient image loading
interface VariationCardProps {
  variation: AIVariation;
  index: number;
  onTryOn: () => void;
  onOrder: () => void;
  onZoom: (url: string) => void;
  onRefine: () => void;
  theme?: 'dark' | 'light';
}

const VariationCard: React.FC<VariationCardProps> = ({ 
  variation, 
  index, 
  onTryOn, 
  onOrder, 
  onZoom, 
  onRefine,
  theme = 'light' 
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(variation.mockupUrl);

  useEffect(() => {
    setImgSrc(variation.mockupUrl);
    setImgLoaded(false);
  }, [variation.mockupUrl]);

  const handleImgError = () => {
    const fallback = getFallbackImage(index);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <div className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 group shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#151928] border-slate-800 hover:border-indigo-500/60 shadow-indigo-950/20' 
        : 'bg-white border-slate-200 hover:border-indigo-400 shadow-slate-200/60 hover:shadow-xl'
    }`}>
      {/* T-Shirt Mockup Image Container */}
      <div className={`relative aspect-square w-full overflow-hidden ${theme === 'dark' ? 'bg-[#0a0d14]' : 'bg-slate-100'}`}>
        {!imgLoaded && (
          <div className={`absolute inset-0 animate-pulse flex flex-col items-center justify-center gap-2 z-10 ${
            theme === 'dark' ? 'bg-[#0a0d14]/90' : 'bg-slate-100/90'
          }`}>
            <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-[10px] text-slate-400 font-medium">Generating T-Shirt...</span>
          </div>
        )}

        <img 
          src={imgSrc} 
          alt={variation.name} 
          onLoad={() => setImgLoaded(true)}
          onError={handleImgError}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fit Badge */}
        <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700/50 shadow-sm z-20">
          {variation.fit || '240 GSM Oversized'}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md text-emerald-400 text-[11px] font-black px-2 py-0.5 rounded-md border border-slate-700/50 shadow-sm flex items-center gap-1 z-20">
          <Tag className="w-3 h-3 text-emerald-400" />
          <span>₹1,499</span>
          <span className="text-[9px] line-through text-slate-500 font-normal">₹2,299</span>
        </div>

        {/* Zoom Lightbox Trigger */}
        <button
          type="button"
          onClick={() => onZoom(imgSrc)}
          title="Inspect high-res print"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-slate-300 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info & Direct Actions */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{variation.name}</p>
          <p className={`text-[11px] line-clamp-1 mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{variation.prompt}</p>
        </div>

        {/* Action Buttons: Try On Me (In-Chat!) & Order & Pay */}
        <div className={`grid grid-cols-2 gap-2 pt-1 border-t ${theme === 'dark' ? 'border-slate-800/80' : 'border-slate-100'}`}>
          <button
            type="button"
            onClick={onTryOn}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 border ${
              theme === 'dark' 
                ? 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700/60 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Try On Me</span>
          </button>

          <button
            type="button"
            onClick={onOrder}
            className="py-2 px-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md active:scale-95 shadow-indigo-600/30"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order & Pay</span>
          </button>
        </div>

        {/* Refine / Edit in Chat */}
        <button
          type="button"
          onClick={onRefine}
          className={`w-full py-1.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition border rounded-xl ${
            theme === 'dark'
              ? 'border-indigo-500/20 bg-indigo-950/30 text-indigo-300 hover:text-white hover:bg-indigo-900/50'
              : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:text-indigo-950 hover:bg-indigo-100'
          }`}
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Refine & Edit in Chat</span>
        </button>
      </div>
    </div>
  );
};

// In-Chat Try-On Result Card
interface TryOnBubbleProps {
  msg: ChatMessage;
  onOrder: (design: Design, color?: string) => void;
  onZoom: (url: string) => void;
  onRefinePrompt: (text: string) => void;
  varToDesign: (v: AIVariation) => Design;
  theme?: 'dark' | 'light';
}

const TryOnBubble: React.FC<TryOnBubbleProps> = ({ 
  msg, 
  onOrder, 
  onZoom, 
  onRefinePrompt,
  varToDesign,
  theme = 'light'
}) => {
  const [activeTab, setActiveTab] = useState<'tryon' | 'original'>('tryon');
  const resultUrl = msg.tryOnResultUrl || '';
  const originalUrl = msg.tryOnOriginalPhotoUrl || '';
  const currentImg = activeTab === 'tryon' ? resultUrl : originalUrl;
  const design = msg.tryOnDesign;

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `wearverse-tryon-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDesignObj = (): Design | null => {
    if (!design) return null;
    if ('slug' in design) return design as Design;
    return varToDesign(design as AIVariation);
  };

  const designObj = getDesignObj();
  const designTitle = design ? ('title' in design ? design.title : design.name) : 'Custom T-Shirt';

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden p-3 sm:p-4 space-y-3.5 max-w-lg w-full transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-[#121626] border-indigo-500/40 text-slate-100 shadow-2xl'
        : 'bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50'
    }`}>
      {/* Top Header & View Toggle */}
      <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 ${
        theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-400' : 'bg-indigo-50 border border-indigo-200 text-indigo-600'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className={`text-xs font-bold truncate max-w-[200px] sm:max-w-xs ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>{designTitle}</h4>
            <span className={`text-[10px] font-mono ${
              theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
            }`}>Photorealistic 240 GSM Drape</span>
          </div>
        </div>

        {/* View Switcher: Try-On vs Original Photo */}
        {originalUrl && (
          <div className={`flex items-center rounded-xl p-0.5 border text-[11px] font-semibold ${
            theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setActiveTab('tryon')}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeTab === 'tryon' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✨ Try-On
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('original')}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeTab === 'original' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📷 Original
            </button>
          </div>
        )}
      </div>

      {/* Main Image Display */}
      <div className={`relative aspect-[3/4] sm:aspect-square w-full rounded-2xl overflow-hidden border group ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <img
          src={currentImg || resultUrl}
          alt={designTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          <span className="bg-slate-950/85 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700/60 shadow-sm">
            {design && 'fabric' in design ? (design.fabric?.fit || '240 GSM Oversized') : '240 GSM Heavy Cotton'}
          </span>
          <span className="bg-emerald-950/85 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/40 shadow-sm">
            DTG 1200 DPI Realistic Print
          </span>
        </div>

        {/* Inspect Fullscreen Button */}
        {currentImg && (
          <button
            type="button"
            onClick={() => onZoom(currentImg)}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-slate-300 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Inspect high-res"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Primary Actions Directly in Chat */}
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Order & Pay */}
          <button
            type="button"
            onClick={() => {
              if (designObj) {
                onOrder(designObj, designObj.defaultColor);
              }
            }}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order (₹1,499)</span>
          </button>

          {/* Download Lookbook */}
          <button
            type="button"
            onClick={handleDownload}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 border ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Save Lookbook</span>
          </button>
        </div>

        {/* Refine / Edit Suggestions in Chat */}
        <button
          type="button"
          onClick={() => onRefinePrompt("Make this design in black with smaller back print")}
          className={`w-full py-1.5 text-[11px] font-medium flex items-center justify-center gap-1.5 transition rounded-xl border ${
            theme === 'dark'
              ? 'text-indigo-300 hover:text-white bg-indigo-950/30 hover:bg-indigo-900/50 border-indigo-500/20'
              : 'text-indigo-700 hover:text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-200/70'
          }`}
        >
          <Sliders className="w-3 h-3 text-indigo-500" />
          <span>Refine Fit, Garment Color or Print Size in Chat</span>
        </button>
      </div>
    </div>
  );
};

export const ChatbotStudio: React.FC = () => {
  const { 
    user, 
    isLoggedIn,
    logout,
    orders, 
    openOrderModal, 
    openEditProfileModal,
    openUpgradeCreditsModal,
    openAdminOrdersModal,
    openAuthModal,
    updateTryOnPhoto,
    setCurrentPage,
    creditsRemaining,
    hasUnlimitedPass,
    consumeCredit,
    resetCredits,
    showToast,
    theme,
    toggleTheme 
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ChatGPT-style composer photo attachment
  const [attachedPhoto, setAttachedPhoto] = useState<{ dataUrl: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Design Context for follow-up conversational edits and Try-On (Requirement 7)
  const [activeDesignContext, setActiveDesignContext] = useState<Design | AIVariation | null>(null);
  const [pendingTryOnVariation, setPendingTryOnVariation] = useState<AIVariation | null>(null);

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K or / to focus prompt, Esc to dismiss)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (
        e.key === '/' && 
        document.activeElement !== inputRef.current && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (attachedPhoto) {
          setAttachedPhoto(null);
        } else if (document.activeElement === inputRef.current) {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [attachedPhoto]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persistent Chat Sessions in localStorage
  const SESSIONS_STORAGE_KEY = 'wearverse_chat_sessions_v4';

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    setShowScrollDown(distanceToBottom > 120);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // World-class animated hero statement with high-clarity rhythm
  const [heroCharCount, setHeroCharCount] = useState(0);
  const [heroIsDeleting, setHeroIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!heroIsDeleting && heroCharCount < HERO_ANIMATION_TEXT.length) {
      timer = setTimeout(() => {
        setHeroCharCount((prev) => prev + 1);
      }, 28);
    } else if (!heroIsDeleting && heroCharCount >= HERO_ANIMATION_TEXT.length) {
      timer = setTimeout(() => {
        setHeroIsDeleting(true);
      }, 8500);
    } else if (heroIsDeleting && heroCharCount > 0) {
      timer = setTimeout(() => {
        setHeroCharCount((prev) => Math.max(0, prev - 2));
      }, 15);
    } else if (heroIsDeleting && heroCharCount === 0) {
      timer = setTimeout(() => {
        setHeroIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [heroCharCount, heroIsDeleting]);

  const renderAnimatedHeroText = (charCount: number) => {
    let remaining = charCount;
    const segments = theme === 'dark' ? HERO_SEGMENTS_DARK : HERO_SEGMENTS_LIGHT;
    return segments.map((seg, idx) => {
      if (remaining <= 0) return null;
      const segText = seg.text;
      const take = Math.min(remaining, segText.length);
      remaining -= take;
      const visiblePart = segText.slice(0, take);
      return (
        <span key={idx} className={seg.className}>
          {visiblePart}
        </span>
      );
    });
  };

  // Check if a Try-On session was initiated from Explore or external card (Requirement 4)
  useEffect(() => {
    try {
      const pendingTryOnRaw = sessionStorage.getItem('wearverse_pending_tryon_design');
      const activeSessId = localStorage.getItem('wearverse_active_session_id');

      if (pendingTryOnRaw) {
        const design = JSON.parse(pendingTryOnRaw);
        sessionStorage.removeItem('wearverse_pending_tryon_design');
        setActiveDesignContext(design);
      }

      if (activeSessId) {
        setActiveSessionId(activeSessId);
        const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
        if (savedSessions) {
          const parsed: ChatSession[] = JSON.parse(savedSessions);
          setSessions(parsed);
          const current = parsed.find(s => s.id === activeSessId);
          if (current) {
            setMessages(current.messages);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync active session messages when activeSessionId changes
  useEffect(() => {
    if (activeSessionId) {
      const sess = sessions.find(s => s.id === activeSessionId);
      if (sess) {
        setMessages(sess.messages);
        // Find latest design in session for context
        const lastWithVars = [...sess.messages].reverse().find(m => m.variations && m.variations.length > 0);
        if (lastWithVars?.variations?.[0]) {
          setActiveDesignContext(lastWithVars.variations[0]);
        }
      }
    } else {
      setMessages([]);
      setActiveDesignContext(null);
    }
  }, [activeSessionId, sessions]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  // Save sessions to localStorage
  const saveSessionsToStorage = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
    } catch (e) {
      console.error('Failed to save sessions', e);
    }
  };

  // Start fresh blank chat session
  const handleStartNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setInputPrompt('');
    setAttachedPhoto(null);
    setActiveDesignContext(null);
    try {
      localStorage.removeItem('wearverse_active_session_id');
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    showToast('info', 'New Chat', 'Started a fresh T-shirt design chat.');
  };

  // Delete session from history
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sessionId);
    saveSessionsToStorage(updated);
    if (activeSessionId === sessionId) {
      handleStartNewChat();
    }
    showToast('info', 'Deleted', 'Chat session removed.');
  };

  // AI Prompt Enhancer (Magic Wand ✨)
  const handleAiEnhancePrompt = () => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in to Enhance', 'Please sign in or create an account to use the AI Magic Wand.');
      openAuthModal('signup');
      return;
    }
    if (!inputPrompt.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      const enhanced = enhancePromptWithAI(inputPrompt);
      setInputPrompt(enhanced);
      setIsEnhancing(false);
      showToast('success', 'AI Magic Wand ✨', 'Prompt upgraded with 240 GSM runway streetwear specs!');
    }, 280);
  };

  // Convert variation into a full Design model for modals & ordering
  const varToDesign = (v: AIVariation): Design => {
    return {
      id: `custom-${v.id || Date.now()}`,
      title: v.name,
      slug: `custom-${v.id || Date.now()}`,
      creator: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isVerified: true,
      },
      description: `Custom generative streetwear design. Prompt: "${v.prompt}".`,
      tags: v.tags ? v.tags.map(t => `#${t.toLowerCase().replace(/\s+/g, '')}`) : ['#streetwear'],
      fabric: {
        gsm: 240,
        material: '100% Super Combed Cotton',
        fit: v.fit || 'Oversized Boxy',
        wash: 'Bio-wash Pre-Shrunk',
      },
      colors: [v.color, '#0f0f11', '#ffffff'],
      defaultColor: v.color || '#0f0f11',
      price: 1499,
      originalPrice: 2299,
      rating: 5.0,
      reviewsCount: 1,
      likesCount: 1,
      remixesCount: 0,
      viewsCount: 1,
      frontImage: v.mockupUrl,
      graphicImage: v.graphicUrl || v.mockupUrl,
      prompt: v.prompt,
      style: 'AI Streetwear',
      category: 'Streetwear',
      createdAt: new Date().toISOString(),
    };
  };

  // Run Virtual Try-On directly inside this active chat stream (Requirements 3, 5, 6)
  const runInChatTryOn = async (
    photoUrl: string, 
    targetDesign: Design | AIVariation,
    userTextPrompt?: string
  ) => {
    if (isGenerating) return;

    // Check credits quota
    if (!hasUnlimitedPass && creditsRemaining <= 0) {
      showToast('warning', '0 AI Credits Remaining', 'Refill tokens to generate Virtual Try-On.');
      openUpgradeCreditsModal();
      return;
    }

    const consumed = consumeCredit();
    if (!consumed) return;

    const designTitle = 'title' in targetDesign ? targetDesign.title : targetDesign.name;
    const graphicToUse = ('graphicImage' in targetDesign && targetDesign.graphicImage) 
      ? targetDesign.graphicImage 
      : ('graphicUrl' in targetDesign && targetDesign.graphicUrl)
        ? targetDesign.graphicUrl
        : ('frontImage' in targetDesign && targetDesign.frontImage)
          ? targetDesign.frontImage
          : ('mockupUrl' in targetDesign ? targetDesign.mockupUrl : '');
    
    const garmentColor = ('defaultColor' in targetDesign && targetDesign.defaultColor)
      ? targetDesign.defaultColor
      : (targetDesign as any).color || '#0f0f11';

    // 1. Append user message with attached photo
    const userMsgId = `user-tryon-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: userTextPrompt || `Try this on me: "${designTitle}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userPhotoUrl: photoUrl,
    };

    // 2. Append AI loading message
    const aiMsgId = `ai-tryon-${Date.now()}`;
    const aiLoadingMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: `Synthesizing bespoke Virtual Try-On for "${designTitle}"...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGenerating: true,
      stepText: '🧠 Scanning posture & shoulder contours...',
    };

    const updated = [...messages, userMsg, aiLoadingMsg];
    setMessages(updated);
    setIsGenerating(true);
    setActiveDesignContext(targetDesign);

    try {
      // Step 1: Scan
      await new Promise(r => setTimeout(r, 450));
      setGenerationStep('📐 Calculating 240 GSM drop-shoulder drape contours...');

      // Step 2: Draping
      await new Promise(r => setTimeout(r, 500));
      setGenerationStep('🎨 Inpainting DTG direct-to-garment print onto fabric fibers...');

      // Step 3: Folds & lighting
      await new Promise(r => setTimeout(r, 450));
      setGenerationStep('✨ Applying photorealistic ambient lighting & realistic folds...');

      // 3. Composite image on canvas
      const compositeUrl = await generateCanvasComposite(photoUrl, graphicToUse, garmentColor);

      const finalizedMessages: ChatMessage[] = updated.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            text: `✨ Here is your bespoke Virtual Try-On for "${designTitle}":`,
            isGenerating: false,
            stepText: '',
            isTryOnResult: true,
            tryOnResultUrl: compositeUrl,
            tryOnOriginalPhotoUrl: photoUrl,
            tryOnDesign: targetDesign,
          };
        }
        return m;
      });

      setMessages(finalizedMessages);

      // Persist in chat session
      const sessionTitle = `Try On: ${designTitle}`;
      if (!activeSessionId) {
        const newSessionId = `sess-tryon-${Date.now()}`;
        const newSession: ChatSession = {
          id: newSessionId,
          title: sessionTitle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: finalizedMessages,
          lastThumbnail: compositeUrl,
        };
        const allSessions = [newSession, ...sessions];
        saveSessionsToStorage(allSessions);
        setActiveSessionId(newSessionId);
      } else {
        const allSessions = sessions.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: finalizedMessages,
              lastThumbnail: compositeUrl || s.lastThumbnail,
            };
          }
          return s;
        });
        saveSessionsToStorage(allSessions);
      }

      showToast('success', '✨ Try-On Ready!', `Previewed "${designTitle}" on your body.`);
    } catch (err) {
      console.error('Try-on synthesis failed', err);
      setMessages(prev => prev.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            text: `Finished processing Try-On for "${designTitle}".`,
            isGenerating: false,
            stepText: '',
          };
        }
        return m;
      }));
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setAttachedPhoto(null);
    }
  };

  // Handle Try-On click on an in-chat variation card
  const handleTryOnVariationInChat = async (variation: AIVariation) => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in for Virtual Try-On', 'Please sign in or create an account to use the Virtual Try-On feature.');
      openAuthModal('signup');
      return;
    }
    setActiveDesignContext(variation);
    const photoToUse = user.tryOnPhotoUrl || attachedPhoto?.dataUrl;
    
    if (!photoToUse) {
      setPendingTryOnVariation(variation);
      fileInputRef.current?.click();
      showToast('info', '📸 Upload Your Photo', `Please select your photo to see ${variation.name} on your body.`);
      return;
    }

    await runInChatTryOn(photoToUse, variation);
  };

  // Handle file select from composer upload button (ChatGPT-style)
  const handleComposerPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in for Virtual Try-On', 'Please sign in or create an account to upload photos for Virtual Try-On.');
      openAuthModal('signup');
      e.target.value = '';
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const photoData = { dataUrl: reader.result, name: file.name };
          setAttachedPhoto(photoData);
          updateTryOnPhoto(reader.result);
          showToast('success', 'Photo Attached! 📸', 'Click Send or type "Try on me" to synthesize your Virtual Try-On.');

          // If a variation was pending photo upload:
          if (pendingTryOnVariation) {
            const v = pendingTryOnVariation;
            setPendingTryOnVariation(null);
            runInChatTryOn(reader.result, v, `Try this on me: "${v.name}"`);
          }
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handle generating or refining T-shirt designs in this conversation
  const handleSendPrompt = async (promptText: string) => {
    // Sanitize prompt to prevent XSS / script injections
    const sanitized = promptText
      .replace(/<[^>]*>?/gm, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();

    if (!sanitized || isGenerating) return;

    if (creditsRemaining <= 0 && user?.role !== 'admin' && !hasUnlimitedPass) {
      showToast('warning', 'Generation Limit Reached (3/3)', 'You have used all 3 free generations. Refill tokens or sign in as Founder to continue.');
      openUpgradeCreditsModal();
      return;
    }

    const query = sanitized;
    setInputPrompt('');

    // Determine if this is an iterative edit request on an existing design in this chat
    const lastWithVars = [...messages].reverse().find(m => m.variations && m.variations.length > 0);
    const isRefinement = !!lastWithVars && isEditRequest(query);

    // If it is a fresh generation, enforce the 3 free generations limit
    if (!isRefinement) {
      const allowed = consumeCredit();
      if (!allowed) {
        return;
      }
    }

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsgId = `ai-${Date.now()}`;
    const aiLoadingMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: isRefinement 
        ? `Analyzing your refinement request for "${query}"...` 
        : `Synthesizing custom T-shirt designs for "${query}"...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGenerating: true,
      stepText: isRefinement 
        ? 'Interpreting modification request...' 
        : '🧠 Understanding your streetwear idea & concepts...',
    };

    const updatedMessages = [...messages, userMsg, aiLoadingMsg];
    setMessages(updatedMessages);
    setIsGenerating(true);

    try {
      if (isRefinement && lastWithVars?.variations) {
        const [result, geminiComment] = await Promise.all([
          aiService.refineDesign({
            instruction: query,
            currentVariations: lastWithVars.variations,
            activeVariationId: lastWithVars.variations[0]?.id || '1',
            hasProPass: hasUnlimitedPass,
          }, (step) => setGenerationStep(step)),
          aiService.generateFashionDialogue(
            `The customer requested this design modification: "${query}". Provide a concise 1-sentence streetwear styling review.`,
            []
          ).catch(() => null)
        ]);

        const finalizedMessages: ChatMessage[] = updatedMessages.map(m => {
          if (m.id === aiMsgId) {
            return {
              ...m,
              text: result.message + (geminiComment ? `\n\n✨ Stylist Note: ${geminiComment}` : ''),
              isGenerating: false,
              variations: result.requiresUpgrade ? lastWithVars.variations : result.updatedVariations,
              isUpgradePrompt: result.requiresUpgrade,
              requestedTweak: query,
            };
          }
          return m;
        });

        if (result.updatedVariations?.[0]) {
          setActiveDesignContext(result.updatedVariations[0]);
        }

        setMessages(finalizedMessages);

        if (activeSessionId) {
          const allSessions = sessions.map(s => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: finalizedMessages,
              };
            }
            return s;
          });
          saveSessionsToStorage(allSessions);
        }
      } else {
        // Run AI synthesis and Gemini Fashion Dialogue in parallel
        const [variations, geminiDialogue] = await Promise.all([
          aiService.generateDesign({
            prompt: query,
            garmentColor: '#0f0f11',
          }, (step) => setGenerationStep(step)),
          aiService.generateFashionDialogue(
            query,
            messages.slice(-4).map(m => ({
              role: m.sender === 'user' ? 'user' : 'model',
              text: m.text,
            }))
          ).catch(err => {
            console.warn('Gemini live dialogue fallback:', err);
            return `⚡ Synthesized bespoke 240 GSM streetwear designs for "${query}":`;
          })
        ]);

        if (variations?.[0]) {
          setActiveDesignContext(variations[0]);
        }

        const aiResponseText = geminiDialogue || `⚡ Synthesized bespoke 240 GSM streetwear designs for "${query}":`;

        const finalizedMessages: ChatMessage[] = updatedMessages.map(m => {
          if (m.id === aiMsgId) {
            return {
              ...m,
              text: aiResponseText,
              isGenerating: false,
              variations,
            };
          }
          return m;
        });

        setMessages(finalizedMessages);

        const sessionTitle = query.length > 30 ? query.substring(0, 28) + '...' : query;
        const lastThumb = variations[0]?.mockupUrl;

        if (!activeSessionId) {
          const newSessionId = `sess-${Date.now()}`;
          const newSession: ChatSession = {
            id: newSessionId,
            title: sessionTitle,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: finalizedMessages,
            lastThumbnail: lastThumb,
          };
          const allSessions = [newSession, ...sessions];
          saveSessionsToStorage(allSessions);
          setActiveSessionId(newSessionId);
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
          saveSessionsToStorage(allSessions);
        }
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => {
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

  // Check if an initial prompt was forwarded from the Home page composer
  useEffect(() => {
    try {
      const initialPrompt = sessionStorage.getItem('wearverse_initial_prompt');
      if (initialPrompt && initialPrompt.trim()) {
        sessionStorage.removeItem('wearverse_initial_prompt');
        setInputPrompt(initialPrompt);
        setTimeout(() => {
          handleSendPrompt(initialPrompt);
        }, 150);
      }
    } catch (e) {
      console.error('Initial prompt load error:', e);
    }
  }, []);

  // Unified form submit handler supporting text, attached photo, or both (Requirement 2 & 3)
  const handleComposerSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;

    if (creditsRemaining <= 0 && user?.role !== 'admin' && !hasUnlimitedPass) {
      showToast('warning', 'Limit Reached (3/3)', 'You have used all 3 free generations. Refill tokens or sign in as Founder.');
      openUpgradeCreditsModal();
      return;
    }

    const text = inputPrompt
      .replace(/<[^>]*>?/gm, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
    const photo = attachedPhoto;

    if (!text && !photo) return;

    // Check if the user is asking to Try-On an existing design
    const isTryOnIntent = /try(\s+it|\s+this)?\s+on(\s+me)?/i.test(text);

    // If a photo was attached
    if (photo) {
      updateTryOnPhoto(photo.dataUrl);
      setInputPrompt('');
      setAttachedPhoto(null);

      // Check for target design context in this conversation
      const lastWithVars = [...messages].reverse().find(m => m.variations && m.variations.length > 0);
      const target = activeDesignContext || (lastWithVars?.variations?.[0] ? lastWithVars.variations[0] : null);

      if (target) {
        // Run Virtual Try-On for the active design in this chat
        await runInChatTryOn(photo.dataUrl, target, text || `Try this on me`);
        return;
      }

      // If no design exists yet, but text was typed, generate design AND try it on!
      if (text) {
        const allowed = consumeCredit();
        if (!allowed) return;

        const userMsgId = `user-${Date.now()}`;
        const userMsg: ChatMessage = {
          id: userMsgId,
          sender: 'user',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userPhotoUrl: photo.dataUrl,
        };

        const aiMsgId = `ai-${Date.now()}`;
        const aiLoadingMsg: ChatMessage = {
          id: aiMsgId,
          sender: 'ai',
          text: `Synthesizing design and generating Virtual Try-On for "${text}"...`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isGenerating: true,
          stepText: '🧠 Generating design concept & calculating fabric drape...',
        };

        setMessages(prev => [...prev, userMsg, aiLoadingMsg]);
        setIsGenerating(true);

        try {
          const variations = await aiService.generateDesign({
            prompt: text,
            garmentColor: '#0f0f11',
          }, (step) => setGenerationStep(step));

          const firstVar = variations[0];
          setActiveDesignContext(firstVar);

          // Now synthesize Try-On composite
          setGenerationStep('✨ Fitting bespoke T-shirt onto your body photo...');
          const composite = await generateCanvasComposite(photo.dataUrl, firstVar.graphicUrl || firstVar.mockupUrl, firstVar.color);

          const finalized: ChatMessage[] = [...messages, userMsg, {
            id: aiMsgId,
            sender: 'ai',
            text: `⚡ Generated "${firstVar.name}" and fitted it onto you:`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            variations,
            isTryOnResult: true,
            tryOnResultUrl: composite,
            tryOnOriginalPhotoUrl: photo.dataUrl,
            tryOnDesign: firstVar,
          }];

          setMessages(finalized);
        } catch (err) {
          console.error(err);
        } finally {
          setIsGenerating(false);
          setGenerationStep('');
        }
        return;
      }

      // Photo uploaded with no prompt and no design: Prompt user
      setMessages(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: 'user',
          text: 'Uploaded my photo for Virtual Try-On',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userPhotoUrl: photo.dataUrl,
        },
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: '📸 **Your photo is saved!** Now type any T-shirt design idea below (e.g. "Vintage 70s biker graphic on washed black tee"), or choose a preset above, and I will generate and fit it onto you right here!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      return;
    }

    // No photo attached: Check if user typed "Try this on me" with text
    if (isTryOnIntent) {
      const lastWithVars = [...messages].reverse().find(m => m.variations && m.variations.length > 0);
      const target = activeDesignContext || (lastWithVars?.variations?.[0] ? lastWithVars.variations[0] : null);

      if (target) {
        const photoToUse = user.tryOnPhotoUrl;
        if (photoToUse) {
          setInputPrompt('');
          await runInChatTryOn(photoToUse, target, text);
          return;
        } else {
          // Trigger photo upload in composer
          fileInputRef.current?.click();
          showToast('info', 'Upload Your Photo', 'Please attach your photo using the camera icon to see the virtual try-on.');
          return;
        }
      }
    }

    // Standard text generation or iterative edit
    await handleSendPrompt(text);
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] ${
      theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      {/* 1. CHAT HISTORY SIDEBAR */}
      <aside 
        className={`
          fixed lg:relative top-0 bottom-0 left-0 z-50 lg:z-10
          ${isSidebarOpen ? 'w-72 translate-x-0 shadow-2xl' : 'w-0 -translate-x-full lg:translate-x-0'} 
          transition-all duration-300 ease-in-out border-r flex flex-col justify-between overflow-hidden flex-shrink-0 ${
            theme === 'dark'
              ? 'bg-[#0d101d] border-slate-800/90 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-xl lg:shadow-none'
          }
        `}
      >
        <div className="p-3.5 space-y-4 flex-1 flex flex-col min-w-[18rem]">
          {/* Brand Logo & Close Toggle */}
          <div className={`flex items-center justify-between pb-3 border-b ${
            theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
          }`}>
            <div 
              onClick={() => setCurrentPage('home')}
              className="cursor-pointer group flex items-center gap-2"
            >
              <WearVerseLogo size="sm" showStudioBadge={true} />
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className={`p-1.5 rounded-xl transition ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => {
              handleStartNewChat();
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setIsSidebarOpen(false);
              }
            }}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>New T-Shirt Design</span>
            </div>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">⌘N</span>
          </button>

          {/* History List Header */}
          <div className={`flex items-center justify-between text-[11px] font-bold uppercase tracking-wider px-1 pt-1 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-700 font-extrabold'
          }`}>
            <span>Recent Designs ({sessions.length})</span>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {sessions.length === 0 ? (
              <div className={`py-12 text-center text-xs space-y-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                <MessageSquare className="w-6 h-6 mx-auto text-slate-400 mb-2 opacity-50" />
                <p>No design chats yet.</p>
                <p className="text-[11px]">Type an idea to generate your first T-shirt!</p>
              </div>
            ) : (
              sessions.map((sess) => {
                const isActive = activeSessionId === sess.id;
                return (
                  <div
                    key={sess.id}
                    onClick={() => {
                      setActiveSessionId(sess.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`group w-full p-2.5 rounded-xl cursor-pointer transition flex items-center gap-2.5 ${
                      isActive 
                        ? (theme === 'dark' ? 'bg-[#1b2030] text-white border border-indigo-500/50 shadow-sm' : 'bg-indigo-50 text-indigo-950 border border-indigo-200 shadow-sm') 
                        : (theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-semibold')
                    }`}
                  >
                    {sess.lastThumbnail ? (
                      <img 
                        src={sess.lastThumbnail} 
                        alt="Tee" 
                        className={`w-8 h-8 rounded-lg object-cover flex-shrink-0 border ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700/60' : 'bg-slate-100 border-slate-200'
                        }`}
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 text-left">
                      <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{sess.title}</p>
                      <p className={`text-[10px] truncate ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                        {sess.messages.length} messages
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(sess.id, e)}
                      title="Delete chat"
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN CHAT CANVAS */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}>
        
        {/* Aurora Lighting & Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className={`absolute top-[5%] left-1/2 -translate-x-1/2 w-[850px] h-[450px] blur-[130px] rounded-full animate-aurora ${
            theme === 'dark' 
              ? 'bg-gradient-to-tr from-indigo-600/22 via-purple-600/18 to-pink-600/12'
              : 'bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-pink-200/20'
          }`} />
          <div className={`absolute inset-0 [background-size:26px_26px] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_45%,#000_75%,transparent_100%)] ${
            theme === 'dark'
              ? 'bg-[radial-gradient(#252e46_1.2px,transparent_1.2px)] opacity-45'
              : 'bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] opacity-60'
          }`} />
        </div>

        {/* Minimal Floating Corner Navigation */}
        <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-1.5 sm:gap-2">
          {/* Back to Home Navigation Button */}
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl border shadow-lg backdrop-blur-md transition flex items-center gap-1.5 text-xs font-bold active:scale-95 group ${
              theme === 'dark'
                ? 'bg-[#141824]/90 hover:bg-[#1d2336] border-slate-700/70 text-slate-200 hover:text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:text-slate-950 shadow-sm'
            }`}
            title="Back to Home Feed"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-500 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {!isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 sm:px-3 sm:py-2 rounded-2xl border shadow-lg backdrop-blur-md transition flex items-center gap-1.5 text-xs font-bold active:scale-95 group ${
                theme === 'dark'
                  ? 'bg-[#141824]/90 hover:bg-[#1d2336] border-slate-700/70 text-slate-200 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:text-slate-950 shadow-sm'
              }`}
              title="Open chat history & sidebar"
            >
              <Menu className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Chats</span>
            </button>
          )}
        </div>

        {/* TOP-RIGHT HEADER: Credits, Explore, Orders & Profile */}
        <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-2">
          {/* Generation Token / Credit Quota Badge */}
          <div className="flex items-center gap-1.5">
            {user?.role === 'admin' || hasUnlimitedPass ? (
              <div
                className={`px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md transition text-xs font-bold flex items-center gap-1.5 border ${
                  theme === 'dark'
                    ? 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-amber-500/10'
                    : 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                }`}
                title="Founder Himanshu: Unlimited AI Studio synthesis & full Store Manager active"
              >
                <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>👑 Unlimited AI (Founder)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={openUpgradeCreditsModal}
                className={`px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md transition text-xs font-bold flex items-center gap-1.5 active:scale-95 border ${
                  creditsRemaining > 1 
                    ? (theme === 'dark' ? 'bg-[#141824]/90 hover:bg-indigo-950/70 text-indigo-300 border-indigo-500/40' : 'bg-white hover:bg-indigo-50 text-indigo-900 border-slate-300 shadow-sm')
                    : creditsRemaining === 1 
                      ? (theme === 'dark' ? 'bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border-amber-500/50' : 'bg-amber-100 text-amber-900 border-amber-300')
                      : 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300 animate-pulse font-bold'
                }`}
                title="AI Generation Tokens remaining on your account. Maximum 3 free for visitors."
              >
                <Zap className={`w-3.5 h-3.5 ${creditsRemaining > 0 ? 'fill-indigo-500 text-indigo-500' : 'fill-rose-500 text-rose-500'}`} />
                <span>
                  {creditsRemaining > 0 
                    ? `${creditsRemaining} / 3 Free` 
                    : '0 Left (Refill)'}
                </span>
              </button>
            )}
          </div>

          {/* Theme Toggle Button (Dark / Light Mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 rounded-full border transition shadow-lg text-xs active:scale-90 flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-[#141824]/90 hover:bg-[#1d2336] border-slate-700/70 text-amber-300 hover:text-white'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-indigo-600 hover:text-indigo-900 shadow-sm'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode (Default)' : 'Switch to Obsidian Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            )}
          </button>

          {/* Explore Trending Drops */}
          <button
            type="button"
            onClick={() => setCurrentPage('explore')}
            className={`px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition text-xs font-bold flex items-center gap-1.5 active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#141824]/85 hover:bg-[#1d2336] border-slate-700/70 text-slate-300 hover:text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 hover:text-slate-950 shadow-sm'
            }`}
            title="Explore Trending Drops"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Explore Drops</span>
          </button>

          {/* User Profile & Log Out Menu */}
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full border shadow-lg backdrop-blur-md transition text-xs font-bold active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-[#141824]/90 hover:bg-[#1d2336] border-slate-700/70 text-slate-200 hover:text-white'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 hover:text-slate-950 shadow-sm'
                }`}
                title="Account Menu & Store Manager"
              >
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/40" />
                <span className={`hidden sm:inline font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  {user?.role === 'admin' ? '👑 Himanshu' : user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1 ${
                  theme === 'dark'
                    ? 'bg-[#121624] border-slate-700/80 text-white'
                    : 'bg-white border-slate-200 text-slate-900 shadow-xl'
                }`}>
                  <div className={`p-2 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                      {user?.role === 'admin' && (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 py-0.2 rounded">
                          Founder
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-indigo-500 truncate">@{user.username}</p>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => { setIsProfileOpen(false); openAdminOrdersModal(); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                        theme === 'dark' ? 'hover:bg-slate-800/80 text-amber-300 hover:text-amber-200' : 'hover:bg-amber-50 text-amber-600'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      <span>👑 Store Manager (Admin)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { setIsProfileOpen(false); setCurrentPage('my-designs'); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                      theme === 'dark' ? 'hover:bg-slate-800/80 text-indigo-300 hover:text-indigo-200' : 'hover:bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    <Shirt className="w-3.5 h-3.5 text-indigo-500" />
                    <span>My Wardrobe / Designs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsProfileOpen(false); setCurrentPage('orders'); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      theme === 'dark' ? 'hover:bg-slate-800/80 text-emerald-400 hover:text-emerald-300' : 'hover:bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                      <span>My Orders</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-indigo-600 text-white">
                      {orders.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsProfileOpen(false); openEditProfileModal(); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                      theme === 'dark' ? 'hover:bg-slate-800/80 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsProfileOpen(false); logout(); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* CHAT CONTENT STREAM 
            Requirement 1: When messages.length === 0, the container is overflow-hidden & centered so NO vertical scrolling is needed!
            When messages.length > 0, it becomes overflow-y-auto to browse conversation smoothly!
        */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className={`flex-1 w-full relative z-10 flex flex-col ${
            messages.length === 0 ? 'overflow-hidden justify-center' : 'overflow-y-auto'
          }`}
        >
          <div className="max-w-5xl w-full mx-auto p-3 sm:p-5 space-y-4 my-auto">
          
          {/* REQUIREMENT 1: POLISHED ENTRY SCREEN (Fits Within One Single Viewport, Zero Scrolling Needed!) */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-2 sm:py-3 px-3 space-y-2.5 sm:space-y-3.5 animate-in fade-in duration-300 relative z-10">
              
              {/* Layered Glowing Luxury Emblem */}
              <div className="relative flex items-center justify-center group">
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-25 blur-2xl group-hover:opacity-40 transition-all duration-500 animate-pulse" />
                <div className="absolute w-24 h-24 rounded-full border border-indigo-500/20 pointer-events-none" />

                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border p-0.5 flex items-center justify-center shadow-xl group-hover:scale-105 transition-all duration-300 ${
                  theme === 'dark' ? 'bg-[#0c101d] border-indigo-400/40 shadow-indigo-600/30' : 'bg-white border-indigo-200 shadow-slate-200'
                }`}>
                  <div className={`w-full h-full rounded-[14px] flex items-center justify-center relative overflow-hidden ${
                    theme === 'dark' ? 'bg-gradient-to-tr from-indigo-950 via-[#131828] to-slate-900' : 'bg-gradient-to-tr from-indigo-50 via-slate-50 to-white'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/25 via-violet-500/20 to-transparent" />
                    <WearVerseLogo size="sm" showText={false} />
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] sm:text-xs font-bold tracking-wide shadow-sm ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border-indigo-400/30 text-indigo-200' 
                  : 'bg-indigo-50 border-indigo-200 text-indigo-900 font-extrabold'
              }`}>
                <Sparkles className={`w-3 h-3 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} animate-pulse`} />
                <span className="font-display">Generative AI Fashion Studio • 240 GSM Luxury Draping</span>
              </div>

              {/* Headline */}
              <h1 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-950'} tracking-tight font-display leading-tight`}>
                Design what you want to{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark' 
                    ? 'from-indigo-200 via-violet-300 to-pink-300 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]' 
                    : 'from-indigo-600 via-violet-600 to-pink-600'
                } bg-clip-text text-transparent`}>
                  wear.
                </span>
              </h1>

              {/* ANIMATED HERO STATEMENT - Screen-filling, high clarity */}
              <div className="w-full max-w-2xl sm:max-w-3xl mx-auto">
                <div className={`relative p-2.5 sm:p-3.5 rounded-2xl overflow-hidden flex items-center justify-center min-h-[56px] sm:min-h-[68px] ${
                  theme === 'dark' 
                    ? 'glass-card-luxury glow-box' 
                    : 'bg-white border-2 border-slate-200/90 shadow-md shadow-slate-200/50'
                }`}>
                  <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl pointer-events-none ${
                    theme === 'dark' ? 'border-indigo-400/50' : 'border-indigo-500'
                  }`} />
                  <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-xl pointer-events-none ${
                    theme === 'dark' ? 'border-purple-400/50' : 'border-purple-500'
                  }`} />

                  <p className={`text-xs sm:text-base md:text-lg font-display font-medium leading-relaxed sm:leading-snug ${
                    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                  } tracking-wide select-none text-center`}>
                    {renderAnimatedHeroText(heroCharCount)}
                    <span className={`inline-block w-1 sm:w-1.5 h-3.5 sm:h-5 ml-1 bg-gradient-to-b ${
                      theme === 'dark' 
                        ? 'from-indigo-400 via-purple-400 to-pink-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]' 
                        : 'from-indigo-600 via-purple-600 to-pink-600 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                    } animate-pulse align-middle rounded-full`} />
                  </p>
                </div>
              </div>

              {/* Minimal Specs Pills Strip */}
              <div className={`flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
              }`}>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm cursor-default font-medium ${
                  theme === 'dark' ? 'bg-[#131728]/80 border-slate-700/80 text-slate-300' : 'bg-white border-slate-300 text-slate-800 shadow-sm'
                }`}>
                  <Shirt className={`w-3 h-3 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} /> 240 GSM Luxury Heavy Cotton
                </span>
                <span className={`hidden sm:inline ${theme === 'dark' ? 'text-slate-700' : 'text-slate-400'}`}>•</span>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm cursor-default font-medium ${
                  theme === 'dark' ? 'bg-[#131728]/80 border-slate-700/80 text-slate-300' : 'bg-white border-slate-300 text-slate-800 shadow-sm'
                }`}>
                  <Sparkles className={`w-3 h-3 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} /> Neural Virtual Try-On
                </span>
                <span className={`hidden sm:inline ${theme === 'dark' ? 'text-slate-700' : 'text-slate-400'}`}>•</span>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm cursor-default font-medium ${
                  theme === 'dark' ? 'bg-[#131728]/80 border-slate-700/80 text-slate-300' : 'bg-white border-slate-300 text-slate-800 shadow-sm'
                }`}>
                  <Truck className={`w-3 h-3 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} /> 48h Pan-India Express
                </span>
              </div>

            </div>
          )}

          {/* ACTIVE CHAT MESSAGES STREAM */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* AI Avatar */}
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-indigo-600/20">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div className={`space-y-3 max-w-2xl w-full ${msg.sender === 'user' ? 'max-w-md' : ''}`}>
                
                {/* User Message with optional uploaded photo */}
                <div
                  className={`p-3.5 sm:p-4 rounded-3xl ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none ml-auto text-sm font-medium shadow-md'
                      : theme === 'dark'
                        ? 'bg-[#151926] text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-md shadow-slate-200/50'
                  }`}
                >
                  {/* If user uploaded a photo in this message */}
                  {msg.userPhotoUrl && (
                    <div className="mb-2.5 max-w-[220px] rounded-xl overflow-hidden border border-white/20 shadow-md">
                      <img 
                        src={msg.userPhotoUrl} 
                        alt="Uploaded for Try-On" 
                        className="w-full h-auto object-cover max-h-48"
                      />
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`text-[10px] block mt-1.5 text-right ${theme === 'dark' ? 'text-slate-400/80' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* GENERATING / TRY-ON PROGRESS VISUALIZER */}
                {msg.isGenerating && (
                  <div className={`rounded-2xl border p-4 space-y-3 shadow-2xl backdrop-blur-md animate-in fade-in duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border-indigo-500/40'
                      : 'bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-white border-indigo-200 text-slate-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                          <Sparkles className="w-2.5 h-2.5 text-indigo-500 animate-pulse" />
                        </div>
                        <span className={`text-xs font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          WearVerse Neural Engine
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        theme === 'dark'
                          ? 'text-indigo-300 bg-indigo-900/60 border-indigo-500/30'
                          : 'text-indigo-700 bg-indigo-100 border-indigo-300'
                      }`}>
                        Flux Diffusion Active
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className={`flex items-center justify-between text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className={`font-semibold ${theme === 'dark' ? 'text-indigo-200' : 'text-indigo-700'}`}>
                          {generationStep || msg.stepText || 'Synthesizing live AI variations...'}
                        </span>
                        <span className="text-indigo-500 font-bold text-[10px] animate-pulse">Live</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden relative ${theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-200'}`}>
                        <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-400 to-emerald-400 animate-pulse w-full rounded-full transition-all duration-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
                      <div className={`p-1.5 rounded-lg border text-center ${
                        theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                      }`}>
                        <span className={`font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1200 DPI</span>
                        <span>DTG Vector</span>
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center ${
                        theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                      }`}>
                        <span className={`font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>240 GSM</span>
                        <span>Combed Cotton</span>
                      </div>
                      <div className={`p-1.5 rounded-lg border text-center ${
                        theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                      }`}>
                        <span className={`font-bold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Boxy Drape</span>
                        <span>Drop Shoulder</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPGRADE / PRO REFINEMENT LOCK CARD */}
                {msg.isUpgradePrompt && (
                  <div className={`rounded-3xl border p-4 sm:p-5 space-y-3.5 shadow-2xl backdrop-blur-md animate-in fade-in duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-[#19142b] via-[#141829] to-[#0c0f1c] border-indigo-500/40 text-slate-100'
                      : 'bg-gradient-to-br from-indigo-50/90 via-slate-50 to-white border-indigo-200 text-slate-900'
                  }`}>
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                        theme === 'dark' ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-400' : 'bg-indigo-100 border border-indigo-300 text-indigo-600'
                      }`}>
                        <Lock className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            theme === 'dark' ? 'text-indigo-400 bg-indigo-950/80 border-indigo-500/30' : 'text-indigo-700 bg-indigo-100 border-indigo-300'
                          }`}>
                            Studio Pro Feature
                          </span>
                          <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>GPU Tokens Required</span>
                        </div>
                        <h4 className={`text-sm sm:text-base font-extrabold font-['Space_Grotesk'] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          AI-Powered Iterative Editing
                        </h4>
                        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          Want to customize this design with <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>"{msg.requestedTweak}"</strong>? Real-time multi-layer neural editing requires GPU token compute.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={openUpgradeCreditsModal}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>Unlock AI Editing & Refills (from ₹49)</span>
                      </button>

                      <span className={`text-[11px] text-center sm:text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Or order this physical 240 GSM drop as-is below!
                      </span>
                    </div>
                  </div>
                )}

                {/* IN-CHAT VIRTUAL TRY-ON RESULT (Requirements 3, 5, 6: Never redirects away!) */}
                {msg.isTryOnResult && (
                  <TryOnBubble
                    msg={msg}
                    theme={theme}
                    onOrder={(design, color) => openOrderModal(design, color)}
                    onZoom={(url) => setLightboxImg(url)}
                    onRefinePrompt={(text) => setInputPrompt(text)}
                    varToDesign={varToDesign}
                  />
                )}

                {/* OUTPUT IMAGES GENERATED RIGHT HERE IN THE CHAT STREAM! */}
                {msg.variations && msg.variations.length > 0 && (
                  <div className="space-y-2.5 pt-1 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {msg.variations.length > 1 ? `Generated T-Shirt Concepts (${msg.variations.length})` : 'Generated T-Shirt Design'}
                      </span>
                      <span className="text-[11px] text-indigo-400 font-medium">Click image to inspect high-res</span>
                    </div>

                    <div className={`grid gap-3.5 ${msg.variations.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'max-w-md w-full'}`}>
                      {msg.variations.map((v, idx) => {
                        const designObj = varToDesign(v);
                        return (
                          <VariationCard
                            key={v.id}
                            variation={v}
                            index={idx}
                            theme={theme}
                            onTryOn={() => handleTryOnVariationInChat(v)}
                            onOrder={() => openOrderModal(designObj, v.color)}
                            onZoom={(url) => setLightboxImg(url)}
                            onRefine={() => {
                              setInputPrompt(`Refine "${v.name}": make it `);
                              inputRef.current?.focus();
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-xl object-cover border border-indigo-400 flex-shrink-0 mt-1"
                />
              )}
            </div>
          ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Scroll Down Button */}
        {showScrollDown && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-24 right-4 sm:right-8 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1c2132]/95 hover:bg-[#252c42] text-white border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 animate-in fade-in zoom-in-75 group"
            title="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5 text-indigo-300 group-hover:translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* BOTTOM FIXED CHAT INPUT BAR (Luxury Glassmorphic Studio Bar) */}
        <div className={`p-2.5 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-2xl border-t space-y-2 flex-shrink-0 transition-colors ${
          theme === 'dark'
            ? 'bg-[#0c101d]/90 border-indigo-500/20 shadow-[0_-15px_35px_rgba(0,0,0,0.6)]'
            : 'bg-white/95 border-slate-200/90 shadow-[0_-10px_25px_rgba(15,23,42,0.06)]'
        }`}>

          {/* Interactive Creative Moods & Surprise Me Pill Bar */}
          <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
              {AESTHETIC_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (preset.prompt === 'RANDOM') {
                      const randomP = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
                      setInputPrompt(randomP);
                      showToast('info', '✨ Curated Prompt Loaded', 'Press Enter or click Send to synthesize!');
                    } else {
                      setInputPrompt(preset.prompt);
                    }
                  }}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 flex items-center gap-1.5 flex-shrink-0 border shadow-sm ${
                    preset.isSpecial
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25 text-amber-200 border-amber-500/50 hover:border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-amber-100 text-amber-900 border-amber-300 hover:border-amber-400 shadow-sm font-bold'
                      : theme === 'dark'
                        ? 'bg-[#141829]/90 hover:bg-[#1c223a] text-slate-200 hover:text-white border-slate-700/80 hover:border-indigo-400'
                        : 'bg-white hover:bg-slate-100 text-slate-800 hover:text-slate-950 border-slate-300 hover:border-indigo-400 shadow-sm font-medium'
                  }`}
                >
                  {preset.isSpecial && <Dices className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} animate-spin-slow`} />}
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Attached User Photo Preview Chip (Requirement 2: Unified Composer) */}
          {attachedPhoto && (
            <div className={`max-w-4xl mx-auto flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-xs animate-in fade-in slide-in-from-bottom-1 ${
              theme === 'dark'
                ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
                : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <img 
                  src={attachedPhoto.dataUrl} 
                  alt="Attached preview" 
                  className="w-6 h-6 rounded-md object-cover border border-indigo-400/80 flex-shrink-0" 
                />
                <span className={`font-semibold truncate max-w-[200px] sm:max-w-xs ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                  {attachedPhoto.name || 'Your Photo Attached'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedPhoto(null)}
                className="p-1 text-slate-400 hover:text-rose-500 transition"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Luxury ChatGPT-Style Unified Prompt Input Bar (Requirement 2) */}
          <form
            onSubmit={handleComposerSubmit}
            className={`relative max-w-4xl mx-auto flex items-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#121626]/95 hover:bg-[#151a2e] border border-indigo-500/35 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                : 'bg-white hover:bg-slate-50 border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-xl shadow-slate-200/50'
            }`}
          >
            {/* Hidden file input for photo upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleComposerPhotoSelect}
              className="hidden"
            />

            {/* Inline Upload Icon (ChatGPT-style) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload photo of yourself for instant Virtual Try-On"
              disabled={isGenerating}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 active:scale-95 ${
                attachedPhoto
                  ? 'bg-indigo-600/40 text-indigo-200 border-indigo-400 shadow-sm'
                  : theme === 'dark'
                    ? 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700/80 hover:border-indigo-400/70'
                    : 'bg-white hover:bg-slate-100 text-slate-800 hover:text-slate-950 border-slate-300 hover:border-indigo-400 shadow-sm font-semibold'
              }`}
            >
              <Camera className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold hidden sm:inline">
                {attachedPhoto ? 'Photo Added' : 'Upload Photo'}
              </span>
            </button>


            {/* AI Magic Wand Prompt Enhancer Button */}
            <button
              type="button"
              onClick={handleAiEnhancePrompt}
              title="✨ AI Magic Wand: Upgrade prompt with luxury streetwear specs"
              disabled={isGenerating || isEnhancing || !inputPrompt.trim()}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 shadow-md shadow-indigo-600/30 active:scale-95 flex-shrink-0 disabled:opacity-40 relative overflow-hidden group"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
              <span className="font-display tracking-wide hidden md:inline">AI Enhance</span>
            </button>

            {/* Main Prompt Input with Keyboard Shortcuts */}
            <input
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleComposerSubmit();
                }
              }}
              disabled={isGenerating}
              placeholder={
                attachedPhoto
                  ? "Type 'Try this on me' or describe your custom T-shirt idea..."
                  : messages.length > 0
                    ? "Refine design ('make it white', 'smaller chest print', 'remove text')..."
                    : "Describe any T-shirt design or upload photo for instant Try-On..."
              }
              className={`flex-1 bg-transparent px-2.5 py-1.5 text-xs sm:text-sm outline-none disabled:opacity-50 min-w-0 font-body ${
                theme === 'dark' ? 'text-white placeholder:text-slate-400/80 font-normal' : 'text-slate-950 placeholder:text-slate-500 font-semibold'
              }`}
            />

            {/* Send / Generate Button */}
            <button
              type="submit"
              disabled={(!inputPrompt.trim() && !attachedPhoto) || isGenerating}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95 flex-shrink-0 ${
                (inputPrompt.trim() || attachedPhoto) && !isGenerating
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-600/40 hover:scale-105 animate-pulse-subtle'
                  : theme === 'dark' 
                    ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-white" />
              ) : (
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </form>

          {/* Tokens Exhausted Alert (if any) */}
          {creditsRemaining === 0 && !hasUnlimitedPass && (
            <div className="max-w-4xl mx-auto flex items-center justify-between px-2 pt-0.5 text-[10px] sm:text-[11px]">
              <div className="flex items-center gap-1.5 text-rose-500 font-semibold text-[11px]">
                <Zap className="w-3 h-3 text-rose-500" />
                <span>Free generations used up (3/3). Tokens exhausted.</span>
              </div>
              <button 
                type="button" 
                onClick={openUpgradeCreditsModal} 
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition flex items-center gap-1 active:scale-95 text-[11px]"
              >
                <span>Refill Tokens to Continue</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* LIGHTBOX MODAL TO INSPECT HIGH-RES T-SHIRT */}
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
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={lightboxImg} alt="Enlarged T-Shirt" className="w-full h-auto object-cover max-h-[80vh]" />
              <div className="p-4 bg-slate-950 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">WearVerse High-Res Studio View</p>
                  <p className="text-xs text-slate-400">1200 DPI DTG Print Simulation • 240 GSM Fabric</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxImg(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}


      </main>

    </div>
  );
};
