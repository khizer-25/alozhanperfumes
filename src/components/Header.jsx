import React, { useState, useRef, useEffect } from "react";
import { ShoppingBag, User, Menu, X, LogOut, ClipboardList, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header({ cartCount, onOpenCart, isProductsPage, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animateItalic, setAnimateItalic] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll to dynamically apply light vs dark glassmorphic styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isBright = location.pathname !== "/" || isScrolled;

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
<div className="mb-14">
    <h2 className="text-3xl font-light tracking-[8px] text-[#261c16]">
        Al Özhan
    </h2>

    <p className="mt-2 text-xs tracking-[4px] uppercase text-stone-400">
        Fine Fragrances
    </p>
</div>

useEffect(() => {
  let interval;

  if (isMenuOpen) {
    setAnimateItalic(true); // Start italic

    interval = setInterval(() => {
      setAnimateItalic((prev) => !prev);
    }, 1000);
  } else {
    setAnimateItalic(true);
  }

  return () => clearInterval(interval);
}, [isMenuOpen]);
  
  return (
    <>
      <header className="fixed top-4 left-0 z-50 w-full px-4 md:top-6 md:px-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border backdrop-blur-xl shadow-lg transition-all duration-300 md:px-4 py-2 px-3 ${
            isBright 
              ? "border-stone-200/60 bg-[#fdfcf9]/80 shadow-md text-[#362720]" 
              : "border-white/20 bg-white/10 text-white"
          }`}
        >
          {/* Menu Trigger Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-10 md:w-10 ${
              isBright 
                ? "bg-[#362720]/5 text-[#362720] hover:bg-[#362720]/15" 
                : "bg-black/20 text-white hover:bg-black/40"
            }`}
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>

          {/* Logo Title */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="no-underline">
              <h1 className={`text-xl font-black tracking-[2px] transition-colors duration-300 md:text-3xl ${
                isBright ? "text-[#261c16]" : "text-white"
              }`}>
                Al Özhan
              </h1>
            </Link>
          </div>

          {/* Icon Interaction Group */}
          <div className={`flex items-center gap-0.5 rounded-full p-0.5 transition-colors duration-300 md:gap-1 md:p-1 md:px-3 relative ${
            isBright ? "bg-[#362720]/5" : "bg-white/20"
          }`}>
            {/* Cart Button */}
            <button 
              className={`relative p-2 transition-opacity hover:opacity-70 ${
                isBright ? "text-[#362720]" : "text-white"
              }`} 
              onClick={onOpenCart} 
              type="button"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className={`absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold ${
                  isBright ? "bg-[#d4af37] text-white" : "bg-white text-black"
                } md:h-4 md:w-4 md:text-[9px]`}>
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className={`mx-1 h-4 w-[1px] ${
              isBright ? "bg-[#362720]/10" : "bg-white/30"
            }`} />
            
            {/* User Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              {user && user.name ? (
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`p-1 px-2 text-xs font-bold hover:opacity-80 transition-all flex items-center gap-1.5 rounded-full ${
                    isBright ? "text-[#362720] bg-[#362720]/5" : "text-white bg-white/10"
                  }`}
                  type="button"
                >
                  <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black font-extrabold flex items-center justify-center text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[70px] truncate hidden sm:inline">{user.name.split(' ')[0]}</span>
                </button>
              ) : user ? (
                <div className={`p-2 flex items-center justify-center ${isBright ? "text-[#362720]" : "text-white"}`}>
                  <div className="w-4 h-4 rounded-full border border-stone-400 border-t-transparent animate-spin" />
                </div>
              ) : (
                <Link 
                  to="/login"
                  className={`p-2 transition-opacity hover:opacity-70 flex items-center justify-center ${
                    isBright ? "text-[#362720]" : "text-white"
                  }`}
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
          </div>
        </motion.div>
      </header>

      {/* Slide-out Drawer */}
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
              className="fixed top-0 left-0 z-[70] h-screen w-[280px] bg-[#fdfcf9] border-r border-stone-200 px-6 py-10 shadow-2xl"
            >
              <div className="flex h-full flex-col">
                <motion.button
  onClick={() => setIsMenuOpen(false)}
  whileHover={{
    rotate: 90,
    scale: 1.08,
  }}
  whileTap={{
    scale: 0.92,
  }}
  transition={{
    duration: 0.35,
    ease: "easeInOut",
  }}
  className="
    self-end
    flex
    h-8
    w-8
    items-center
    justify-center
    rounded-full
    text-[#362720]
    hover:bg-[#362720]
    hover:text-white
  "
>
  <X size={18} strokeWidth={2} />
</motion.button>
                
                <nav className="flex flex-col space-y-1">
                  {menuLinks.map((link) => (
                    <div key={link.name}>
                      {link.action ? (
  <button
    onClick={() => {
      link.action();
      setIsMenuOpen(false);
    }}
className={`
group
flex
w-full
items-center
justify-between
rounded-xl
px-4
py-4
text-2xl
md:text-3xl
font-medium
tracking-wide
transition-all
duration-700
text-[#362720]
hover:text-[#C8A24C]
${animateItalic ? "italic" : "not-italic"}
`}
  >
    <span>{link.name}</span>
    <span
  className="
    opacity-0
    translate-x-[-8px]
    group-hover:opacity-100
    group-hover:translate-x-0
    transition-all
    duration-300
    text-[#C8A24C]
  "
>
  →
</span>
  </button>
) : (
                        <Link
  to={link.path}
  onClick={() => setIsMenuOpen(false)}
  className={`
group
flex
w-full
items-center
justify-between
rounded-xl
px-4
py-4
text-2xl
md:text-3xl
font-medium
tracking-wide
transition-all
duration-700
text-[#362720]
hover:text-[#C8A24C]
${animateItalic ? "italic" : "not-italic"}
`}
>
  <span>{link.name}</span>

  <span
  className="
    opacity-0
    translate-x-[-8px]
    group-hover:opacity-100
    group-hover:translate-x-0
    transition-all
    duration-300
    text-[#C8A24C]
  "
>
  →
</span>
</Link>
                      )}
                    </div>
                  ))}
                  {/* Logout option in drawer for mobile users */}
                  {user && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                        navigate('/');
                      }}
                      className="
mt-6
border-t
pt-6
text-left
text-2xl
md:text-3xl
font-medium
tracking-wide
text-red-600
hover:italic
transition-all
duration-300
">
                      Log Out
                    </button>
                  )}
                </nav>
                <div className="mt-auto border-t border-slate-100 pt-6">
                 <p className="text-[10px] uppercase tracking-[3px] text-slate-400">© 2026 Al Ozhan Perfumes</p>
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