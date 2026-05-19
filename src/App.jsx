import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom"; 
import Header from "./components/Header";
import HomePage from "./components/Home/HomePage";
import FeaturesSection from "./components/Home/FeaturesSection";
import Footer from "./components/Footer";
import ProductList from "./components/Home/ProductList";
import Cart from "./components/Home/Cart"; // Ensure this matches your file path
import Products from "./components/Products/Products"; // Placeholder for future products page component

function App() {
  const location = useLocation();
  
  // This evaluates to true ONLY when navigating to /products
  const isProductsPage = location.pathname === "/products";


  // --- E-COMMERCE CART STATES ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamically calculate total individual units for the navbar icon badge
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- CART OPERATIONS ---
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    // Optional: Smoothly auto-open the right sidebar drawer on item addition
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

  // --- HOME PATH COMPONENT WRAPPER ---
  const Home = () => {
    return (
      <>
        <HomePage />
        {/* Pass the handleAddToCart action directly down into your grid mapping layout */}
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
        isProductsPage={isProductsPage} // Passing the condition down
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/products' element={<Products onAddToCart={handleAddToCart} />} />
          {/* Future routes (e.g., path="/products") will automatically have access to state if needed */}
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
      />
    </div>
  );
}

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