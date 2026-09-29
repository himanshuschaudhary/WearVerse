import { Order, OrderCustomer, TShirtSize, Design } from '../types';
import { storageService } from './storageService';

export interface CreateOrderParams {
  design: Design;
  color: string;
  size: TShirtSize;
  material?: string;
  materialGsm?: number;
  quantity: number;
  customer: OrderCustomer;
  paymentMethod: string;
  paymentId: string;
}

export const orderService = {
  createOrder(params: CreateOrderParams): Order {
    const existingOrders = storageService.getOrders();
    const nextOrderNum = 125 + existingOrders.length;
    const orderNumber = `#WV00${nextOrderNum}`;
    const unitPrice = params.design.price;
    const deliveryFee = 0; // Free promotional delivery
    const totalAmount = unitPrice * params.quantity + deliveryFee;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      designId: params.design.id,
      designTitle: params.design.title,
      designImage: params.design.frontImage,
      color: params.color,
      size: params.size,
      material: params.material || '240 GSM Combed Cotton',
      materialGsm: params.materialGsm || 240,
      quantity: params.quantity,
      unitPrice,
      deliveryFee,
      totalAmount,
      status: 'In Production',
      paymentMethod: params.paymentMethod || 'UPI / Online Payment',
      paymentId: params.paymentId || `PAY_${Date.now()}`,
      isPaid: true,
      ownerNotified: true,
      customer: params.customer,
      trackingSteps: [
        {
          step: 'Payment Verified',
          description: `₹${totalAmount.toLocaleString()} received via ${params.paymentMethod} (ID: ${params.paymentId})`,
          date: 'Just now',
          completed: true,
          current: false,
        },
        {
          step: 'Production Alert',
          description: `Email alert sent to WearVerse dispatch team with customer delivery address & print specs`,
          date: 'Just now',
          completed: true,
          current: false,
        },
        {
          step: 'In Production',
          description: `Printing on ${params.material || '240 GSM Combed Cotton'} (${params.color})`,
          date: 'Scheduled for fulfillment',
          completed: false,
          current: true,
        },
        {
          step: 'Handover / Dispatched',
          description: `Physical handover to ${params.customer.fullName}`,
          date: 'Ready soon',
          completed: false,
          current: false,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...existingOrders];
    storageService.saveOrders(updated);

    // Update user stats
    const user = storageService.getUser();
    user.stats.orders = updated.length;
    storageService.saveUser(user);

    // Record owner notification log in localStorage
    try {
      const ownerLog = JSON.parse(localStorage.getItem('wearverse_owner_alerts') || '[]');
      ownerLog.unshift({
        id: `alert-${Date.now()}`,
        orderNumber,
        subject: `⚡ NEW PAID ORDER: ${newOrder.customer.fullName} ordered ${newOrder.designTitle}`,
        body: `Payment of ₹${totalAmount} verified via ${newOrder.paymentMethod}. Customer: ${newOrder.customer.fullName} (${newOrder.customer.phoneNumber}), Address: ${newOrder.customer.address}, ${newOrder.customer.city} - ${newOrder.customer.pincode}. Ready for physical print & handover!`,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        order: newOrder,
        isRead: false,
      });
      localStorage.setItem('wearverse_owner_alerts', JSON.stringify(ownerLog));
    } catch (e) {
      console.error(e);
    }

    // Notify backend order fulfillment pipeline (dispatches email alert to owner)
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${apiBase}/api/notify-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((e) => console.warn('Could not dispatch order notification to backend:', e));

    return newOrder;
  },

  getAllOrders(): Order[] {
    return storageService.getOrders();
  },

  getOrderById(id: string): Order | undefined {
    return storageService.getOrders().find(o => o.id === id || o.orderNumber === id);
  }
};
