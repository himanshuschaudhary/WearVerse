import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  Crown, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  Gift,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UpgradeCreditsModal: React.FC = () => {
  const { 
    closeModal, 
    creditsRemaining, 
    hasUnlimitedPass, 
    addCredits, 
    activateUnlimitedPass, 
    showToast 
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'creator' | 'unlimited'>('creator');
  const [promoCode, setPromoCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'starter' as const,
      name: 'Starter Refill',
      price: 49,
      credits: 5,
      unitPrice: '₹9.8 / design',
      badge: 'Quick Test',
      features: [
        '5 High-Resolution AI Generations',
        '240 GSM Fabric Virtual Try-On',
        'Standard GPU rendering pipeline',
      ],
      popular: false,
    },
    {
      id: 'creator' as const,
      name: 'Creator Pack',
      price: 99,
      credits: 15,
      unitPrice: '₹6.6 / design',
      badge: 'Most Popular',
      features: [
        '15 High-Resolution AI Generations',
        'Priority GPU synthesis speed',
        '1200 DPI DTG vector print ready',
        'Full Personal Wardrobe saving',
      ],
      popular: true,
    },
    {
      id: 'unlimited' as const,
      name: 'Pro Studio Pass',
      price: 299,
      credits: 9999,
      unitPrice: 'Unlimited (30 Days)',
      badge: 'Infinite Tokens',
      features: [
        'Unlimited AI Generations for 30 Days',
        'Zero token caps or wait times',
        'Instant virtual try-on on any body type',
        'VIP creator drops listing access',
      ],
      popular: false,
    },
  ];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'FOUNDER' || code === 'FREE' || code === 'WEARVERSE' || code === 'CREATOR') {
      addCredits(10);
      showToast('success', 'Promo Code Applied! 🎁', 'Enjoy +10 bonus AI generation tokens on us!');
      closeModal();
    } else if (code === 'UNLIMITED' || code === 'VIP') {
      activateUnlimitedPass();
      showToast('success', 'VIP Code Activated! 👑', 'Unlimited creator pass unlocked.');
      closeModal();
    } else {
      showToast('error', 'Invalid Code', 'Try code "FOUNDER" for 10 free generations.');
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    
    // Simulate payment gateway (Razorpay / UPI)
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedPlan === 'unlimited') {
        activateUnlimitedPass();
      } else if (selectedPlan === 'creator') {
        addCredits(15);
      } else {
        addCredits(5);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0c101d] rounded-3xl shadow-2xl border border-indigo-500/30 overflow-hidden flex flex-col max-h-[92vh] text-slate-100 ring-1 ring-white/10">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#121626]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 font-extrabold text-[11px] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              Token Refill & Quota
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Protecting compute & token bandwidth
            </span>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Header Banner */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              {creditsRemaining === 0 ? 'Free Generation Quota Reached' : 'Refill AI Generation Tokens'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              To guarantee fast response times and 1200 DPI streetwear rendering, each account starts with <strong className="text-white">3 free AI designs</strong>. Refill tokens below to continue crafting custom pieces.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs mt-2">
              <span className="text-slate-400">Current Status:</span>
              {hasUnlimitedPass ? (
                <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> Unlimited Pass Active
                </span>
              ) : creditsRemaining > 0 ? (
                <span className="font-bold text-amber-400">
                  {creditsRemaining} / 3 Free Generations Left
                </span>
              ) : (
                <span className="font-bold text-rose-400">
                  0 Generations Left (Tokens Exhausted)
                </span>
              )}
            </div>
          </div>

          {/* Pricing Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-gradient-to-b from-indigo-950/60 to-[#141829] border-indigo-500 shadow-xl shadow-indigo-600/15 ring-1 ring-indigo-500/50' 
                      : 'bg-[#131726]/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                      BEST VALUE
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        {plan.badge}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-400 bg-indigo-600' : 'border-slate-700'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white font-['Space_Grotesk']">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-white">₹{plan.price}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{plan.unitPrice}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <div className={`w-full py-2 rounded-xl text-center text-xs font-bold transition ${
                      isSelected 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promo code bar */}
          <form onSubmit={handleApplyPromo} className="flex items-center gap-2 p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <Gift className="w-4 h-4 text-indigo-400 ml-1 flex-shrink-0" />
            <input 
              type="text" 
              value={promoCode} 
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Have a voucher or promo code? (Try: FOUNDER)" 
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none flex-1"
            />
            <button 
              type="submit"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
            >
              Apply
            </button>
          </form>

        </div>

        {/* Modal Footer / Checkout Action */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0e1220] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Instant activation via UPI, GPay, PhonePe, Cards & NetBanking</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={closeModal}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activating Tokens...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    Pay ₹{plans.find(p => p.id === selectedPlan)?.price} & Refill
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
