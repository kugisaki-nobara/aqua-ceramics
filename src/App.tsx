import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout components
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Public Customer Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { Bathroom3DPage } from './pages/Bathroom3DPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PartnersPage } from './pages/PartnersPage';
import { ContactPage } from './pages/ContactPage';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminQuotationsPage } from './pages/admin/AdminQuotationsPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout with persistent Header and Footer & Glassmorphism Ambient Glow
const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#fdfaf5] text-slate-800 selection:bg-[#3d84ae]/20 selection:text-[#1b3d54] overflow-x-hidden">
      {/* Ambient Glassmorphism Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-[#3d84ae]/15 blur-3xl ambient-orb-1"></div>
        <div className="absolute top-1/4 -right-28 w-[36rem] h-[36rem] rounded-full bg-[#f8e5d0]/50 blur-3xl ambient-orb-2"></div>
        <div className="absolute top-2/3 left-1/6 w-[32rem] h-[32rem] rounded-full bg-[#6ba8ce]/15 blur-3xl ambient-orb-1"></div>
        <div className="absolute -bottom-20 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#3d84ae]/10 blur-3xl ambient-orb-2"></div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

import { EnquiryProvider } from './context/EnquiryContext';
import { EnquiryDrawer } from './components/EnquiryDrawer';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <EnquiryProvider>
            <BrowserRouter>
              <ScrollToTop />
              <EnquiryDrawer />
              <Routes>
                {/* Public Customer Routes */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/bathroom-3d" element={<Bathroom3DPage />} />
                  <Route path="/3d-experience" element={<Bathroom3DPage />} />
                  <Route path="/virtual-tour" element={<Bathroom3DPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/partners" element={<PartnersPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/request-quote" element={<RequestQuotePage />} />
                  <Route path="/cart" element={<Navigate to="/request-quote" replace />} />
                  <Route path="/checkout" element={<Navigate to="/request-quote" replace />} />
                  <Route path="/order-confirmation/:orderRef" element={<OrderConfirmationPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/account" element={<AccountPage />} />
                </Route>

                {/* Admin Login (Standalone) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="quotations" element={<AdminQuotationsPage />} />
                  <Route path="enquiries" element={<AdminEnquiriesPage />} />
                  <Route path="content" element={<AdminContentPage />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </EnquiryProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};


export default App;
