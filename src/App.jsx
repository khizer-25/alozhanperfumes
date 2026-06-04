import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; 
import Header from "./components/Header";
import HomePage from "./components/Home/Homepage";
import FeaturesSection from "./components/Home/FeaturesSection";
import Footer from "./components/Footer";
import ProductList from "./components/Home/ProductList";
import Cart from "./components/Home/Cart"; 
import Products from "./components/Products/Products"; 
import Login from "./components/Auth/Login";
import Profile from "./components/Auth/Profile";
import AdminDashboard from "./components/Admin/AdminDashboard";
import { Contact } from "lucide-react";
import ContactUs from "./components/Home/Contactus";
import { api } from "./utils/api";

function App() {
  const location = useLocation();
  
  // This evaluates to true ONLY when navigating to /products
  const isProductsPage = location.pathname === "/products";

  // --- GLOBAL AUTHENTICATION STATE ---
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (e) {
        console.error("Error parsing stored session info:", e);
        return null;
      }
    }
    return null;
  });

  // Sync profile details if token exists but basic fields like name are missing
  useEffect(() => {
    const syncProfile = async () => {
      if (user && !user.name) {
        try {
          const profile = await api.get("/auth/profile");
          const fullUserData = {
            ...user,
            name: profile.name,
            email: profile.email,
            role: profile.role,
          };
          localStorage.setItem("userInfo", JSON.stringify(fullUserData));
          setUser(fullUserData);
        } catch (e) {
          console.error("Failed to sync profile on load:", e);
          // Token is likely invalid, expired, or server profile is unreachable. Clear the incomplete session.
          localStorage.removeItem("userInfo");
          setUser(null);
        }
      }
    };
    syncProfile();
  }, [user]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  // --- E-COMMERCE CART STATES ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamically calculate total individual units for the navbar icon badge
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- CART OPERATIONS ---
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      // Support both live database products (_id) and static mock products (id)
      const productId = product._id || product.id;
      const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, id: productId, quantity: 1 }];
    });
    // Smoothly auto-open the right sidebar drawer on item addition
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // --- ROUTE PROTECTION COMPONENTS ---
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!user || user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // --- HOME PATH COMPONENT WRAPPER ---
  const Home = () => {
    return (
      <>
        <HomePage />
        <ProductList onAddToCart={handleAddToCart} />
        <FeaturesSection />
        <ContactUs />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] relative">
      {/* 
        Inject state triggers into Header. 
        This keeps the dynamic badge sync'd and opens the drawer on click.
      */}
      <Header 
        cartCount={totalCartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        isProductsPage={isProductsPage}
        user={user}
        onLogout={handleLogout}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          
          {/* Protected Customer Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Secure Admin Control Console Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Routes>
      </main>
      
      <Footer />

      {/* 
        The Slide-out Global Cart Drawer Component.
        Placed outside main routing architecture so it overlays flawlessly on any page view.
      */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        clearCart={handleClearCart}
        user={user}
      />
    </div>
  );
}

export default App;
