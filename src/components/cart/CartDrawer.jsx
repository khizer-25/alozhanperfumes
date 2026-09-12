import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import useSettings from "../../hooks/useSettings";
import { formatPrice } from "../../utils/format";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal, count } = useCart();
  const { isAuthed } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();

  const threshold = settings.freeShippingThreshold || 0;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = threshold ? Math.min(100, (subtotal / threshold) * 100) : 100;

  const goToCheckout = () => {
    closeCart();
    navigate(isAuthed ? "/checkout" : "/login", {
      state: { from: { pathname: "/checkout" } },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-md flex-col bg-alabaster"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-serif text-xl">
                Your bag <span className="text-muted">({count})</span>
              </h2>
              <button onClick={closeCart} aria-label="Close bag">
                <X size={20} strokeWidth={1.5} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="font-serif text-2xl">Your bag is empty</p>
                <p className="text-sm font-light text-muted">
                  Add a fragrance and it will appear here.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate("/products");
                  }}
                  className="btn-outline"
                >
                  Browse fragrances
                </button>
              </div>
            ) : (
              <>
                {threshold > 0 && (
                  <div className="border-b border-line px-6 py-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                      {remaining > 0
                        ? `${formatPrice(remaining)} away from free shipping`
                        : "You've unlocked free shipping"}
                    </p>
                    <div className="mt-2 h-px w-full bg-line">
                      <div
                        className="h-px bg-gold transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                  <ul className="divide-y divide-line">
                    {items.map((item) => (
                      <li key={item.key} className="flex gap-4 py-4">
                        <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#efe9dd]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between gap-2">
                              <p className="font-serif text-base leading-tight">{item.name}</p>
                              <button
                                onClick={() => removeItem(item.key)}
                                className="text-muted hover:text-ink"
                                aria-label="Remove"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted">
                              {item.sizeLabel}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-line">
                              <button
                                onClick={() => updateQty(item.key, item.qty - 1)}
                                className="px-2 py-1.5 hover:bg-paper"
                                aria-label="Decrease"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-7 text-center text-xs tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.key, item.qty + 1)}
                                className="px-2 py-1.5 hover:bg-paper"
                                aria-label="Increase"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <p className="text-sm tabular-nums">
                              {formatPrice(item.price * item.qty)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <footer className="border-t border-line px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="uppercase tracking-[0.14em] text-muted">Subtotal</span>
                    <span className="font-serif text-xl">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-light text-muted">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <button onClick={goToCheckout} className="mt-4 w-full btn-primary py-4">
                    Checkout
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
