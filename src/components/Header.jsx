<<<<<<< HEAD
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
=======
import { useState } from "react";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Header({ cartCount, onOpenCart, isProductsPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac

  const sidebarVariants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    opened: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },  
<<<<<<< HEAD
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

=======
    // { name: "About", path: "/about" },
    // { name: "Shop", path: "#collections" },
    { name: "Go to cart", action: onOpenCart },
    { name: "Login", path: "/login" },
  ];

>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
  return (
    <>
      <header className="fixed top-4 left-0 z-50 w-full px-4 md:top-6 md:px-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
<<<<<<< HEAD
=======
          // {/* UPDATED: Glassmorphism layout values applied below */}
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
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

<<<<<<< HEAD
          {/* Logo Title */}
=======
          {/* Logo Context Title */}
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="no-underline">
              <h1 className="text-xl font-black tracking-tighter text-white transition-colors duration-300 md:text-3xl">
                ORVÉLIA
              </h1>
            </Link>
          </div>

<<<<<<< HEAD
          {/* Icon Interaction Group */}
          <div className={`flex items-center gap-0.5 rounded-full p-0.5 transition-colors duration-300 md:gap-1 md:p-1 md:px-3 relative ${
            isProductsPage ? "bg-white/5" : "bg-white/20"
          }`}>
            {/* Cart Button */}
=======
          {/* Icon Interaction Container Control Group */}
          <div className={`flex items-center gap-0.5 rounded-full p-0.5 transition-colors duration-300 md:gap-1 md:p-1 md:px-3 ${
            isProductsPage ? "bg-white/5" : "bg-white/20"
          }`}>
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
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
            
<<<<<<< HEAD
            {/* User Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-1 px-2 text-xs font-bold text-white hover:opacity-80 transition-all flex items-center gap-1.5 rounded-full bg-white/10"
                  type="button"
                >
                  <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black font-extrabold flex items-center justify-center text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[70px] truncate hidden sm:inline">{user.name.split(' ')[0]}</span>
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="p-2 text-white transition-opacity hover:opacity-70 flex items-center justify-center"
                >
                  <User size={18} strokeWidth={1.5} />
                </Link>
              )}

              {/* Glassmorphism Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 rounded-sm border border-stone-200 bg-white p-2 shadow-2xl text-stone-800"
                  >
                    <div className="px-3 py-2 border-b border-stone-100 text-left">
                      <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Logged In As</p>
                      <p className="font-semibold text-stone-800 text-xs truncate">{user.name}</p>
                      <span className="text-[8px] uppercase tracking-widest bg-stone-100 px-1 py-0.5 rounded-xs text-stone-500 font-mono mt-0.5 inline-block">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      {/* Track Orders */}
                      <button
                        onClick={() => handleDropdownItemClick('/profile')}
                        className="w-full text-left py-2 px-3 rounded-xs text-xs flex items-center gap-2 hover:bg-stone-50 text-stone-600 hover:text-black font-medium transition-colors"
                      >
                        <ClipboardList className="w-4 h-4 text-[#b38f44]" />
                        Track Orders
                      </button>

                      {/* Admin Dashboard (Admin only) */}
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleDropdownItemClick('/admin')}
                          className="w-full text-left py-2 px-3 rounded-xs text-xs flex items-center gap-2 hover:bg-amber-50 text-amber-900 font-medium transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                          Admin Console
                        </button>
                      )}

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                          navigate('/');
                        }}
                        className="w-full text-left py-2 px-3 rounded-xs text-xs flex items-center gap-2 hover:bg-red-50 text-red-600 hover:text-red-700 font-medium transition-colors border-t border-stone-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
=======
            <button className="p-2 text-white transition-opacity hover:opacity-70" type="button">
              <User size={18} strokeWidth={1.5} />
            </button>
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
          </div>
        </motion.div>
      </header>

<<<<<<< HEAD
      {/* Slide-out Drawer */}
=======
      {/* Slide-out Navigation Drawer Menu */}
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
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
<<<<<<< HEAD
                  {/* Logout option in drawer for mobile users */}
                  {user && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                        navigate('/');
                      }}
                      className="text-left text-4xl font-black uppercase tracking-tighter text-red-600 hover:italic transition-all md:text-6xl border-t border-stone-100 pt-4"
                    >
                      Log Out
                    </button>
                  )}
=======
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
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