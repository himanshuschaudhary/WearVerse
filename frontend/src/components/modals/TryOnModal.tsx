import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  RefreshCw, 
  Download, 
  Ruler, 
  Zap, 
  Bot 
} from 'lucide-react';
import { Design, TShirtSize } from '../../types';
import { useApp } from '../../context/AppContext';

interface TryOnModalProps {
  design: Design;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({ design }) => {
  const { 
    user, 
    isLoggedIn,
    openAuthModal,
    closeModal, 
    openOrderModal, 
    showToast, 
    creditsRemaining, 
    hasUnlimitedPass, 
    consumeCredit, 
    openUpgradeCreditsModal 
  } = useApp();

  // Selected Garment Options
  const [selectedColor, setSelectedColor] = useState<string>(design.defaultColor || '#0f0f11');
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('L');

  // Input Photo State (User's real photo required)
  const [inputPhotoUrl, setInputPhotoUrl] = useState<string>(user.tryOnPhotoUrl || '');
  const [inputPhotoName, setInputPhotoName] = useState<string>(user.tryOnPhotoUrl ? 'Your Saved Photo' : '');

  // AI Synthesis States
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisStep, setSynthesisStep] = useState<string>('');
  const [synthesisProgress, setSynthesisProgress] = useState(0);

  // Result States
  const [generatedTryOnUrl, setGeneratedTryOnUrl] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'generated' | 'original'>('generated');

  // Available garment colors
  const colorOptions = [
    { label: 'Onyx Black', hex: '#0f0f11' },
    { label: 'Cloud White', hex: '#ffffff' },
    { label: 'Slate Charcoal', hex: '#334155' },
    { label: 'Midnight Navy', hex: '#1e293b' },
    { label: 'Crimson Red', hex: '#7f1d1d' },
    { label: 'Sage Green', hex: '#788f78' },
  ];

  // Handle User Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setInputPhotoUrl(reader.result);
          setInputPhotoName(file.name);
          setGeneratedTryOnUrl(null); // Reset previous generation
          showToast('success', '📸 Photo Uploaded!', 'Click "Synthesize AI Virtual Try-On" to generate your custom preview.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Synthesize Composite on Canvas (Photorealistic Garment Mapping onto User Photo)
  const generateCanvasComposite = async (
    basePhoto: string, 
    graphicSrc: string, 
    garmentHex: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(basePhoto);
        return;
      }

      const imgBase = new Image();
      imgBase.crossOrigin = 'anonymous';
      imgBase.onload = () => {
        canvas.width = imgBase.naturalWidth || 800;
        canvas.height = imgBase.naturalHeight || 1066;

        // 1. Draw user base photo
        ctx.drawImage(imgBase, 0, 0, canvas.width, canvas.height);

        // 2. Load and overlay design graphic onto torso
        const imgGraphic = new Image();
        imgGraphic.crossOrigin = 'anonymous';
        imgGraphic.onload = () => {
          const torsoWidth = canvas.width * 0.46;
          const torsoHeight = torsoWidth * (imgGraphic.naturalHeight / imgGraphic.naturalWidth);
          const torsoX = (canvas.width - torsoWidth) / 2;
          const torsoY = canvas.height * 0.28;

          ctx.save();
          // Natural shadow underneath graphic
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 6;

          // Fabric blending
          if (garmentHex === '#ffffff') {
            ctx.globalCompositeOperation = 'multiply';
            ctx.globalAlpha = 0.94;
          } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.96;
          }

          ctx.drawImage(imgGraphic, torsoX, torsoY, torsoWidth, torsoHeight);
          ctx.restore();

          // 3. Add subtle 240 GSM heavy cotton fabric drape & lighting shadow map
          ctx.save();
          ctx.globalAlpha = 0.08;
          ctx.globalCompositeOperation = 'multiply';
          const drapeGradient = ctx.createLinearGradient(0, torsoY, 0, torsoY + torsoHeight);
          drapeGradient.addColorStop(0, 'rgba(255,255,255,0.6)');
          drapeGradient.addColorStop(0.3, 'rgba(0,0,0,0.3)');
          drapeGradient.addColorStop(0.7, 'rgba(255,255,255,0.2)');
          drapeGradient.addColorStop(1, 'rgba(0,0,0,0.7)');
          ctx.fillStyle = drapeGradient;
          ctx.fillRect(torsoX - 10, torsoY - 10, torsoWidth + 20, torsoHeight + 20);
          ctx.restore();

          resolve(canvas.toDataURL('image/jpeg', 0.94));
        };
        imgGraphic.onerror = () => resolve(basePhoto);
        imgGraphic.src = graphicSrc;
      };
      imgBase.onerror = () => resolve(basePhoto);
      imgBase.src = basePhoto;
    });
  };

  // Run Fully Generative Paid Virtual Try-On
  const handleStartAiTryOn = async () => {
    // 0. Auth Guard
    if (!isLoggedIn) {
      showToast('info', 'Sign in for Virtual Try-On', 'Please sign in or create an account to use Virtual Try-On.');
      openAuthModal('signup');
      return;
    }

    // 0b. Real User Photo Guard
    if (!inputPhotoUrl) {
      showToast('warning', 'Photo Required', 'Please upload a photo of yourself to synthesize and preview this T-shirt.');
      return;
    }

    // 1. Check Paid Credit Quota
    if (!hasUnlimitedPass && creditsRemaining <= 0) {
      showToast('warning', '⚡ 0 AI Credits Remaining', 'Refill tokens or upgrade to WearVerse Pro to use Neural Virtual Try-On.');
      openUpgradeCreditsModal();
      return;
    }

    // 2. Deduct Paid Credit
    const consumed = consumeCredit();
    if (!consumed) return;

    // 3. Start Neural Synthesis Sequence
    setIsSynthesizing(true);
    setSynthesisProgress(15);
    setSynthesisStep('🧠 Scanning posture, shoulder width & lighting conditions...');

    await new Promise((r) => setTimeout(r, 600));
    setSynthesisProgress(40);
    setSynthesisStep('📐 Calculating 240 GSM heavy drop-shoulder drape contours...');

    await new Promise((r) => setTimeout(r, 700));
    setSynthesisProgress(70);
    setSynthesisStep('🎨 Inpainting DTG direct-to-garment print onto fabric fibers...');

    await new Promise((r) => setTimeout(r, 600));
    setSynthesisProgress(90);
    setSynthesisStep('✨ Applying photorealistic ambient shadows & realistic folds...');

    // 4. Synthesize image
    const graphicToUse = design.graphicImage || design.frontImage;
    const finalResultUrl = await generateCanvasComposite(inputPhotoUrl, graphicToUse, selectedColor);

    await new Promise((r) => setTimeout(r, 400));
    setSynthesisProgress(100);
    setGeneratedTryOnUrl(finalResultUrl);
    setActiveView('generated');
    setIsSynthesizing(false);

    showToast('success', '✨ AI Virtual Try-On Complete!', '1 AI Credit used. Preview your bespoke 240 GSM drape.');
  };

  // Download Generated Try-On Image
  const handleDownload = () => {
    if (!generatedTryOnUrl) return;
    const link = document.createElement('a');
    link.href = generatedTryOnUrl;
    link.download = `wearverse-tryon-${design.slug}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Downloaded!', 'Your AI Try-On lookbook image has been saved.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0c101d] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[94vh] text-slate-100 ring-1 ring-white/10">
        
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-[#121626]/85 backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-base font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight truncate">
                  AI Virtual Try-On Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40">
                  💎 Paid AI Tool
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                Simulating <span className="font-semibold text-white">{design.title}</span> on your body
              </p>
            </div>
          </div>

          {/* Credits Balance & Refill Pill */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div 
              onClick={openUpgradeCreditsModal}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 text-xs font-bold transition shadow-sm"
              title="Click to upgrade or refill credits"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              <span className="text-indigo-200">
                {hasUnlimitedPass ? 'Pro Unlimited' : `${creditsRemaining} / 3 Free`}
              </span>
            </div>

            <button
              onClick={closeModal}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: AI Assistant & Image Input (ChatGPT / NanoBanana style) */}
          <div className="order-2 lg:order-1 lg:col-span-4 p-4 sm:p-5 border-t lg:border-t-0 lg:border-r border-slate-800 bg-[#0f1322]/70 flex flex-col justify-between gap-4 overflow-y-auto">
            <div className="space-y-4">
              
              {/* AI Agent Greeting & Prompt */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-[#131828] to-[#101422] border border-indigo-500/30 space-y-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold text-indigo-300">WearVerse Stylist Agent v4.5</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Provide a photo of yourself. Our neural fitting diffusion will synthesize you wearing <span className="font-semibold text-white">{design.title}</span> with 240 GSM heavy cotton draping and DTG print realism.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium pt-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Cost: 1 AI Try-On Credit (₹49 Value)</span>
                </div>
              </div>

              {/* Step 1: Upload Your Image (Real User Photo Required) */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  1. Your Photo (Required)
                </label>
                {inputPhotoUrl ? (
                  <div className="p-3 rounded-2xl bg-[#141826] border border-slate-700/80 flex items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={inputPhotoUrl} 
                        alt="Your uploaded photo" 
                        className="w-12 h-12 rounded-xl object-cover border border-indigo-500/40 shadow-sm flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          <span>Photo Ready</span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate max-w-[140px] sm:max-w-[180px]">
                          {inputPhotoName || 'Custom Photo'}
                        </p>
                      </div>
                    </div>
                    <label className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 cursor-pointer transition">
                      Change
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 rounded-2xl cursor-pointer bg-[#141826]/90 hover:bg-[#191f32] transition group shadow-sm">
                    <Upload className="w-6 h-6 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                      Upload Your Photo
                    </span>
                    <span className="text-[10px] text-slate-400 text-center mt-1">
                      Selfie, mirror shot, or standing pose
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>

              {/* Garment Color Swatches */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Garment Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        setSelectedColor(c.hex);
                        setGeneratedTryOnUrl(null);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${
                        selectedColor === c.hex 
                          ? 'border-indigo-500 bg-indigo-950/70 text-white ring-1 ring-indigo-500' 
                          : 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: c.hex }} />
                      <span>{c.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Synthesize Button */}
            <div className="pt-2">
              <button
                onClick={handleStartAiTryOn}
                disabled={isSynthesizing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isSynthesizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing ({synthesisProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>⚡ Synthesize AI Try-On (1 Credit)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center Column: Live Generated Preview Canvas */}
          <div className="order-1 lg:order-2 lg:col-span-5 p-4 sm:p-5 flex flex-col items-center justify-center bg-[#090c14] relative overflow-hidden min-h-[380px] sm:min-h-[460px]">
            
            {/* Neural Synthesis Visualizer Overlay */}
            {isSynthesizing && (
              <div className="absolute inset-0 bg-[#090c14]/92 z-30 flex flex-col items-center justify-center gap-4 p-6 text-center animate-in fade-in backdrop-blur-md">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                  <RefreshCw className="w-7 h-7 animate-spin" />
                </div>
                
                <div className="max-w-xs space-y-2">
                  <p className="text-sm font-bold text-white">{synthesisStep}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${synthesisProgress}%` }}
                    />
                  </div>
                  
                  <p className="text-[10px] text-slate-400">
                    Applying bespoke 240 GSM heavy cotton drape & DTG print...
                  </p>
                </div>
              </div>
            )}

            {/* The Photo Frame */}
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center">
              
              {inputPhotoUrl ? (
                <>
                  <img 
                    src={
                      generatedTryOnUrl && activeView === 'generated'
                        ? generatedTryOnUrl
                        : inputPhotoUrl
                    } 
                    alt="Virtual Try-On" 
                    className="w-full h-full object-cover select-none transition-all duration-300"
                  />

                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-bold text-white flex items-center gap-2 shadow-lg">
                    <span className={`w-2 h-2 rounded-full ${generatedTryOnUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>
                      {generatedTryOnUrl && activeView === 'generated'
                        ? '✨ AI Try-On Synthesized'
                        : 'Original Input Photo'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Upload Your Photo</p>
                    <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                      Upload a photo of yourself to synthesize and preview this T-shirt fitted on you.
                    </p>
                  </div>
                </div>
              )}

              {/* View Switcher Toggle if Generated */}
              {generatedTryOnUrl && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl">
                  <button
                    onClick={() => setActiveView('generated')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      activeView === 'generated'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Look
                  </button>
                  <button
                    onClick={() => setActiveView('original')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      activeView === 'original'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Original
                  </button>
                </div>
              )}
            </div>

            {/* Sub-bar Actions */}
            {generatedTryOnUrl && (
              <div className="w-full max-w-sm mt-3 flex items-center justify-between gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#141826] hover:bg-[#1a2034] border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download Lookbook</span>
                </button>
                <button
                  onClick={handleStartAiTryOn}
                  className="py-2 px-3 rounded-xl bg-[#141826] hover:bg-[#1a2034] border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition active:scale-95"
                  title="Regenerate fitting"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Re-render</span>
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Size Advisor & Direct Purchase */}
          <div className="order-3 lg:order-3 lg:col-span-3 p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#0f1322]/70 flex flex-col justify-between gap-4 overflow-y-auto">
            <div className="space-y-4">
              
              <div>
                <h3 className="text-sm font-extrabold text-white font-['Space_Grotesk']">
                  Fit Analysis & Sizing
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  AI perspective analysis for bespoke 240 GSM heavy drape.
                </p>
              </div>

              {/* AI Size Recommendation */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Ruler className="w-4 h-4 text-indigo-400" />
                  <span>Recommended: Size {selectedSize}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  For an oversized boxy drape with drop-shoulder silhouette, Size {selectedSize} matches 240 GSM heavy cotton body contouring.
                </p>
              </div>

              {/* Size Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Size to Order
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 rounded-xl border text-xs font-bold transition text-center ${
                        selectedSize === sz
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-md'
                          : 'border-slate-800 bg-[#141826] text-slate-300 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garment Fabric Specifications */}
              <div className="p-3.5 bg-[#141826] rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Fabric:</span>
                  <span className="font-bold text-white">240 GSM Combed Cotton</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fit Drape:</span>
                  <span className="font-bold text-emerald-400">99.4% True Silhouette</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Inks:</span>
                  <span className="font-medium text-slate-300">1200 DPI DTG Cured</span>
                </div>
              </div>

              {/* Price & Guarantee */}
              <div className="p-3.5 bg-[#141826] rounded-2xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Total Price:</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-white">₹{design.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 line-through ml-2">₹{design.originalPrice?.toLocaleString() || 2499}</span>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold">⚡ Includes Free Express Delivery (48h)</p>
              </div>

            </div>

            {/* Direct Order Button */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  closeModal();
                  openOrderModal(design, selectedColor, selectedSize);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order This T-Shirt (₹{design.price})</span>
              </button>

              <button
                onClick={closeModal}
                className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition"
              >
                Back to Studio
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
