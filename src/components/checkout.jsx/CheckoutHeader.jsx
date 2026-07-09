import React from 'react';
import { ChevronLeft, ShoppingBag } from 'lucide-react';

const CheckoutHeader = ({ step, cartItemCount, onBack }) => {
  return (
    <div className="sticky top-0 z-40 bg-[#faf8f5]/85 backdrop-blur-md border-b border-stone-200/60 px-4 py-4 md:px-6">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-stone-100 text-stone-600 hover:text-black transition-colors"
          style={{ display: step === 4 ? 'none' : 'flex' }}
        >
          <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
        </button>

        <h2 className="text-lg font-bold tracking-[3px] text-stone-800 uppercase font-serif mx-auto">
          {step === 4 ? 'Order Placed' : 'Payment'}
        </h2>

        <div className="relative">
          <button className="p-2 rounded-full text-stone-700">
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#c59b27] text-white text-[9px] font-bold px-1.5 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
