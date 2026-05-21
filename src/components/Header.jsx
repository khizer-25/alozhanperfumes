import React, { useState, useRef, useEffect } from "react";
import { ShoppingBag, User, Menu, X, LogOut, ClipboardList, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function Header({ cartCount, onOpenCart, isProductsPage, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sidebarVariants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    opened: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },  
    { name: "Go to cart", action: onOpenCart },
  ];

  // Dynamic menu links for drawer
  if (user) {
    menuLinks.push({ name: "My Orders", path: "/profile" });
    if (user.role === 'admin') {
      menuLinks.push({ name: "Admin Dashboard", path: "/admin" });
    }
  } else {
    menuLinks.push({ name: "Login", path: "/login" });
  }

  const handleDropdownItemClick = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="fixed top-4 left-0 z-50 w-full px-4 md:top-6 md:px-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          // {/* UPDATED: Glassmorphism layout values applied below */}
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border backdrop-blur-xl shadow-lg transition-all duration-300 md:px-4 py-2 px-3 ${
            isProductsPage 
              ? "border-stone-700/40 bg-[#261c16]/75 shadow-black/10 text-white" 
              : "border-white/20 bg-white/10 text-white"
          }`}
        >
          {/* Menu Trigger Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-10 md:w-10 ${
              isProductsPage 
                ? "bg-white/5 text-stone-200 hover:bg-white/15" 
                : "bg-black/20 text-white hover:bg-black/40"
            }`}
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>

          {/* Logo Context Title */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="no-underline">
              <h1 className="text-xl font-black tracking-tighter text-white transition-colors duration-300 md:text-3xl">
                ORVÉLIA
              </h1>
            </Link>
          </div>

          {/* Icon Interaction Container Control Group */}
          <div className={`flex items-center gap-0.5 rounded-full p-0.5 transition-colors duration-300 md:gap-1 md:p-1 md:px-3 ${
            isProductsPage ? "bg-white/5" : "bg-white/20"
          }`}>
            <button 
              className="relative p-2 text-white transition-opacity hover:opacity-70" 
              onClick={onOpenCart} 
              type="button"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className={`absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold ${
                  isProductsPage ? "bg-[#d4af37] text-white" : "bg-white text-black"
                } md:h-4 md:w-4 md:text-[9px]`}>
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className={`mx-1 h-4 w-[1px] ${
              isProductsPage ? "bg-white/10" : "bg-white/30"
            }`} />
            
            <button className="p-2 text-white transition-opacity hover:opacity-70" type="button">
              <User size={18} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Slide-out Navigation Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={sidebarVariants} initial="closed" animate="opened" exit="closed"
              className="fixed top-0 left-0 z-[70] h-screen w-full bg-white p-8 shadow-2xl sm:max-w-md md:p-12"
            >
              <div className="flex h-full flex-col">
                <button onClick={() => setIsMenuOpen(false)} className="self-end text-black hover:rotate-90 transition-transform">
                  <X size={32} strokeWidth={1} />
                </button>
                <nav className="mt-12 flex flex-col gap-4 md:gap-6">
                  {menuLinks.map((link) => (
                    <div key={link.name}>
                      {link.action ? (
                        <button
                          onClick={() => { link.action(); setIsMenuOpen(false); }}
                          className="text-left text-4xl font-black uppercase tracking-tighter text-black hover:italic transition-all md:text-6xl"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-4xl font-black uppercase tracking-tighter text-black no-underline hover:italic transition-all md:text-6xl"
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="mt-auto border-t border-slate-100 pt-6">
                  <p className="text-xs uppercase tracking-widest text-slate-400">© 2026 Orvélia Parfums</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;