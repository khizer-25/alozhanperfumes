import { useState } from "react";
<<<<<<< HEAD
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; 
import Header from "./components/Header";
import HomePage from "./components/Home/HomePage";
import FeaturesSection from "./components/Home/FeaturesSection";
import Footer from "./components/Footer";
import ProductList from "./components/Home/ProductList";
import Cart from "./components/Home/Cart"; 
import Products from "./components/Products/Products"; 
import Login from "./components/Auth/Login";
import Profile from "./components/Auth/Profile";
import AdminDashboard from "./components/Admin/AdminDashboard";
=======
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom"; 
import Header from "./components/Header";
import HomePage from "./components/Home/Homepage";
import FeaturesSection from "./components/Home/FeaturesSection";
import Footer from "./components/Footer";
import ProductList from "./components/Home/ProductList";
import Cart from "./components/Home/Cart"; // Ensure this matches your file path
import Products from "./components/Products/Products"; // Placeholder for future products page component
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac

function App() {
  const location = useLocation();
  
  // This evaluates to true ONLY when navigating to /products
  const isProductsPage = location.pathname === "/products";

<<<<<<< HEAD
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

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };
=======
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac

  // --- E-COMMERCE CART STATES ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamically calculate total individual units for the navbar icon badge
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- CART OPERATIONS ---
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
<<<<<<< HEAD
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
=======
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    // Optional: Smoothly auto-open the right sidebar drawer on item addition
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
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

<<<<<<< HEAD
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

=======
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
  // --- HOME PATH COMPONENT WRAPPER ---
  const Home = () => {
    return (
      <>
        <HomePage />
<<<<<<< HEAD
=======
        {/* Pass the handleAddToCart action directly down into your grid mapping layout */}
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
        <ProductList onAddToCart={handleAddToCart} />
        <FeaturesSection />
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
<<<<<<< HEAD
        isProductsPage={isProductsPage}
        user={user}
        onLogout={handleLogout}
=======
        isProductsPage={isProductsPage} // Passing the condition down
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
<<<<<<< HEAD
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
=======
          <Route path='/products' element={<Products onAddToCart={handleAddToCart} />} />
          {/* Future routes (e.g., path="/products") will automatically have access to state if needed */}
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
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
<<<<<<< HEAD
        clearCart={handleClearCart}
        user={user}
=======
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      />
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;















// import { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import HomePage from "./components/HomePage";
// import FeaturesSection from "./components/FeaturesSection";
// import Footer from "./components/Footer";
// import ProductList from "./components/ProductList";

// function App() {
//   // Fix: Wrap multiple components in a Fragment
//   const Home = () => {
//     return (
//       <>
//         <HomePage />
//         <ProductList />
//         <FeaturesSection />
//       </>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#fdfcf9]">
//       <Header />

//       <main>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           {/* You can add more routes here as your project grows */}
//         </Routes>
//       </main>
//       <Footer/>
//     </div>
//   );
// }

// export default App;
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
