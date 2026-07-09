import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatINR } from './pricingUtils';

const PriceDetailsModal = ({ show, onClose, subtotalINR, deliveryChargesINR, totalAmountINR }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#faf8f5] rounded-t-3xl border-t border-stone-200 p-6 shadow-2xl max-w-xl mx-auto"
          >
            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-stone-800">
                Detailed Pricing Review
              </h3>
              <button
                onClick={onClose}
                className="text-xs font-bold text-[#c59b27] hover:underline"
              >
                Close
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-stone-600 border-b border-stone-100 pb-5">
              <div className="flex justify-between items-center">
                <span>Cart Subtotal</span>
                <span className="font-mono text-stone-800 font-bold">{formatINR(subtotalINR)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Standard Shipping Charges</span>
                <span className="font-semibold text-green-600 font-mono">
                  {deliveryChargesINR === 0 ? 'FREE' : formatINR(deliveryChargesINR)}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-stone-800 text-sm font-bold">
              <span>Grand Total Amount</span>
              <span className="font-mono text-xl text-[#c59b27] font-black">{formatINR(totalAmountINR)}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PriceDetailsModal;
