import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Download, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ExternalLink, 
  Printer, 
  MessageCircle, 
  DollarSign, 
  ShieldCheck, 
  Package, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

export const AdminOrdersModal: React.FC = () => {
  const { orders, updateOrderStatus, closeModal, showToast } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate high-level solo operator metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingPrintCount = orders.filter(o => o.status === 'In Production' || o.status === 'Pending').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  const filteredOrders = orders.filter(o => {
    const matchesFilter = selectedFilter === 'All' ? true : o.status === selectedFilter;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.phoneNumber.includes(searchTerm) ||
      o.designTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownloadArtwork = (order: Order) => {
    // Trigger download or open high-res graphic in new tab for print partner
    const link = document.createElement('a');
    link.href = order.designImage;
    link.download = `wearverse-print-${order.orderNumber}.jpg`;
    link.target = '_blank';
    link.click();
    showToast('success', 'Artwork Opened for Print', `DTG print graphic for ${order.orderNumber} ready for printing partner.`);
  };

  const handlePrintSlip = (order: Order) => {
    const slipWindow = window.open('', '_blank');
    if (!slipWindow) return;
    slipWindow.document.write(`
      <html>
        <head>
          <title>Shipping Job Slip - ${order.orderNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #111; }
            .box { border: 2px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }
            h1 { margin: 0 0 10px; font-size: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed #ccc; padding-bottom: 4px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>WearVerse Apparel • Order Job Slip</h1>
            <div class="row"><span>Order Number:</span><span class="bold">${order.orderNumber}</span></div>
            <div class="row"><span>Date:</span><span>${new Date(order.createdAt).toLocaleDateString()}</span></div>
            <div class="row"><span>Customer:</span><span class="bold">${order.customer.fullName}</span></div>
            <div class="row"><span>Phone:</span><span>${order.customer.phoneNumber}</span></div>
            <div class="row"><span>Delivery Address:</span><span>${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}</span></div>
            <div class="row"><span>Garment Spec:</span><span class="bold">240 GSM Heavy Combed Cotton</span></div>
            <div class="row"><span>Size:</span><span class="bold">Size ${order.size}</span></div>
            <div class="row"><span>Color:</span><span>${order.color}</span></div>
            <div class="row"><span>Artwork:</span><span>${order.designTitle}</span></div>
            <div class="row"><span>Payment:</span><span class="bold">PAID (₹${order.totalAmount} via ${order.paymentMethod || 'UPI'})</span></div>
            <p style="margin-top:20px; font-size:12px; color:#666;">Fulfill via DTG printer. Ship via Express Bluedart / Delhivery courier.</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    slipWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0f131f] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#141828] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-extrabold text-white font-['Space_Grotesk']">
                  WearVerse Store Manager
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Solo Founder Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor incoming customer orders, download print graphics, contact buyers & track fulfillment
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 sm:px-6 bg-[#0c0f18] border-b border-slate-800/80">
          <div className="p-3 rounded-2xl bg-[#151928] border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block">Total Revenue</span>
            <span className="text-lg font-black text-emerald-400 font-['Space_Grotesk']">₹{totalRevenue.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#151928] border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block">Active Orders</span>
            <span className="text-lg font-black text-white font-['Space_Grotesk']">{orders.length}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#151928] border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block">Needs Printing</span>
            <span className="text-lg font-black text-amber-400 font-['Space_Grotesk']">{pendingPrintCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#151928] border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block">Handed Over / Done</span>
            <span className="text-lg font-black text-indigo-400 font-['Space_Grotesk']">{shippedCount + deliveredCount}</span>
          </div>
        </div>

        {/* CONTROLS & SEARCH */}
        <div className="p-4 sm:px-6 border-b border-slate-800/60 bg-[#121624] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'In Production', 'Shipped', 'Delivered'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedFilter === status
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {status === 'In Production' ? 'Needs Printing' : status}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search by order #, customer name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* ORDER LIST STREAM */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Package className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <p className="text-sm font-semibold">No orders matching this filter</p>
              <p className="text-xs text-slate-500">New customer orders will appear here automatically.</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const cleanPhone = order.customer.phoneNumber.replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(`Hi ${order.customer.fullName}! This is WearVerse Fulfillment. We received your order ${order.orderNumber} for "${order.designTitle}" (Size ${order.size}). Your 240 GSM heavy cotton print is currently being prepared for dispatch!`);
              const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${waText}`;

              return (
                <div 
                  key={order.id}
                  className="rounded-2xl bg-[#141826] border border-slate-800 hover:border-slate-700/80 p-4 sm:p-5 transition shadow-lg space-y-4"
                >
                  {/* Top Bar: Order ID, Date, Amount & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black text-white font-mono">{order.orderNumber}</span>
                      <span className="text-[10px] text-slate-400">• {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        ₹{order.totalAmount} (PAID)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">Fulfillment Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-300 rounded-xl px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="In Production">In Production (Printing)</option>
                        <option value="Shipped">Dispatched (Shipped)</option>
                        <option value="Delivered">Delivered to Doorstep</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  {/* Body: Product details & Customer Address */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Product & Print Preview */}
                    <div className="md:col-span-5 flex items-center gap-3.5">
                      <img 
                        src={order.designImage} 
                        alt={order.designTitle} 
                        className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{order.designTitle}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-bold">Size {order.size}</span>
                          <span>•</span>
                          <span>Qty: {order.quantity}</span>
                          <span>•</span>
                          <span>240 GSM Combed Cotton</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">Payment ID: {order.paymentId}</p>
                      </div>
                    </div>

                    {/* Customer Contact & Delivery Info */}
                    <div className="md:col-span-4 space-y-1 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-4">
                      <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{order.customer.fullName}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{order.customer.address}, {order.customer.city} - {order.customer.pincode}</span>
                      </p>
                      <p className="text-[11px] text-indigo-400 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-indigo-400" />
                        <span>{order.customer.phoneNumber}</span>
                      </p>
                    </div>

                    {/* Quick Operator Actions */}
                    <div className="md:col-span-3 flex flex-wrap md:flex-col gap-2 pt-2 md:pt-0 justify-end">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp Buyer</span>
                      </a>

                      <button
                        onClick={() => handleDownloadArtwork(order)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                        title="Download print-ready graphic for printer"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Get DTG Graphic</span>
                      </button>

                      <button
                        onClick={() => handlePrintSlip(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                        title="Generate shipping slip for packing"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-400" />
                        <span>Shipping Slip</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER HELPER */}
        <div className="p-3 sm:px-6 bg-[#0c0f18] border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>💡 Solo Founder Flow: Click <strong>"Get DTG Graphic"</strong> to forward artwork to your DTG printer (or Printrove/Qikink), then ship to customer!</span>
          <button
            onClick={closeModal}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
