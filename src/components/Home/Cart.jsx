import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  
  // Helper to safely strip '$' and convert to floating number
  // const parsePrice = (priceStr) => {
  //   return parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
  // };


  // --- NEW FIX: Safe parsing for both Numbers and Strings ---
  const parsePrice = (price) => {
  if (typeof price === 'number') return price; // If it's already a number, return it!
  if (typeof price === 'string') {
    return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0; // If it's a string, clean and parse it
  }
  return 0; // Fallback
};
  const subtotal = cartItems.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0
  );

  const cartVariants = {
    closed: { x: '100%', transition: { type: 'spring', stiffness: 400, damping: 40 } },
    opened: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Right-aligned Drawer Sidebar */}
          <motion.div
            variants={cartVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="fixed top-0 right-0 z-[110] h-screen w-full bg-[#26201c] border-l border-white/5 p-6 shadow-2xl sm:max-w-md flex flex-col justify-between font-sans antialiased text-white"
          >
            {/* Header Area */}
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                  <h2 className="text-xl font-light tracking-widest uppercase">Your Atelier Cart</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-stone-400 hover:text-white hover:rotate-90 transition-transform duration-200"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Scrollable Items Container */}
            <div className="flex-grow overflow-y-auto my-6 space-y-4 pr-1 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <ShoppingBag size={48} strokeWidth={1} className="mb-4 text-[#d4af37]" />
                  <p className="text-sm tracking-wider font-light uppercase">Your shopping bag is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-3 bg-white/5 border border-white/5 rounded-sm relative group"
                  >
                    <div className="w-20 h-24 overflow-hidden rounded-sm flex-shrink-0 bg-stone-900">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="text-sm font-medium tracking-wide text-white pr-6">{item.name}</h4>
                        <p className="text-[10px] tracking-widest text-[#d4af37] uppercase">{item.category}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Elegant Numeric Stepper Selector */}
                        <div className="flex items-center border border-white/10 rounded-sm bg-black/20">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 hover:text-[#d4af37] text-stone-400 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-medium px-2 min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 hover:text-[#d4af37] text-stone-400 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price computation item unit */}
                        <p className="text-sm font-light text-stone-300 tracking-wider">
                          ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Absolute Trash Trigger button option */}
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-3 right-3 text-stone-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions Block Footer */}
            <div className="border-t border-white/10 pt-4 space-y-4 bg-[#26201c]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-400 tracking-wider uppercase font-light">Estimated Subtotal</span>
                <span className="text-xl font-light text-[#d4af37] tracking-widest">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-stone-400 italic font-light">
                Shipping fees, customs duties and packaging taxes calculated at checkout.
              </p>
              
              <button 
                disabled={cartItems.length === 0}
                className="w-full py-4 bg-[#d4af37] text-black font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#a1811a] disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed transition-all duration-300 rounded-sm"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;