import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Design, 
  UserProfile, 
  Order, 
  Review, 
  ToastMessage, 
  ActiveModal, 
  NavigationPage, 
  ApparelCategory, 
  TShirtSize,
  OrderStatus 
} from '../types';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { orderService, CreateOrderParams } from '../services/orderService';
import { INITIAL_USER } from '../data/sampleDesigns';

interface AppContextType {
  // Navigation
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;

  // Theme Feature
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // User Profile & Authentication
  user: UserProfile;
  isLoggedIn: boolean;
  login: (userUpdates?: Partial<UserProfile>) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateTryOnPhoto: (photoUrl: string) => void;

  // Designs
  designs: Design[];
  activeEditorDesign: Design | null;
  openEditorWithDesign: (design: Design | null) => void;
  addDesign: (design: Design) => void;
  updateDesign: (id: string, updates: Partial<Design>) => void;
  deleteDesign: (id: string) => void;
  toggleLikeDesign: (id: string) => void;

  // Orders & Fulfillment
  orders: Order[];
  placeOrder: (params: CreateOrderParams) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Reviews
  reviews: Record<string, Review[]>;
  addReview: (designId: string, rating: number, comment: string) => void;

  // Modals & Chat Flows
  activeModal: ActiveModal;
  startTryOnChat: (design: Design) => void;
  openTryOnModal: (design: Design) => void;
  openOrderModal: (design: Design, initialColor?: string, initialSize?: TShirtSize) => void;
  openDetailModal: (design: Design) => void;
  openEditProfileModal: () => void;
  openUpgradeCreditsModal: () => void;
  openAdminOrdersModal: () => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeModal: () => void;

  // Generation Credits & Monetization
  creditsRemaining: number;
  hasUnlimitedPass: boolean;
  consumeCredit: () => boolean;
  addCredits: (amount: number) => void;
  activateUnlimitedPass: () => void;
  resetCredits: () => void;

  // Notifications / Toast
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'info' | 'error' | 'warning', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Trending');

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wearverse_logged_in_v4') === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => storageService.getUser());
  const [designs, setDesigns] = useState<Design[]>(() => storageService.getDesigns());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => storageService.getReviews());

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [activeEditorDesign, setActiveEditorDesign] = useState<Design | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme Feature (White / Light mode default, Obsidian Dark available)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('wearverse_theme_v4');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light'; // White / Light mode as default
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wearverse_theme_v4', theme);
      const root = document.documentElement;
      const body = document.body;
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');

      if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
        root.classList.remove('theme-dark');
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#07090e');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Generation Credits State (Regular visitors have strictly 3 free designs; Founder Himanshu has unlimited)
  const [creditsRemaining, setCreditsRemaining] = useState<number>(() => {
    try {
      const storedUser = storageService.getUser();
      if (storedUser?.role === 'admin') return 9999;

      const saved = localStorage.getItem('wearverse_credits_v4');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        return isNaN(parsed) ? 3 : parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return 3;
  });

  const [hasUnlimitedPass, setHasUnlimitedPass] = useState<boolean>(() => {
    try {
      const storedUser = storageService.getUser();
      if (storedUser?.role === 'admin') return true;
      return localStorage.getItem('wearverse_unlimited_pass_v4') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Toast Helper
  const showToast = (type: 'success' | 'info' | 'error' | 'warning', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message, duration: 4000 };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to local storage
  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  useEffect(() => {
    storageService.saveDesigns(designs);
  }, [designs]);

  useEffect(() => {
    storageService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    storageService.saveReviews(reviews);
  }, [reviews]);

  // User Actions
  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      storageService.saveUser(updated);
      return updated;
    });
    showToast('success', 'Profile updated', 'Your changes have been saved to your profile.');
  };

  const updateTryOnPhoto = (photoUrl: string) => {
    setUser(prev => {
      const updated = { ...prev, tryOnPhotoUrl: photoUrl };
      storageService.saveUser(updated);
      return updated;
    });
    showToast('success', 'Try-On Photo updated', 'Virtual try-on will now use your newly uploaded photo.');
  };

  // Design Actions
  const addDesign = (newDesign: Design) => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in to Save', 'Please sign in or create an account to save designs to your wardrobe.');
      openAuthModal('login');
      return;
    }
    setDesigns(prev => {
      const updated = [newDesign, ...prev];
      storageService.saveDesigns(updated);
      return updated;
    });
    // Increment user designs stat
    setUser(prev => ({
      ...prev,
      stats: { ...prev.stats, designs: prev.stats.designs + 1 }
    }));
    showToast('success', 'Design saved to My Designs', `"${newDesign.title}" is now saved in your wardrobe.`);
  };

  const updateDesign = (id: string, updates: Partial<Design>) => {
    setDesigns(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, ...updates } : d);
      storageService.saveDesigns(updated);
      return updated;
    });
    showToast('info', 'Design updated', 'Your modifications have been saved.');
  };

  const deleteDesign = (id: string) => {
    setDesigns(prev => {
      const updated = prev.filter(d => d.id !== id);
      storageService.saveDesigns(updated);
      return updated;
    });
    showToast('info', 'Design deleted', 'The design was removed from your collection.');
  };

  const toggleLikeDesign = (id: string) => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in to Like', 'Please sign in or create an account to save designs to your favorites.');
      openAuthModal('login');
      return;
    }
    setDesigns(prev => {
      const updated = prev.map(d => {
        if (d.id === id) {
          const isLiked = !d.isLiked;
          const likesCount = isLiked ? d.likesCount + 1 : Math.max(0, d.likesCount - 1);
          if (isLiked) {
            showToast('success', 'Added to liked designs', `You liked ${d.title}`);
          }
          return { ...d, isLiked, likesCount };
        }
        return d;
      });
      storageService.saveDesigns(updated);
      return updated;
    });
  };

  const openEditorWithDesign = (design: Design | null) => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in to Customize', 'Please sign in or create an account to refine designs with AI.');
      openAuthModal('login');
      return;
    }
    if (design) {
      sessionStorage.setItem('wearverse_pending_tryon_design', JSON.stringify(design));
    }
    setActiveEditorDesign(design);
    setCurrentPage('create');
    closeModal();
    showToast('info', 'AI Chat Studio', 'Ready to iterate and refine design directly in chat.');
  };

  // Order Actions
  const placeOrder = (params: CreateOrderParams): Order => {
    const order = orderService.createOrder(params);
    setOrders(prev => [order, ...prev]);
    showToast('success', 'Order placed successfully!', `Order ${order.orderNumber} is confirmed.`);
    return order;
  };

  // Review Actions
  const addReview = (designId: string, rating: number, comment: string) => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in to Review', 'Please sign in or create an account to submit a review.');
      openAuthModal('login');
      return;
    }
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      designId,
      user: {
        name: user.name,
        avatar: user.avatar,
        isVerifiedBuyer: true,
      },
      rating,
      comment,
      date: 'Today',
      helpfulCount: 0,
    };

    setReviews(prev => {
      const existing = prev[designId] || [];
      const updated = { ...prev, [designId]: [newReview, ...existing] };
      storageService.saveReviews(updated);
      return updated;
    });

    // Recalculate design average rating & review count
    setDesigns(prev => {
      return prev.map(d => {
        if (d.id === designId) {
          const currentReviews = [newReview, ...(reviews[designId] || [])];
          const avg = currentReviews.reduce((sum, r) => sum + r.rating, 0) / currentReviews.length;
          return {
            ...d,
            rating: Number(avg.toFixed(2)),
            reviewsCount: d.reviewsCount + 1,
          };
        }
        return d;
      });
    });

    showToast('success', 'Review submitted!', 'Thank you for sharing your feedback with the WearVerse community.');
  };

  // Chat-Centric Try-On Flow: Create a dedicated chat for this T-shirt design
  const startTryOnChat = (design: Design) => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in for Virtual Try-On', 'Please sign in or create an account to try on T-shirts with AI.');
      openAuthModal('signup');
      return;
    }
    const sessionId = `sess-tryon-${Date.now()}`;
    const newSession = {
      id: sessionId,
      title: `Try On: ${design.title}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastThumbnail: design.frontImage,
      messages: [
        {
          id: `ai-intro-${Date.now()}`,
          sender: 'ai' as const,
          text: `You selected **${design.title}** (${design.fabric?.fit || '240 GSM Oversized'} • ₹${design.price}). Here is your selected bespoke T-shirt:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          variations: [{
            id: design.id,
            name: design.title,
            prompt: design.prompt || design.description,
            mockupUrl: design.frontImage,
            graphicUrl: design.graphicImage || design.frontImage,
            color: design.defaultColor || '#0f0f11',
            fit: design.fabric?.fit || '240 GSM Oversized',
            tags: design.tags || [],
          }],
        },
        {
          id: `ai-instr-${Date.now() + 1}`,
          sender: 'ai' as const,
          text: `Ready to see how **${design.title}** drapes on your body? 📸\n\nClick the **upload icon (📷 / 📎)** inside the chat composer below to attach your photo, then click Send to generate your photorealistic Virtual Try-On!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };

    try {
      const existing = localStorage.getItem('wearverse_chat_sessions_v4');
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [newSession, ...parsed.filter((s: any) => s.id !== sessionId)];
      localStorage.setItem('wearverse_chat_sessions_v4', JSON.stringify(updated));
      localStorage.setItem('wearverse_active_session_id', sessionId);
      sessionStorage.setItem('wearverse_pending_tryon_design', JSON.stringify(design));
    } catch (e) {
      console.error(e);
    }

    closeModal();
    setCurrentPage('create');
    showToast('info', 'Virtual Try-On Chat', `Upload your photo in the composer to try on "${design.title}".`);
  };

  // Modal Handlers
  const openTryOnModal = (design: Design) => {
    // Chat-Centric UX: Never redirect or open separate page; start/open Try-On chat!
    startTryOnChat(design);
  };

  const openOrderModal = (design: Design, initialColor?: string, initialSize?: TShirtSize) => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in to Order', 'Please sign in or create an account to place an order.');
      openAuthModal('login');
      return;
    }
    setActiveModal({ type: 'order', design, initialColor, initialSize });
  };

  const openDetailModal = (design: Design) => {
    setActiveModal({ type: 'detail', design });
  };

  const openEditProfileModal = () => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in Required', 'Please sign in to view and customize your creator profile.');
      openAuthModal('login');
      return;
    }
    setActiveModal({ type: 'edit-profile' });
  };

  const openUpgradeCreditsModal = () => {
    setActiveModal({ type: 'upgrade-credits' });
  };

  const openAdminOrdersModal = () => {
    if (user.role !== 'admin') {
      showToast('warning', 'Founder Access Required', 'Store Manager is exclusively for the store owner (Himanshu). Please sign in with founder credentials.');
      openAuthModal('login');
      return;
    }
    setActiveModal({ type: 'admin-orders' });
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setActiveModal({ type: 'auth', mode });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Auth Handlers (Log In / Log Out)
  const login = (userUpdates?: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    let displayName = user.name;
    const isAdmin = userUpdates?.role === 'admin';

    if (userUpdates) {
      setUser(prev => {
        const updated: UserProfile = { 
          ...prev, 
          ...userUpdates,
          role: isAdmin ? 'admin' : (userUpdates.role || prev.role || 'user'),
          hasUnlimitedPass: isAdmin ? true : (userUpdates.hasUnlimitedPass ?? prev.hasUnlimitedPass ?? false),
          creditsRemaining: isAdmin ? 9999 : (userUpdates.creditsRemaining ?? prev.creditsRemaining ?? 3),
        };
        storageService.saveUser(updated);
        return updated;
      });
      if (userUpdates.name) displayName = userUpdates.name;
    }

    try {
      localStorage.setItem('wearverse_logged_in_v4', 'true');
      if (isAdmin) {
        setHasUnlimitedPass(true);
        setCreditsRemaining(9999);
        localStorage.setItem('wearverse_unlimited_pass_v4', 'true');
        localStorage.setItem('wearverse_credits_v4', '9999');
      }
    } catch (e) {
      console.error(e);
    }

    if (isAdmin) {
      showToast('success', '👑 Welcome, Founder Himanshu!', 'Founder access unlocked: Unlimited AI design generations & full Store Manager enabled.');
    } else {
      showToast('success', 'Welcome!', displayName && displayName !== 'Guest User' ? `Logged in as ${displayName}` : 'Signed in successfully');
    }
    closeModal();
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(INITIAL_USER);
    setHasUnlimitedPass(false);
    setCreditsRemaining(3);
    try {
      localStorage.setItem('wearverse_logged_in_v4', 'false');
      localStorage.removeItem('wearverse_user_v4');
      localStorage.removeItem('wearverse_unlimited_pass_v4');
      localStorage.setItem('wearverse_credits_v4', '3');
    } catch (e) {
      console.error(e);
    }
    showToast('info', 'Logged Out', 'You have been logged out of WearVerse. See you soon!');
    closeModal();
  };

  // Order Fulfillment (Admin status updates)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          const updatedSteps = o.trackingSteps.map(step => {
            if (status === 'Shipped' && step.step.toLowerCase().includes('handover')) {
              return { ...step, completed: true, current: true, date: 'Dispatched via Courier' };
            }
            if (status === 'Delivered' && step.step.toLowerCase().includes('handover')) {
              return { ...step, completed: true, current: false, date: 'Delivered to Doorstep' };
            }
            return step;
          });
          return { ...o, status, trackingSteps: updatedSteps };
        }
        return o;
      });
      storageService.saveOrders(updated);
      return updated;
    });
    showToast('success', 'Order Status Updated', `Order ${orderId} marked as ${status}.`);
  };

  // Reset Credits (for testing or renewal on localhost)
  const resetCredits = () => {
    setCreditsRemaining(3);
    try {
      localStorage.setItem('wearverse_credits', '3');
    } catch (e) {
      console.error(e);
    }
    showToast('success', 'Credits Renewed! ⚡', 'Reset to 3 free AI generations. Enjoy designing!');
  };

  // Generation Credits Quota Guard
  const consumeCredit = (): boolean => {
    if (!isLoggedIn) {
      showToast('info', 'Sign in to Create', 'Please sign in or create an account to generate custom AI designs.');
      openAuthModal('signup');
      return false;
    }

    // Founder Himanshu / Admin or Unlimited Pass: Always permitted!
    if (user.role === 'admin' || hasUnlimitedPass) {
      return true;
    }

    // Regular users: strictly 3 generations total
    if (creditsRemaining > 0) {
      const updated = creditsRemaining - 1;
      setCreditsRemaining(updated);
      try {
        localStorage.setItem('wearverse_credits_v4', updated.toString());
      } catch (e) {
        console.error(e);
      }
      return true;
    }

    // Credits are 0: Hard block!
    openUpgradeCreditsModal();
    showToast('warning', 'Trial Limit Reached (3/3)', 'You have used all 3 free generations. Refill tokens or sign in with Founder credentials!');
    return false;
  };

  const addCredits = (amount: number) => {
    const updated = creditsRemaining + amount;
    setCreditsRemaining(updated);
    try {
      localStorage.setItem('wearverse_credits', updated.toString());
    } catch (e) {
      console.error(e);
    }
    showToast('success', 'Credits Refilled! ⚡', `Added +${amount} AI generation credits. Happy designing!`);
    closeModal();
  };

  const activateUnlimitedPass = () => {
    setHasUnlimitedPass(true);
    try {
      localStorage.setItem('wearverse_unlimited_pass', 'true');
    } catch (e) {
      console.error(e);
    }
    showToast('success', 'Unlimited Pass Unlocked! 👑', 'Infinite AI design generations activated for 30 days.');
    closeModal();
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        user,
        isLoggedIn,
        login,
        logout,
        updateUser,
        updateTryOnPhoto,
        designs,
        activeEditorDesign,
        openEditorWithDesign,
        addDesign,
        updateDesign,
        deleteDesign,
        toggleLikeDesign,
        orders,
        placeOrder,
        updateOrderStatus,
        reviews,
        addReview,
        activeModal,
        startTryOnChat,
        openTryOnModal,
        openOrderModal,
        openDetailModal,
        openEditProfileModal,
        openUpgradeCreditsModal,
        openAdminOrdersModal,
        openAuthModal,
        closeModal,
        creditsRemaining,
        hasUnlimitedPass,
        consumeCredit,
        addCredits,
        activateUnlimitedPass,
        resetCredits,
        theme,
        toggleTheme,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
