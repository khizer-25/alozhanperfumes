import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';

const PaymentLoadingModal = ({ show, paymentPhase }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-[#26201c]/90 backdrop-blur-md flex items-center justify-center p-6 text-white text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl flex flex-col items-center"
          >
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-[#d9ae38] animate-spin stroke-[1]" />
              <ShieldCheck className="w-6 h-6 text-[#d9ae38] absolute" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-serif tracking-widest text-[#d9ae38] uppercase font-bold">Cashfree Checkout</h3>
              <p className="text-xs text-stone-300 font-light select-none tracking-wide animate-pulse">
                {paymentPhase}
              </p>
            </div>

            <div className="text-[10px] text-stone-400 font-mono tracking-widest bg-black/30 py-1.5 px-4 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              SECURE SSL TRANSACTION PROTECTED
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentLoadingModal;
