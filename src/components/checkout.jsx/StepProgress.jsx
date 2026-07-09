import React from 'react';
import { motion } from 'framer-motion';

// Multi-step progression details
export const CHECKOUT_STEPS = [
  { num: 1, label: 'Cart' },
  { num: 2, label: 'Address' },
  { num: 3, label: 'Payment' },
  { num: 4, label: 'Summary' }
];

const StepProgress = ({ step }) => {
  if (step >= 5) return null;

  return (
    <div className="max-w-xl mx-auto px-6 py-6 border-b border-stone-200/50">
      <div className="flex items-center justify-between relative">
        {/* Background connecting line */}
        <div className="absolute left-6 right-6 top-4 h-[2px] bg-stone-200 z-0" />

        {/* Active filled line progression */}
        <div
          className="absolute left-6 top-4 h-[2px] bg-[#c59b27] transition-all duration-500 z-0"
          style={{ width: `${((step - 1) / (CHECKOUT_STEPS.length - 1)) * 90}%` }}
        />

        {CHECKOUT_STEPS.map((s) => {
          const isCompleted = step > s.num;
          const isActive = step === s.num;

          return (
            <div key={s.num} className="flex flex-col items-center z-10 relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  isCompleted
                    ? 'bg-[#c59b27] text-white shadow-md'
                    : isActive
                    ? 'bg-[#c59b27] text-white ring-4 ring-[#c59b27]/20 shadow-md'
                    : 'bg-white border border-stone-200 text-stone-400'
                }`}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`text-[10px] tracking-wide mt-2 font-medium uppercase transition-colors duration-300 ${
                  isActive ? 'text-[#c59b27] font-bold' : isCompleted ? 'text-stone-700' : 'text-stone-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
