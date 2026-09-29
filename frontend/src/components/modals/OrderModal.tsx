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
  const { user, closeModal, placeOrder, setCurrentPage } = useApp();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0d111d] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden max-h-[92vh] sm:max-h-[96vh] flex flex-col text-slate-100 ring-1 ring-white/10">
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-[#121626]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button 
                onClick={() => setStep('details')} 
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 flex-shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
                {step === 'details' && 'Configure & Order Your T-Shirt'}
                {step === 'payment' && 'Verified Secure Payment'}
                {step === 'success' && 'Order Confirmed & Sent to Print!'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {step === 'details' && '240 GSM 100% Combed Cotton • Free 24h Dispatch'}
                {step === 'payment' && `Total Amount: ₹${totalAmount.toLocaleString()} • 256-bit SSL Protected`}
                {step === 'success' && `Owner notified for physical printing and handover`}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
              <div className="p-4 rounded-2xl bg-[#141826] border border-slate-800 flex gap-4 items-center">
                <img 
                  src={design.frontImage} 
                  alt={design.title} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-900 border border-slate-700 flex-shrink-0 shadow-md"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      240 GSM Combed Cotton
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      1200 DPI DTG
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">{design.title}</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-base font-extrabold text-white">₹{design.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 line-through">₹2,499</span>
                    <span className="text-[10px] text-emerald-400 font-bold">40% OFF Studio Special</span>
                  </div>
                </div>
              </div>

              {/* Garment Color Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Garment Color</span>
                  <span className="text-indigo-400 font-semibold text-xs lowercase">
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
                          ? 'border-indigo-500 bg-indigo-950/50 text-white shadow-sm ring-1 ring-indigo-500' 
                          : 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-inner flex-shrink-0"
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
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    2. Streetwear Size (Oversized Boxy Cut)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
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
                          ? 'border-indigo-500 bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/30'
                          : 'border-slate-800 bg-[#141826] text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{sz}</span>
                      <span className={`text-[9px] sm:text-[10px] mt-0.5 truncate ${selectedSize === sz ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {sizeDetails[sz].chest.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                {showSizeGuide && (
                  <div className="p-3 bg-[#141826] rounded-xl border border-slate-800 text-xs space-y-1 animate-in fade-in duration-150">
                    <p className="font-bold text-white text-[11px] uppercase tracking-wider mb-1">
                      Boxy Heavyweight Fit Specs:
                    </p>
                    <div className="grid grid-cols-3 text-[11px] text-slate-400 border-b border-slate-800 pb-1 font-semibold">
                      <span>Size</span>
                      <span>Chest Width</span>
                      <span>Garment Length</span>
                    </div>
                    {Object.entries(sizeDetails).map(([sz, details]) => (
                      <div key={sz} className="grid grid-cols-3 text-[11px] text-slate-300 py-0.5">
                        <span className="font-bold text-indigo-400">{sz}</span>
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
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    3. Clothe Fabric & Material
                  </label>
                  <span className="text-indigo-400 font-semibold text-xs">
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
                          ? 'border-indigo-500 bg-indigo-950/60 ring-1 ring-indigo-500 text-white shadow-md'
                          : 'border-slate-800 bg-[#141826] text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{mat.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {mat.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {mat.description}
                      </p>
                      <div className="text-[10px] font-semibold text-emerald-400 pt-0.5">
                        {mat.extraPrice > 0 ? `+₹${mat.extraPrice} Upgrade` : 'Included Free'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141826] border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  4. Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-extrabold text-white w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Delivery Address Fields */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  5. Shipping & Handover Details
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Full Name</label>
                    <input 
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141826] border border-slate-800 focus:border-indigo-500 text-base sm:text-xs text-white placeholder:text-slate-600 outline-none transition"
                    />
                    {errors.fullName && <p className="text-[10px] text-rose-400 mt-0.5">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Phone Number (for Handover)</label>
                    <input 
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141826] border border-slate-800 focus:border-indigo-500 text-base sm:text-xs text-white placeholder:text-slate-600 outline-none transition"
                    />
                    {errors.phoneNumber && <p className="text-[10px] text-rose-400 mt-0.5">{errors.phoneNumber}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Street Address</label>
                  <input 
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Flat number, building, street, area"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141826] border border-slate-800 focus:border-indigo-500 text-base sm:text-xs text-white placeholder:text-slate-600 outline-none transition"
                  />
                  {errors.address && <p className="text-[10px] text-rose-400 mt-0.5">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold mb-1 block">City</label>
                    <input 
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141826] border border-slate-800 focus:border-indigo-500 text-base sm:text-xs text-white placeholder:text-slate-600 outline-none transition"
                    />
                    {errors.city && <p className="text-[10px] text-rose-400 mt-0.5">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Pincode</label>
                    <input 
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="6 digits"
                      maxLength={6}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141826] border border-slate-800 focus:border-indigo-500 text-base sm:text-xs text-white placeholder:text-slate-600 outline-none transition"
                    />
                    {errors.pincode && <p className="text-[10px] text-rose-400 mt-0.5">{errors.pincode}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold mb-1 block">State</label>
                    <input 
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141826] border border-slate-800 focus:border-indigo-500 text-base sm:text-xs text-white placeholder:text-slate-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown & Proceed */}
              <div className="p-4 rounded-2xl bg-[#121624] border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span className="text-white font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Free Express Shipping</span>
                  </span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total Payable:</span>
                  <span className="text-base text-indigo-400 font-black">₹{totalAmount.toLocaleString()}</span>
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
              <div className="p-4 rounded-2xl bg-[#141826] border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">
                    Total Amount
                  </span>
                  <p className="text-2xl font-black text-white">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-300 block">{design.title}</span>
                  <span className="text-[11px] text-slate-400">Size {selectedSize} • {selectedMaterial.name} • {quantity} Unit{quantity > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Payment Method (Instant Verification)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-md ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">UPI QR Code</p>
                      <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gpay')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      paymentMethod === 'gpay'
                        ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-md ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Direct UPI App</p>
                      <p className="text-[10px] text-slate-400">Instant Redirect</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-md ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-[#141826] text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Cards / Netbanking</p>
                      <p className="text-[10px] text-slate-400">Visa, Mastercard, RuPay</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* UPI QR Simulation or Card Fields */}
              {paymentMethod === 'upi' && (
                <div className="p-5 rounded-2xl bg-[#141826] border border-slate-800 flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-white rounded-2xl shadow-xl">
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
                    <p className="text-xs font-bold text-white">Scan with Google Pay, PhonePe, or Paytm</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">UPI ID: <span className="font-mono text-indigo-400">wearverse.pay@icici</span></p>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-[#141826] border border-slate-800 space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Card Number</label>
                    <input 
                      type="text" 
                      defaultValue="4532 •••• •••• 8920" 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f121e] border border-slate-800 text-base sm:text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Expiry</label>
                      <input 
                        type="text" 
                        defaultValue="08/28" 
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f121e] border border-slate-800 text-base sm:text-xs text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold mb-1 block">CVV</label>
                      <input 
                        type="password" 
                        defaultValue="•••" 
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f121e] border border-slate-800 text-base sm:text-xs text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'gpay' && (
                <div className="p-4 rounded-2xl bg-[#141826] border border-slate-800 space-y-2 text-center">
                  <p className="text-xs font-semibold text-slate-300">Enter UPI ID for intent trigger:</p>
                  <input 
                    type="text" 
                    placeholder="user@okhdfcbank"
                    className="w-full max-w-xs mx-auto px-3.5 py-2.5 rounded-xl bg-[#0f121e] border border-slate-800 text-base sm:text-xs text-white font-mono outline-none text-center"
                  />
                </div>
              )}

              {/* 256-bit SSL Security Guarantee */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400">
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
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
                  Payment Verified & Order Confirmed!
                </h3>
                <p className="text-xs text-slate-400">
                  Order Number: <strong className="text-indigo-400 font-mono text-sm">{completedOrder.orderNumber}</strong>
                </p>
              </div>

              {/* Handover Alert Notice (What the user specifically wanted) */}
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-left space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>Production Dispatch & Fulfillment Alert:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  "A new paid order (<strong className="text-white">{completedOrder.orderNumber}</strong>) has been confirmed for <strong className="text-white">{completedOrder.customer.fullName}</strong> for <strong className="text-white">{completedOrder.designTitle}</strong> (Fabric: <span className="text-indigo-300 font-bold">{completedOrder.material || selectedMaterial.name}</span>, Size: {completedOrder.size}, Color: {completedOrder.color}, Total: ₹{completedOrder.totalAmount}). High-resolution print files synthesized and scheduled for 1200 DPI DTG curing."
                </p>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fulfillment Pipeline Active • Handover Scheduled</span>
                </div>
              </div>

              {/* Order Tracking Steps */}
              <div className="p-4 rounded-2xl bg-[#141826] border border-slate-800 text-left space-y-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Production & Handover Status
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">✓</div>
                    <div className="flex-1">
                      <span className="text-white font-semibold block">Payment Verified (₹{completedOrder.totalAmount})</span>
                      <span className="text-[10px] text-slate-400">{completedOrder.paymentMethod} • ID: {completedOrder.paymentId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] animate-pulse">⚡</div>
                    <div className="flex-1">
                      <span className="text-white font-semibold block">In Production ({completedOrder.material || selectedMaterial.name})</span>
                      <span className="text-[10px] text-slate-400">1200 DPI DTG Vector Curing</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-[10px]">3</div>
                    <div className="flex-1">
                      <span className="text-slate-300 font-semibold block">Physical Handover / Dispatch</span>
                      <span className="text-[10px] text-slate-500">{completedOrder.customer.address}, {completedOrder.customer.city}</span>
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
                  className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
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
