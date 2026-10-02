import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  Plus, 
  Minus,
  Sparkles,
  CreditCard,
  QrCode,
  Smartphone,
  Mail,
  Lock,
  ArrowLeft,
  Download,
  Phone,
  Ruler
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Design, TShirtSize, Order } from '../../types';
import { useApp } from '../../context/AppContext';

interface OrderModalProps {
  design: Design;
  initialColor?: string;
  initialSize?: TShirtSize;
}

export interface ClothMaterial {
  id: string;
  name: string;
  gsm: number;
  badge: string;
  description: string;
  extraPrice: number;
}

const materialOptions: ClothMaterial[] = [
  {
    id: 'heavy-cotton-240',
    name: '240 GSM Combed Cotton',
    gsm: 240,
    badge: 'Signature Boxy',
    description: '100% Ring-Spun Compact Cotton. Dense drop-shoulder streetwear drape with DTG print fidelity.',
    extraPrice: 0,
  },
  {
    id: 'french-terry-280',
    name: '280 GSM French Terry Fleece',
    gsm: 280,
    badge: 'Ultra Heavy',
    description: 'Dense heavyweight luxury knit with looped interior. Extreme silhouette structure and warmth.',
    extraPrice: 200,
  },
  {
    id: 'acid-wash-220',
    name: '220 GSM Acid Wash Cotton',
    gsm: 220,
    badge: 'Vintage Wash',
    description: 'Bio-silicon enzyme wash with authentic vintage micro-fade and velvety hand feel.',
    extraPrice: 150,
  },
  {
    id: 'supima-180',
    name: '180 GSM Supima Cotton',
    gsm: 180,
    badge: 'Silky Breathable',
    description: 'Extra-long staple American Pima cotton. Ultra-soft featherlight feel for tropical daily wear.',
    extraPrice: 0,
  },
];

export const OrderModal: React.FC<OrderModalProps> = ({ 
  design, 
  initialColor = design.defaultColor || '#0f0f11',
  initialSize = 'L'
}) => {
  const { user, closeModal, placeOrder, setCurrentPage, theme } = useApp();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [selectedSize, setSelectedSize] = useState<TShirtSize>(initialSize);
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [selectedMaterial, setSelectedMaterial] = useState<ClothMaterial>(materialOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'gpay' | 'card'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Delivery Form State
  const [formData, setFormData] = useState({
    fullName: user.name && user.name !== 'Guest User' ? user.name : '',
    phoneNumber: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const colorOptions = [
    { label: 'Onyx Black', hex: '#0f0f11' },
    { label: 'Cloud White', hex: '#ffffff' },
    { label: 'Slate Charcoal', hex: '#334155' },
    { label: 'Midnight Navy', hex: '#1e293b' },
    { label: 'Crimson Red', hex: '#7f1d1d' },
    { label: 'Sage Green', hex: '#788f78' },
  ];

  const sizeDetails: Record<TShirtSize, { label: string; chest: string; length: string }> = {
    'S': { label: 'S', chest: '38 in / 96 cm', length: '27 in / 68 cm' },
    'M': { label: 'M', chest: '40 in / 101 cm', length: '28 in / 71 cm' },
    'L': { label: 'L (Most Popular)', chest: '42 in / 106 cm', length: '29 in / 74 cm' },
    'XL': { label: 'XL (Oversized)', chest: '44 in / 112 cm', length: '30 in / 76 cm' },
    'XXL': { label: 'XXL (Boxy Drape)', chest: '46 in / 117 cm', length: '31 in / 79 cm' },
  };

  const unitPrice = design.price + selectedMaterial.extraPrice;
  const subtotal = unitPrice * quantity;
  const deliveryFee = 0; // Free promotional shipping
  const totalAmount = subtotal + deliveryFee;

  const validateDetails = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.phoneNumber.trim()) errs.phoneNumber = 'Phone Number is required';
    if (!formData.address.trim()) errs.address = 'Street Address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length < 6) errs.pincode = 'Valid 6-digit Pincode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) return;
    setStep('payment');
  };

  const handleExecutePayment = async () => {
    setIsProcessingPayment(true);
    await new Promise(r => setTimeout(r, 900));

    const paymentId = `PAY_${Math.floor(100000 + Math.random() * 900000)}`;

    const order = placeOrder({
      design,
      color: selectedColor,
      size: selectedSize,
      material: selectedMaterial.name,
      materialGsm: selectedMaterial.gsm,
      quantity,
      customer: formData,
      paymentMethod: paymentMethod === 'upi' ? 'UPI (Google Pay / PhonePe)' : (paymentMethod === 'card' ? 'Credit / Debit Card' : 'Google Pay Instant'),
      paymentId,
    });

    setIsProcessingPayment(false);
    setCompletedOrder(order);
    setStep('success');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#6366f1', '#10b981', '#a855f7', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto backdrop-blur-xl animate-in fade-in duration-200 ${
      theme === 'dark' ? 'bg-slate-950/85' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[96vh] flex flex-col border transition-colors ${
        theme === 'dark' 
          ? 'bg-[#0d111d] border-slate-700/80 text-slate-100 ring-1 ring-white/10' 
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30 ring-1 ring-slate-900/5'
      }`}>
        
        {/* Modal Header */}
        <div className={`px-5 sm:px-6 py-4 border-b backdrop-blur-md flex items-center justify-between transition-colors ${
          theme === 'dark' ? 'border-slate-800 bg-[#121626]/80' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button 
                onClick={() => setStep('details')} 
                className={`p-1.5 rounded-xl transition mr-1 ${
                  theme === 'dark' 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 flex-shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-sm sm:text-base font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-950'
              }`}>
                {step === 'details' && 'Configure & Order Your T-Shirt'}
                {step === 'payment' && 'Verified Secure Payment'}
                {step === 'success' && 'Order Confirmed & Sent to Print!'}
              </h2>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {step === 'details' && '240 GSM 100% Combed Cotton • Free 24h Dispatch'}
                {step === 'payment' && `Total Amount: ₹${totalAmount.toLocaleString()} • 256-bit SSL Protected`}
                {step === 'success' && `Owner notified for physical printing and handover`}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className={`p-2 rounded-xl transition ${
              theme === 'dark' 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* STEP 1: CONFIGURE & DELIVERY DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              
              {/* Product Preview Strip */}
              <div className={`p-4 rounded-2xl border flex gap-4 items-center transition-colors ${
                theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <img 
                  src={design.frontImage} 
                  alt={design.title} 
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border flex-shrink-0 shadow-md ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      theme === 'dark' 
                        ? 'text-indigo-400 bg-indigo-950/80 border-indigo-500/30' 
                        : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                    }`}>
                      240 GSM Combed Cotton
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      theme === 'dark' 
                        ? 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30' 
                        : 'text-emerald-700 bg-emerald-100 border-emerald-300'
                    }`}>
                      1200 DPI DTG
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold truncate ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>{design.title}</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`text-base font-extrabold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-950'
                    }`}>₹{design.price.toLocaleString()}</span>
                    <span className={`text-xs line-through ${
                      theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>₹2,499</span>
                    <span className={`text-[10px] font-bold ${
                      theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>40% OFF Studio Special</span>
                  </div>
                </div>
              </div>

              {/* Garment Color Selection */}
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <span>1. Garment Color</span>
                  <span className={`font-semibold text-xs lowercase ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    {colorOptions.find(c => c.hex === selectedColor)?.label || 'Custom Color'}
                  </span>
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setSelectedColor(c.hex)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        selectedColor === c.hex 
                          ? (theme === 'dark' ? 'border-indigo-500 bg-indigo-950/50 text-white shadow-sm ring-1 ring-indigo-500' : 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm ring-1 ring-indigo-600') 
                          : (theme === 'dark' ? 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300')
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-slate-400 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection with Measurements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    2. Streetwear Size (Oversized Boxy Cut)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className={`text-xs flex items-center gap-1 font-semibold ${
                      theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeGuide ? 'Hide Measurements' : 'Size Measurements'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {(['S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-1.5 sm:p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center min-h-[46px] sm:min-h-[50px] ${
                        selectedSize === sz
                          ? 'border-indigo-600 bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/30'
                          : (theme === 'dark' ? 'border-slate-800 bg-[#141826] text-slate-300 hover:text-white hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300')
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{sz}</span>
                      <span className={`text-[9px] sm:text-[10px] mt-0.5 truncate ${selectedSize === sz ? 'text-indigo-100' : (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}`}>
                        {sizeDetails[sz].chest.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                {showSizeGuide && (
                  <div className={`p-3 rounded-xl border text-xs space-y-1 animate-in fade-in duration-150 ${
                    theme === 'dark' ? 'bg-[#141826] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <p className={`font-bold text-[11px] uppercase tracking-wider mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      Boxy Heavyweight Fit Specs:
                    </p>
                    <div className={`grid grid-cols-3 text-[11px] border-b pb-1 font-semibold ${
                      theme === 'dark' ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'
                    }`}>
                      <span>Size</span>
                      <span>Chest Width</span>
                      <span>Garment Length</span>
                    </div>
                    {Object.entries(sizeDetails).map(([sz, details]) => (
                      <div key={sz} className="grid grid-cols-3 text-[11px] py-0.5">
                        <span className={`font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>{sz}</span>
                        <span>{details.chest}</span>
                        <span>{details.length}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clothe Fabric & Material Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    3. Clothe Fabric & Material
                  </label>
                  <span className={`font-semibold text-xs ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    {selectedMaterial.name} ({selectedMaterial.gsm} GSM)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {materialOptions.map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setSelectedMaterial(mat)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
                        selectedMaterial.id === mat.id
                          ? (theme === 'dark' ? 'border-indigo-500 bg-indigo-950/60 ring-1 ring-indigo-500 text-white shadow-md' : 'border-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-600 text-indigo-950 shadow-md')
                          : (theme === 'dark' ? 'border-slate-800 bg-[#141826] text-slate-300 hover:text-white hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50/60 shadow-sm')
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{mat.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                        }`}>
                          {mat.badge}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-snug ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {mat.description}
                      </p>
                      <div className={`text-[10px] font-semibold pt-0.5 ${
                        theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        {mat.extraPrice > 0 ? `+₹${mat.extraPrice} Upgrade` : 'Included Free'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  4. Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className={`p-1.5 rounded-lg disabled:opacity-40 transition active:scale-95 ${
                      theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className={`text-sm font-extrabold w-6 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className={`p-1.5 rounded-lg transition active:scale-95 ${
                      theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Delivery Address Fields */}
              <div className="space-y-3 pt-2">
                <label className={`text-xs font-bold uppercase tracking-wider block ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  5. Shipping & Handover Details
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-[11px] font-semibold mb-1 block ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Full Name</label>
                    <input 
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your full name"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs outline-none transition ${
                        theme === 'dark' 
                          ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600' 
                          : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
                      }`}
                    />
                    {errors.fullName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className={`text-[11px] font-semibold mb-1 block ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Phone Number (for Handover)</label>
                    <input 
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs outline-none transition ${
                        theme === 'dark' 
                          ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600' 
                          : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
                      }`}
                    />
                    {errors.phoneNumber && <p className="text-[10px] text-rose-500 mt-0.5">{errors.phoneNumber}</p>}
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] font-semibold mb-1 block ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Street Address</label>
                  <input 
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Flat number, building, street, area"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs outline-none transition ${
                      theme === 'dark' 
                        ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600' 
                        : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-rose-500 mt-0.5">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div>
                    <label className={`text-[11px] font-semibold mb-1 block ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>City</label>
                    <input 
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs outline-none transition ${
                        theme === 'dark' 
                          ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600' 
                          : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
                      }`}
                    />
                    {errors.city && <p className="text-[10px] text-rose-500 mt-0.5">{errors.city}</p>}
                  </div>
                  <div>
                    <label className={`text-[11px] font-semibold mb-1 block ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Pincode</label>
                    <input 
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="6 digits"
                      maxLength={6}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs outline-none transition ${
                        theme === 'dark' 
                          ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600' 
                          : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
                      }`}
                    />
                    {errors.pincode && <p className="text-[10px] text-rose-500 mt-0.5">{errors.pincode}</p>}
                  </div>
                  <div>
                    <label className={`text-[11px] font-semibold mb-1 block ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>State</label>
                    <input 
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs outline-none transition ${
                        theme === 'dark' 
                          ? 'bg-[#141826] border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-600' 
                          : 'bg-white border-slate-300 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown & Proceed */}
              <div className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                theme === 'dark' ? 'bg-[#121624] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`flex justify-between text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="flex items-center gap-1">
                    <Truck className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span>Free Express Shipping</span>
                  </span>
                  <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>FREE</span>
                </div>
                <div className={`flex justify-between text-sm font-extrabold pt-2 border-t ${
                  theme === 'dark' ? 'text-white border-slate-800' : 'text-slate-950 border-slate-200'
                }`}>
                  <span>Total Payable:</span>
                  <span className={`text-base font-black ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment (₹{totalAmount.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* STEP 2: VERIFIED SECURE PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Payment Summary Header */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                theme === 'dark' ? 'bg-[#141826] border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
              }`}>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    Total Amount
                  </span>
                  <p className={`text-2xl font-black ${
                    theme === 'dark' ? 'text-white' : 'text-slate-950'
                  }`}>₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold block ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                  }`}>{design.title}</span>
                  <span className={`text-[11px] ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>Size {selectedSize} • {selectedMaterial.name} • {quantity} Unit{quantity > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2.5">
                <label className={`text-xs font-bold uppercase tracking-wider block ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Select Payment Method (Instant Verification)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      paymentMethod === 'upi'
                        ? (theme === 'dark' ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-md ring-1 ring-indigo-500' : 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md ring-1 ring-indigo-600')
                        : (theme === 'dark' ? 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm')
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className={`text-xs font-bold ${
                        paymentMethod === 'upi' ? (theme === 'dark' ? 'text-white' : 'text-indigo-950') : (theme === 'dark' ? 'text-white' : 'text-slate-900')
                      }`}>UPI QR Code</p>
                      <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>GPay, PhonePe, Paytm</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gpay')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      paymentMethod === 'gpay'
                        ? (theme === 'dark' ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-md ring-1 ring-indigo-500' : 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md ring-1 ring-indigo-600')
                        : (theme === 'dark' ? 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm')
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className={`text-xs font-bold ${
                        paymentMethod === 'gpay' ? (theme === 'dark' ? 'text-white' : 'text-indigo-950') : (theme === 'dark' ? 'text-white' : 'text-slate-900')
                      }`}>Direct UPI App</p>
                      <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Instant Redirect</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      paymentMethod === 'card'
                        ? (theme === 'dark' ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-md ring-1 ring-indigo-500' : 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-md ring-1 ring-indigo-600')
                        : (theme === 'dark' ? 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm')
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-violet-500 flex-shrink-0" />
                    <div>
                      <p className={`text-xs font-bold ${
                        paymentMethod === 'card' ? (theme === 'dark' ? 'text-white' : 'text-indigo-950') : (theme === 'dark' ? 'text-white' : 'text-slate-900')
                      }`}>Cards / Netbanking</p>
                      <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Visa, Mastercard, RuPay</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* UPI QR Simulation or Card Fields */}
              {paymentMethod === 'upi' && (
                <div className={`p-5 rounded-2xl border flex flex-col items-center text-center space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-200">
                    {/* Simulated SVG QR Code */}
                    <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                      <rect x="14" y="14" width="17" height="17" fill="white" />
                      <rect x="17" y="17" width="11" height="11" fill="#0f172a" />
                      
                      <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                      <rect x="69" y="14" width="17" height="17" fill="white" />
                      <rect x="72" y="17" width="11" height="11" fill="#0f172a" />
                      
                      <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                      <rect x="14" y="69" width="17" height="17" fill="white" />
                      <rect x="17" y="72" width="11" height="11" fill="#0f172a" />
                      
                      {/* Random QR clusters */}
                      <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                      <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
                      <rect x="42" y="42" width="16" height="16" fill="#4f46e5" />
                      <rect x="68" y="45" width="8" height="8" fill="#0f172a" />
                      <rect x="80" y="55" width="6" height="6" fill="#0f172a" />
                      <rect x="45" y="68" width="10" height="10" fill="#0f172a" />
                      <rect x="62" y="72" width="8" height="8" fill="#0f172a" />
                      <rect x="78" y="78" width="10" height="10" fill="#0f172a" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>Scan with Google Pay, PhonePe, or Paytm</p>
                    <p className={`text-[11px] mt-0.5 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>UPI ID: <span className={`font-mono font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>wearverse.pay@icici</span></p>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <label className={`text-[11px] font-semibold mb-1 block ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>Card Number</label>
                    <input 
                      type="text" 
                      defaultValue="4532 •••• •••• 8920" 
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs font-mono outline-none ${
                        theme === 'dark' ? 'bg-[#0f121e] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-[11px] font-semibold mb-1 block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>Expiry</label>
                      <input 
                        type="text" 
                        defaultValue="08/28" 
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs font-mono outline-none ${
                          theme === 'dark' ? 'bg-[#0f121e] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-[11px] font-semibold mb-1 block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>CVV</label>
                      <input 
                        type="password" 
                        defaultValue="•••" 
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs font-mono outline-none ${
                          theme === 'dark' ? 'bg-[#0f121e] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'gpay' && (
                <div className={`p-4 rounded-2xl border space-y-2 text-center transition-colors ${
                  theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>Enter UPI ID for intent trigger:</p>
                  <input 
                    type="text" 
                    placeholder="user@okhdfcbank"
                    className={`w-full max-w-xs mx-auto px-3.5 py-2.5 rounded-xl border text-base sm:text-xs font-mono outline-none text-center ${
                      theme === 'dark' ? 'bg-[#0f121e] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                    }`}
                  />
                </div>
              )}

              {/* 256-bit SSL Security Guarantee */}
              <div className={`flex items-center justify-center gap-2 text-[11px] font-medium ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit Bank-Grade Encryption • 100% Payment Guarantee</span>
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Verifying Payment with Bank...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{totalAmount.toLocaleString()} & Confirm Physical Order</span>
                  </>
                )}
              </button>

            </div>
          )}

          {/* STEP 3: SUCCESS & EMAIL HANDOVER ALERT DISPATCHED */}
          {step === 'success' && completedOrder && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className={`text-xl sm:text-2xl font-black font-['Space_Grotesk'] ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  Payment Verified & Order Confirmed!
                </h3>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Order Number: <strong className={`font-mono text-sm ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>{completedOrder.orderNumber}</strong>
                </p>
              </div>

              {/* Handover Alert Notice */}
              <div className={`p-4 rounded-2xl border text-left space-y-2 transition-colors ${
                theme === 'dark' 
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-slate-300' 
                  : 'bg-indigo-50/80 border-indigo-200 text-slate-800'
              }`}>
                <div className={`flex items-center gap-2 font-bold text-xs ${
                  theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                }`}>
                  <Mail className="w-4 h-4" />
                  <span>Production Dispatch & Fulfillment Alert:</span>
                </div>
                <p className={`text-[11px] leading-relaxed ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  "A new paid order (<strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{completedOrder.orderNumber}</strong>) has been confirmed for <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{completedOrder.customer.fullName}</strong> for <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{completedOrder.designTitle}</strong> (Fabric: <span className={`font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>{completedOrder.material || selectedMaterial.name}</span>, Size: {completedOrder.size}, Color: {completedOrder.color}, Total: ₹{completedOrder.totalAmount}). High-resolution print files synthesized and scheduled for 1200 DPI DTG curing."
                </p>
                <div className={`text-[10px] font-semibold flex items-center gap-1.5 pt-1 ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fulfillment Pipeline Active • Handover Scheduled</span>
                </div>
              </div>

              {/* Order Tracking Steps */}
              <div className={`p-4 rounded-2xl border text-left space-y-3 transition-colors ${
                theme === 'dark' ? 'bg-[#141826] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Live Production & Handover Status
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">✓</div>
                    <div className="flex-1">
                      <span className={`font-semibold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Payment Verified (₹{completedOrder.totalAmount})
                      </span>
                      <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {completedOrder.paymentMethod} • ID: {completedOrder.paymentId}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] animate-pulse">⚡</div>
                    <div className="flex-1">
                      <span className={`font-semibold block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        In Production ({completedOrder.material || selectedMaterial.name})
                      </span>
                      <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        1200 DPI DTG Vector Curing
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-600'
                    }`}>3</div>
                    <div className="flex-1">
                      <span className={`font-semibold block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
                        Physical Handover / Dispatch
                      </span>
                      <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                        {completedOrder.customer.address}, {completedOrder.customer.city}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    closeModal();
                    setCurrentPage('orders');
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition active:scale-95 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View in My Orders & Handover</span>
                </button>

                <button
                  onClick={closeModal}
                  className={`py-3 px-5 rounded-2xl font-semibold text-xs transition ${
                    theme === 'dark' 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  Close & Continue Creating
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
