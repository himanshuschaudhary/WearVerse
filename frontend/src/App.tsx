import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/ToastContainer';

// Pages & Studios
import { HomePage } from './pages/HomePage';
import { ChatbotStudio } from './components/ChatbotStudio';
import { ExplorePage } from './pages/ExplorePage';
import { CommunityPage } from './pages/CommunityPage';
import { MyDesignsPage } from './pages/MyDesignsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';

// Modals
import { TryOnModal } from './components/modals/TryOnModal';
import { OrderModal } from './components/modals/OrderModal';
import { DesignDetailModal } from './components/modals/DesignDetailModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { UpgradeCreditsModal } from './components/modals/UpgradeCreditsModal';
import { AdminOrdersModal } from './components/modals/AdminOrdersModal';
import { AuthModal } from './components/modals/AuthModal';

const AppContent: React.FC = () => {
  const { currentPage, activeModal, theme } = useApp();

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'create':
      case 'editor':
        return <ChatbotStudio />;
      case 'explore':
      case 'shop':
        return <ExplorePage />;
      case 'community':
        return <CommunityPage />;
      case 'my-designs':
        return <MyDesignsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  const isStudioOnly = currentPage === 'create' || currentPage === 'editor';

  return (
    <div className={`flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-[#07090e] text-slate-100' 
        : 'bg-[#f8fafc] text-slate-900'
    } ${isStudioOnly ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
      {/* Top Main Navigation (Rendered on secondary pages & desktop home; mobile home has in-page header) */}
      {!isStudioOnly && currentPage !== 'home' && <Navbar />}

      {/* Main View Area */}
      <main className="flex-1 w-full overflow-hidden">
        {renderActivePage()}
      </main>

      {/* Footer (Rendered only on standard secondary subpages) */}
      {!isStudioOnly && currentPage !== 'home' && <Footer />}

      {/* Mobile Bottom Navigation (Shown on mobile views matching Image 4) */}
      {!isStudioOnly && <MobileNav />}

      {/* Dynamic Modals */}
      {activeModal?.type === 'tryon' && (
        <TryOnModal design={activeModal.design} />
      )}
      {activeModal?.type === 'order' && (
        <OrderModal 
          design={activeModal.design} 
          initialColor={activeModal.initialColor}
          initialSize={activeModal.initialSize}
        />
      )}
      {activeModal?.type === 'detail' && (
        <DesignDetailModal design={activeModal.design} />
      )}
      {activeModal?.type === 'edit-profile' && (
        <EditProfileModal />
      )}
      {activeModal?.type === 'upgrade-credits' && (
        <UpgradeCreditsModal />
      )}
      {activeModal?.type === 'admin-orders' && (
        <AdminOrdersModal />
      )}
      {activeModal?.type === 'auth' && (
        <AuthModal initialMode={activeModal.mode || 'login'} />
      )}

      {/* Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
