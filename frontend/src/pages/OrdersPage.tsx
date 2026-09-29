import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  ArrowRight, 
  Calendar,
  Download,
  Phone,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const OrdersPage: React.FC = () => {
  const { user, orders, isLoggedIn, openAuthModal, setCurrentPage, openAdminOrdersModal, showToast, theme } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-4 transition-colors ${
        theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}>
        <div className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl text-center space-y-5 ${
          theme === 'dark' ? 'bg-[#141824] border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/15 border border-indigo-500/40 text-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className={`text-2xl font-black font-['Space_Grotesk'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              Sign In to View Orders
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Track the live progress of your custom T-shirts from verified payment to 240 GSM DTG printing and doorstep delivery.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 !text-white text-white-force font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95"
            >
              Sign In to View Orders
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className={`w-full py-2.5 text-xs font-semibold transition ${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === 'All') return true;
    return order.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  const handleDownloadInvoice = (orderNumber: string) => {
    showToast('success', 'Invoice Downloaded', `Official receipt for ${orderNumber} has been downloaded.`);
  };

  const handleTrackShipment = (orderNumber: string) => {
    showToast('info', 'Live Tracking', `Order ${orderNumber} is assigned to Express Bluedart Courier. Live tracking SMS dispatched.`);
  };

  return (
    <div className={`min-h-screen font-['Plus_Jakarta_Sans',sans-serif] pb-24 transition-colors ${
      theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* HEADER SECTION */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
          theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>Track Purchases & Deliveries</span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              My Orders & Handover
            </h1>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Track the live progress of your custom T-shirts from verified payment to 240 GSM heavy cotton DTG printing and doorstep delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {user?.role === 'admin' && (
              <button
                onClick={openAdminOrdersModal}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border font-bold text-xs shadow-lg transition active:scale-95 ${
                  theme === 'dark' 
                    ? 'bg-amber-950/40 hover:bg-amber-950/70 border-amber-500/40 text-amber-300 hover:text-amber-200' 
                    : 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 shadow-sm'
                }`}
                title="Solo Founder Order Management & DTG Print Downloads"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>👑 Store Manager (Admin)</span>
              </button>
            )}

            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 !text-white text-white-force font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 !text-white text-white-force" />
              <span>Create New Design</span>
              <ArrowRight className="w-4 h-4 !text-white text-white-force" />
            </button>
          </div>
        </div>

        {/* 3 STAT CARDS: Easy high-level summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            theme === 'dark' ? 'bg-[#141824] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 text-indigo-500 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Total Orders</p>
              <p className={`text-lg font-black font-['Space_Grotesk'] ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{orders.length} Items</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            theme === 'dark' ? 'bg-[#141824] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Payment Status</p>
              <p className="text-lg font-black text-emerald-500 font-['Space_Grotesk']">100% Paid (Verified)</p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            theme === 'dark' ? 'bg-[#141824] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-violet-600/15 text-violet-500 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Estimated Handover</p>
              <p className={`text-lg font-black font-['Space_Grotesk'] ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>Within 2-3 Days</p>
            </div>
          </div>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'In Production', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 flex-shrink-0 ${
                selectedStatus === status
                  ? 'bg-indigo-600 !text-white text-white-force shadow-md shadow-indigo-600/30'
                  : theme === 'dark'
                    ? 'bg-[#141824] text-slate-400 hover:text-white border border-slate-800'
                    : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200 shadow-sm'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* ORDERS LIST */}
        {filteredOrders.length === 0 ? (
          <div className={`py-20 text-center space-y-4 rounded-3xl border p-8 ${
            theme === 'dark' ? 'bg-[#141824] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center mx-auto ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>No orders found</h3>
              <p className={`text-xs max-w-sm mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                You haven't placed any T-shirt orders yet. Create your dream design in the AI Studio or explore trending drops!
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentPage('home')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 !text-white text-white-force text-xs font-bold rounded-xl shadow-md transition"
              >
                Design with AI
              </button>
              <button
                onClick={() => setCurrentPage('explore')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                Explore Drops
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const isDelivered = order.status === 'Delivered';
              return (
                <div 
                  key={order.id}
                  className={`rounded-3xl border shadow-xl overflow-hidden p-5 sm:p-6 space-y-5 transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#141824] border-slate-800'
                      : 'bg-white border-slate-200 shadow-slate-200/50'
                  }`}
                >
                  {/* Order Top Summary Bar */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3 ${
                    theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
                  }`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm sm:text-base font-black font-['Space_Grotesk'] ${
                          theme === 'dark' ? 'text-white' : 'text-slate-950'
                        }`}>
                          {order.orderNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                          theme === 'dark'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          PAID • ₹{order.totalAmount.toLocaleString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                          theme === 'dark'
                            ? 'bg-slate-900 text-slate-400 border-slate-800'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {order.paymentMethod || 'UPI Instant'}
                        </span>
                      </div>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Placed on {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(order.orderNumber)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                          theme === 'dark'
                            ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border-slate-300 shadow-sm'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Invoice</span>
                      </button>
                      <button
                        onClick={() => handleTrackShipment(order.orderNumber)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                          theme === 'dark'
                            ? 'bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border-indigo-500/30'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200 shadow-sm'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Track</span>
                      </button>
                    </div>
                  </div>

                  {/* VISUAL 4-STEP TRACKING TIMELINE */}
                  <div className="py-2 px-1">
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      {/* Line connector */}
                      <div className={`absolute top-3.5 left-[12%] right-[12%] h-0.5 -z-0 ${
                        theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                      }`}>
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-500" 
                          style={{ width: isDelivered ? '100%' : '50%' }} 
                        />
                      </div>

                      {/* Step 1: Paid */}
                      <div className="space-y-1.5 relative z-10 flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-emerald-500/30">
                          ✓
                        </div>
                        <p className={`text-[10px] sm:text-xs font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>Payment Confirmed</p>
                        <p className="text-[9px] text-emerald-500 font-semibold hidden sm:block">UPI Verified</p>
                      </div>

                      {/* Step 2: In Production */}
                      <div className="space-y-1.5 relative z-10 flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40 animate-pulse">
                          ⚡
                        </div>
                        <p className={`text-[10px] sm:text-xs font-bold ${
                          theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'
                        }`}>In Production</p>
                        <p className={`text-[9px] hidden sm:block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>240 GSM DTG Print</p>
                      </div>

                      {/* Step 3: Dispatched */}
                      <div className="space-y-1.5 relative z-10 flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDelivered 
                            ? 'bg-emerald-500 text-white' 
                            : theme === 'dark' 
                              ? 'bg-slate-800 text-slate-400 border border-slate-700' 
                              : 'bg-slate-100 text-slate-500 border border-slate-300'
                        }`}>
                          🚚
                        </div>
                        <p className={`text-[10px] sm:text-xs font-bold ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>Dispatched</p>
                        <p className={`text-[9px] hidden sm:block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>Bluedart Express</p>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="space-y-1.5 relative z-10 flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDelivered 
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                            : theme === 'dark' 
                              ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                              : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}>
                          📦
                        </div>
                        <p className={`text-[10px] sm:text-xs font-bold ${
                          isDelivered 
                            ? 'text-emerald-500' 
                            : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {isDelivered ? 'Handed Over' : 'Delivery'}
                        </p>
                        <p className={`text-[9px] hidden sm:block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>Doorstep Handover</p>
                      </div>
                    </div>
                  </div>

                  {/* ORDER ITEM DETAILS & SHIPPING ADDRESS (Clean High Contrast in Light & Dark Modes) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Item Spec Card */}
                    <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0e111a] border-slate-800/80 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                    }`}>
                      <img 
                        src={order.designImage} 
                        alt={order.designTitle} 
                        className={`w-20 h-20 rounded-xl object-cover border shadow-md flex-shrink-0 ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-200'
                        }`}
                      />
                      <div className="space-y-1 min-w-0">
                        <h4 className={`font-bold text-sm truncate ${
                          theme === 'dark' ? 'text-white' : 'text-slate-950'
                        }`}>
                          {order.designTitle}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className={`px-2 py-0.5 rounded font-semibold ${
                            theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-white border border-slate-200 text-slate-700'
                          }`}>
                            Size {order.size}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-semibold ${
                            theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-white border border-slate-200 text-slate-700'
                          }`}>
                            {order.color}
                          </span>
                          <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                            Qty: {order.quantity}
                          </span>
                        </div>
                        <p className={`text-xs font-black pt-0.5 ${
                          theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                        }`}>
                          ₹{order.totalAmount.toLocaleString()} • Free Delivery
                        </p>
                      </div>
                    </div>

                    {/* Delivery Destination Address */}
                    <div className={`p-4 rounded-2xl border space-y-1.5 text-xs transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#0e111a] border-slate-800/80 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                    }`}>
                      <div className={`flex items-center justify-between text-[10px] uppercase font-bold tracking-wider ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          Delivery Address
                        </span>
                        <span className="text-emerald-500 font-bold">Standard Handover</span>
                      </div>
                      <p className={`font-bold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-slate-950'
                      }`}>
                        {order.customer.fullName}
                      </p>
                      <p className={`line-clamp-2 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                      </p>
                      <div className={`flex items-center gap-2 pt-1 text-[11px] ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <Phone className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{order.customer.phoneNumber}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
