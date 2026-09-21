import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import useSettings, { announcementText } from "../hooks/useSettings";

const NAV = [
  { label: "Home", to: "/" },
  { label: "All Fragrances", to: "/products" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const { isAuthed, isAdmin, user, logout } = useAuth();
  const settings = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  const announcement = announcementText(settings);
  const showBar = settings.announcementEnabled && announcement;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {showBar && (
          <div className="bg-ink text-alabaster">
            <p className="container-lux py-2 text-center text-[10.5px] font-light uppercase tracking-[0.22em]">
              {announcement}
            </p>
          </div>
        )}

        <div
          className={`transition-colors duration-300 ${
            transparent
              ? "bg-transparent text-alabaster"
              : "border-b border-line bg-alabaster/95 text-ink backdrop-blur"
          }`}
        >
          <div className="container-lux flex h-16 items-center justify-between md:h-20">
            {/* Left: nav / burger */}
            <nav className="hidden items-center gap-7 md:flex">
              {NAV.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `link-underline text-[11px] font-medium uppercase tracking-[0.16em] ${
                      isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Center: wordmark */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 text-center"
            >
              <span className="block font-serif text-xl tracking-[0.28em] md:text-2xl">
                AL&nbsp;ÖZHAN
              </span>
              <span className="mt-0.5 hidden text-[8.5px] uppercase tracking-[0.35em] opacity-70 md:block">
                Parfumeur
              </span>
            </Link>

            {/* Right: account + cart */}
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden text-[11px] font-medium uppercase tracking-[0.16em] link-underline md:inline"
                >
                  Studio
                </Link>
              )}
              <Link
                to={isAuthed ? "/account" : "/login"}
                aria-label="Account"
                className="hover:opacity-70"
              >
                <User size={19} strokeWidth={1.5} />
              </Link>
              <button
                onClick={openCart}
                aria-label="Cart"
                className="relative hover:opacity-70"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-semibold text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer keeps content clear of the fixed header on non-home pages */}
      {!isHome && <div className={showBar ? "h-[104px] md:h-[120px]" : "h-16 md:h-20"} />}

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-[70] w-[82%] max-w-xs bg-alabaster px-7 py-8"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg tracking-[0.24em]">AL ÖZHAN</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-10 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="border-b border-line py-3.5 font-serif text-2xl"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 text-[11px] uppercase tracking-[0.16em]">
                <Link to={isAuthed ? "/account" : "/login"} className="flex items-center gap-2">
                  <User size={15} /> {isAuthed ? "My Account" : "Sign In"}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2">
                    <LayoutDashboard size={15} /> Studio
                  </Link>
                )}
                {isAuthed && (
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="flex items-center gap-2 text-left text-gold-deep"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                )}
              </div>
              {user && (
                <p className="mt-10 text-[11px] font-light text-muted">
                  Signed in as {user.name}
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
