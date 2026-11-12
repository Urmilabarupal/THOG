/**
 * @file src/App.tsx
 * @purpose Root application component orchestrating all 23 storefront customer pages, Admin Portal,
 * Cart Drawer, Toast messaging, and state context.
 * @dependencies React, ./context/StoreContext.tsx, ./components/*, ./pages/*, ./admin/AdminLayout.tsx.
 * @implementation Routes statefully across customer journey touchpoints with zero pill clutter,
 * fluid micro-animations, and full Indian commerce functionality.
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ToastContainer } from './components/Toast.tsx';

// Customer Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { SearchResultsPage } from './pages/SearchResultsPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage.tsx';
import { MyOrdersPage } from './pages/MyOrdersPage.tsx';
import { OrderTrackingPage } from './pages/OrderTrackingPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';
import { ComparisonPage } from './pages/ComparisonPage.tsx';
import { AboutUsPage } from './pages/AboutUsPage.tsx';
import { ContactUsPage } from './pages/ContactUsPage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import { PoliciesPage } from './pages/PoliciesPage.tsx';

// Admin Panel Layout
import { AdminLayout } from './admin/AdminLayout.tsx';

const AppContent: React.FC = () => {
  const { currentView } = useStore();

  // If in Admin panel, render dedicated admin layout without public header/footer
  if (currentView === 'admin') {
    return (
      <>
        <AdminLayout />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-stone-900">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'shop' && <ShopPage />}
        {currentView === 'categories' && <CategoriesPage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'search' && <SearchResultsPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
        {currentView === 'login' && <AuthPage initialMode="login" />}
        {currentView === 'register' && <AuthPage initialMode="register" />}
        {currentView === 'forgot-password' && <AuthPage initialMode="forgot-password" />}
        {currentView === 'customer-dashboard' && <CustomerDashboardPage />}
        {currentView === 'my-orders' && <MyOrdersPage />}
        {currentView === 'order-tracking' && <OrderTrackingPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'compare' && <ComparisonPage />}
        {currentView === 'about' && <AboutUsPage />}
        {currentView === 'contact' && <ContactUsPage />}
        {currentView === 'blog' && <BlogPage />}
        {currentView === 'faq' && <FAQPage />}
        {currentView === 'privacy-policy' && <PoliciesPage initialTab="privacy" />}
        {currentView === 'terms-conditions' && <PoliciesPage initialTab="terms" />}
        {currentView === 'shipping-policy' && <PoliciesPage initialTab="shipping" />}
        {currentView === 'refund-policy' && <PoliciesPage initialTab="refund" />}
      </main>

      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
