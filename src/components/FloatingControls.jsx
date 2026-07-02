import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";


function FloatingControls({ cartItems, onOpenCart, onAddToCart }) {
  const location = useLocation();
 

  // Determine if floating controls should be hidden on specific routes
  const hideControls =
    location.pathname === "/checkout" || location.pathname.startsWith("/admin");

  if (hideControls) return null;

  // Calculate total items count in the cart
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasCartItems = totalItemsCount > 0;

  // Get the most recently added item in the cart for the thumbnail
  const latestItem = cartItems[cartItems.length - 1];
  const itemImageUrl = latestItem
    ? latestItem.image.startsWith("http")
      ? latestItem.image
      : `https://ozhan-backend.onrender.com${latestItem.image}`
    : "";

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 pointer-events-none z-[90] p-6 flex items-end justify-between">
        {/* Spacer to push elements to their respective places on the screen */}
        <div className="w-full max-w-7xl mx-auto flex items-end justify-between relative">
          
          {/* Floating Cart Pill (Bottom Middle) */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-auto">
            <AnimatePresence>
              {hasCartItems && (
                <motion.button
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenCart}
                  className="flex items-center gap-4 bg-[#1e1611]/95 backdrop-blur-md border border-[#d4af37]/40 rounded-full py-1.5 pl-1.5 pr-4 shadow-[0_10px_30px_rgba(0,0,0,0.6),_0_0_20px_rgba(212,175,55,0.15)] hover:border-[#d4af37] transition-all duration-300 group"
                >
                  {/* Product Thumbnail inside white circle */}
                  <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 border border-stone-200/50 p-0.5">
                    <img
                      src={itemImageUrl}
                      alt={latestItem?.name || "Cart item"}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>

                  {/* Text details */}
                  <div className="flex flex-col text-left pr-2">
                    <span className="text-white font-serif font-semibold text-sm leading-tight tracking-wide">
                      Cart
                    </span>
                    <span className="text-[#d4af37] text-xs font-semibold tracking-wider mt-0.5">
                      {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {/* Action Arrow inside white circle */}
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-850 group-hover:bg-[#d4af37] group-hover:text-black transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

         

        </div>
      </div>

      
    </>
  );
}

export default FloatingControls;
