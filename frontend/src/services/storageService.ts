import { Design, UserProfile, Order, Review } from '../types';
import { INITIAL_DESIGNS, INITIAL_USER, INITIAL_ORDERS, INITIAL_REVIEWS } from '../data/sampleDesigns';

const STORAGE_KEYS = {
  DESIGNS: 'wearverse_designs_v4',
  USER: 'wearverse_user_v4',
  ORDERS: 'wearverse_orders_v4',
  REVIEWS: 'wearverse_reviews_v4',
  LOGGED_IN: 'wearverse_logged_in_v4',
  SESSIONS: 'wearverse_chat_sessions_v4',
};

// Automatic purge of legacy localStorage keys for a fresh, deployment-ready state
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const legacyKeys = [
      'wearverse_user_v1',
      'wearverse_user_v2',
      'wearverse_user_v3',
      'wearverse_orders_v1',
      'wearverse_orders_v2',
      'wearverse_orders_v3',
      'wearverse_logged_in',
      'wearverse_logged_in_v2',
      'wearverse_logged_in_v3',
      'wearverse_chat_sessions_v1',
      'wearverse_chat_sessions_v2',
      'wearverse_chat_sessions_v3',
      'wearverse_active_session_id',
      'wearverse_designs_v1',
      'wearverse_designs_v2',
      'wearverse_designs_v3',
      'wearverse_pending_tryon_design',
      'wearverse_initial_prompt',
      'wearverse_credits',
      'wearverse_unlimited_pass',
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    // Ignore storage access errors
  }
}

export const storageService = {
  getDesigns(): Design[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DESIGNS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(INITIAL_DESIGNS));
        return INITIAL_DESIGNS;
      }
      let parsed: Design[] = JSON.parse(data);
      // Purge any deprecated duplicate designs
      const purgedIds = new Set(['wv-010', 'wv-011', 'wv-012']);
      parsed = parsed.filter(d => !purgedIds.has(d.id));

      // Auto-merge any newly added initial designs so user immediately sees them
      const existingIds = new Set(parsed.map(d => d.id));
      const missing = INITIAL_DESIGNS.filter(d => !existingIds.has(d.id));
      const finalDesigns = missing.length > 0 ? [...parsed, ...missing] : parsed;
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(finalDesigns));
      return finalDesigns;
    } catch {
      return INITIAL_DESIGNS;
    }
  },

  saveDesigns(designs: Design[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designs));
    } catch (e) {
      console.error('Failed to save designs', e);
    }
  },

  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
        return INITIAL_USER;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USER;
    }
  },

  saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      let parsed: Order[] = JSON.parse(data);
      if (parsed.length === 0 && INITIAL_ORDERS.length > 0) {
        parsed = INITIAL_ORDERS;
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      }
      return parsed;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  },

  getReviews(): Record<string, Review[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
        return INITIAL_REVIEWS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  saveReviews(reviews: Record<string, Review[]>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews', e);
    }
  },
};
