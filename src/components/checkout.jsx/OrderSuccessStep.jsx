import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { formatINR } from './pricingUtils';

const OrderSuccessStep = ({ placedOrder, copiedId, onCopy, onTrackOrder, onContinueShopping }) => {
  return (
    <motion.div
      key="step-success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-6 space-y-6"
    >
      <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full border border-green-100 shadow-sm text-green-600 mb-2">
        <CheckCircle2 className="w-16 h-16 stroke-[1.2]" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold font-serif text-stone-800 tracking-wider uppercase">Order Placed Successfully!</h3>
        <p className="text-xs text-stone-500 font-light max-w-sm mx-auto leading-relaxed">
          Thank you for shopping at Al Özhan. Your premium fragrance purchase was secured and processed successfully under reference ID:
        </p>

        {/* Reference ID copy item */}
        <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-lg py-2 px-3 font-mono text-xs text-[#c59b27] shadow-inner select-all mt-3">
          <span>{placedOrder._id}</span>
          <button
            onClick={() => onCopy(placedOrder._id)}
            className="p-1 hover:bg-stone-200 rounded text-stone-500 transition-colors"
            title="Copy Order ID"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Order summary invoice breakdown */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm text-left space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-2">
          Order Invoice Details
        </h4>

        <div className="space-y-3">
          {placedOrder.orderItems.map((item, idx) => (
            <div key={idx} className="flex gap-3 text-xs">
              <img
                src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                alt={item.name}
                className="w-10 h-12 object-cover rounded-md border border-stone-200 shrink-0"
              />
              <div className="flex-grow">
                <div className="font-bold text-stone-800">{item.name}</div>
                <div className="text-[10px] text-stone-400 font-medium">Qty: {item.qty}</div>
              </div>
              <div className="font-mono text-stone-600 font-bold shrink-0">
                {formatINR(item.price * item.qty)}
              </div>
            </div>
          ))}

          <div className="border-t border-stone-100 pt-3 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-stone-500">
              <span>Address Destination</span>
              <span className="font-medium text-stone-800">{placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between items-center text-stone-500">
              <span>Method Used</span>
              <span className="font-medium text-stone-800">Online UPI (Cashfree)</span>
            </div>
            <div className="flex justify-between items-center text-stone-800 font-bold border-t border-stone-50/50 pt-2 text-sm">
              <span>Total Paid</span>
              <span className="font-mono text-[#c59b27] font-black">{formatINR(placedOrder.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-3 max-w-sm mx-auto">
        <button
          onClick={onTrackOrder}
          className="w-full py-4 bg-[#c59b27] hover:bg-[#a1811a] text-white font-bold text-xs tracking-widest uppercase rounded-full shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          Track In My Account
        </button>
        <button
          onClick={onContinueShopping}
          className="w-full py-4 bg-transparent border-2 border-stone-300 hover:border-stone-400 text-stone-600 hover:text-stone-800 font-bold text-xs tracking-widest uppercase rounded-full transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
};

export default OrderSuccessStep;
