import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ChevronRight, Info } from 'lucide-react';
import { formatINR } from './pricingUtils';

const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  isCodUnlocked,
  settings,
  totalAmountINR,
  subtotalINR,
  deliveryChargesINR,
  addressForm,
  onEditAddress,
  paymentLoading,
  cartItemsLength,
  onPaymentSubmit,
  onShowPriceDetails
}) => {
  return (
    <motion.div
      key="step-payment"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Select Payment Method Container */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3 text-stone-800">
          <div className="p-2 bg-amber-50 rounded-lg text-[#c59b27]">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider">Select Payment Method</span>
        </div>

        {/* Option 1: Cash on Delivery (Disabled/Unavailable OR Unlocked based on Admin rules) */}
        {isCodUnlocked ? (
          <div
            onClick={() => setPaymentMethod('COD')}
            className={`relative flex items-center justify-between p-4 border-2 rounded-xl transition-all shadow-xs cursor-pointer ${
              paymentMethod === 'COD'
                ? 'border-[#c59b27] bg-[#c59b27]/5'
                : 'border-stone-200 bg-white hover:border-[#c59b27]/30 hover:bg-stone-50/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-left">
                <div className="text-sm font-bold text-stone-800">{formatINR(totalAmountINR)}</div>
                <div className="text-[10px] text-stone-400 font-medium">Total</div>
              </div>

              <div className="h-8 w-[1px] bg-stone-200" />

              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">💵</span>
                <span className="text-xs font-bold text-stone-800">Cash on Delivery</span>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                paymentMethod === 'COD' ? 'border-[#c59b27]' : 'border-stone-300'
              }`}
            >
              {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#c59b27]" />}
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-between p-4 border border-stone-100 rounded-xl bg-stone-50/50 opacity-60 cursor-not-allowed">
            <div className="flex items-start gap-4">
              <div className="text-left">
                <div className="text-sm font-bold text-stone-800">{formatINR(totalAmountINR)}</div>
                <div className="text-[10px] text-stone-400 font-medium">Total</div>
              </div>

              <div className="h-8 w-[1px] bg-stone-200" />

              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">💵</span>
                <span className="text-xs font-semibold text-stone-500">Cash on Delivery</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[9px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90">
                {settings.isCodAvailable ? `Min ${formatINR(settings.minCodAmountINR || 500)}` : 'Unavailable'}
              </span>
              <div className="w-5 h-5 rounded-full border-2 border-stone-300 flex items-center justify-center bg-stone-100" />
            </div>
          </div>
        )}

        {/* Option 2: Pay Online (Always Selectable) */}
        <div
          onClick={() => setPaymentMethod('Online')}
          className={`relative flex items-center justify-between p-4 border-2 rounded-xl transition-all shadow-xs cursor-pointer ${
            paymentMethod === 'Online'
              ? 'border-2 border-[#c59b27] bg-[#c59b27]/5 shadow-sm'
              : 'border-stone-200 bg-white hover:border-[#c59b27]/30 hover:bg-stone-50/30'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="text-left">
              <div className="text-sm font-bold text-stone-800">{formatINR(totalAmountINR)}</div>
              <div className="text-[10px] text-stone-400 font-medium">Total</div>
            </div>

            <div className="h-8 w-[1px] bg-stone-200" />

            <div className="flex items-center gap-2 mt-1">
              {/* Orange/Green custom pay icon representing Indian digital checkout/Tricolor style */}
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-400 via-white to-green-500 border border-stone-200 shadow-xs font-extrabold text-[8px] text-blue-900">
                🇮🇳
              </div>
              <span className="text-xs font-bold text-stone-800">Pay Online</span>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
              paymentMethod === 'Online' ? 'border-[#c59b27]' : 'border-stone-300'
            }`}
          >
            {paymentMethod === 'Online' && <div className="w-2.5 h-2.5 rounded-full bg-[#c59b27]" />}
          </div>
        </div>
      </div>

      {/* Secure Alert Box - Responsive to selected Payment Method */}
      {paymentMethod === 'Online' ? (
        <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-700 shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <span className="text-xs font-semibold tracking-wide">
            Preparing your secure Cashfree checkout...
          </span>
        </div>
      ) : (
        <div className="p-4 bg-amber-50/80 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-800 shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span className="text-xs font-semibold tracking-wide">
            Order will be finalized and booked under Cash on Delivery...
          </span>
        </div>
      )}

      {/* Price Details Container */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-2">
          Price Details
        </h4>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-stone-600">
            <span>Subtotal</span>
            <span className="font-mono font-bold text-stone-800">{formatINR(subtotalINR)}</span>
          </div>

          <div className="flex justify-between items-center text-stone-600">
            <span>Delivery Charges</span>
            <span className="font-semibold text-green-600 font-mono">
              {deliveryChargesINR === 0 ? 'FREE' : formatINR(deliveryChargesINR)}
            </span>
          </div>

          <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-stone-800">
            <span className="font-bold">Total Amount</span>
            <span className="font-mono font-black text-sm text-[#c59b27]">{formatINR(totalAmountINR)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address Summary Card (Bonus visual) */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-sm text-xs text-stone-600 space-y-2">
        <div className="flex justify-between items-center border-b border-stone-100 pb-1.5">
          <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">Deliver to</span>
          <button onClick={onEditAddress} className="text-[#c59b27] font-bold hover:underline">Edit</button>
        </div>
        <div>
          <div className="font-bold text-stone-800">{addressForm.fullName} ({addressForm.phone})</div>
          <div className="mt-0.5 truncate leading-relaxed">{addressForm.street}, {addressForm.city}, {addressForm.state} - {addressForm.postalCode}</div>
        </div>
      </div>

      {/* Pay Now Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 p-4 shadow-2xl">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          {/* Left Side: View Price Details Trigger */}
          <div className="flex flex-col text-left">
            <span className="text-sm font-black text-stone-800 font-mono">{formatINR(totalAmountINR)}</span>
            <button
              onClick={onShowPriceDetails}
              className="text-[9px] font-bold tracking-widest text-[#c59b27] uppercase text-left hover:underline flex items-center gap-0.5"
            >
              View Price Details
              <Info className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>

          {/* Right Side: Gold Pay Now Button */}
          <button
            onClick={onPaymentSubmit}
            disabled={paymentLoading || cartItemsLength === 0}
            className="flex-grow max-w-[240px] py-4 bg-gradient-to-r from-[#d9ae38] to-[#b38f29] hover:from-[#c59b27] hover:to-[#a1811a] disabled:from-stone-400 disabled:to-stone-500 text-white font-bold text-xs tracking-widest uppercase rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Pay Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;
