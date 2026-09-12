import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import ScrollToTop from "./components/common/ScrollToTop";
import CookieConsent from "./components/common/CookieConsent";
import FloatingContactButtons from "./components/FloatingContactButtons";

import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import ProductDetails from "./components/Products/ProductDetails";
import Contact from "./components/Home/Contactus";
import Login from "./components/Auth/Login";
import ResetPassword from "./components/Auth/ResetPassword";
import VerifyEmail from "./components/Auth/VerifyEmail";
import Profile from "./components/Auth/Profile";
import Checkout from "./components/checkout.jsx/Checkout";
import LegalPage from "./components/legal/LegalPage";
import AdminDashboard from "./components/Admin/AdminDashboard";

import { useAuth } from "./context/AuthContext";

function AuthGate({ children, adminOnly = false }) {
  const { status, isAuthed, isAdmin } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-alabaster">
        <div className="space-y-4 text-center">
          <p className="eyebrow animate-pulse">Al Özhan</p>
          <div className="rule mx-auto" />
          <p className="text-xs font-light text-muted animate-pulse">
            Preparing your session…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-alabaster">
      <ScrollToTop />
      {!isAdminRoute && <Header />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route
            path="/account"
            element={
              <AuthGate>
                <Profile />
              </AuthGate>
            }
          />
          <Route
            path="/checkout"
            element={
              <AuthGate>
                <Checkout />
              </AuthGate>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthGate adminOnly>
                <AdminDashboard />
              </AuthGate>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <FloatingContactButtons />
          <Footer />
        </>
      )}

      <CartDrawer />
      {!isAdminRoute && <CookieConsent />}
    </div>
  );
}
