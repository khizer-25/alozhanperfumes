import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

const PaymentsTab = ({ paymentMetrics, orders }) => {
  return (
    <motion.div
      key="payments"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-xl font-light text-[#261c16] tracking-tight">Payment Gateways & Transactions</h1>
        <p className="text-xs text-stone-500 font-light mt-1">Review active transactions, gateway success percentages, and refund volumes.</p>
      </div>

      {/* Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(paymentMetrics).map(([gw, data]) => {
          const totalTrans = data.successful + data.failed + data.refunds;
          const rate = totalTrans > 0 ? (data.successful / totalTrans) * 100 : 100;
          return (
            <div key={gw} className="bg-white border border-stone-200 p-5 rounded-sm shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <h4 className="font-bold text-stone-850 text-xs tracking-wider uppercase">{gw}</h4>
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="space-y-1.5 font-mono text-[10px] text-stone-500">
                <p className="flex justify-between text-green-700"><strong>Success:</strong> <span>{data.successful}</span></p>
                <p className="flex justify-between text-red-700"><strong>Failed:</strong> <span>{data.failed}</span></p>
                <p className="flex justify-between text-blue-700"><strong>Refunds:</strong> <span>{data.refunds}</span></p>
                <p className="flex justify-between border-t border-stone-100 pt-1.5 text-stone-800 font-semibold font-sans text-xs">
                  <span>Health Rate:</span> <span>{rate.toFixed(0)}%</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions list */}
      <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-xs">
        <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold mb-4 border-b border-stone-100 pb-2">Recent transactions list</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                <th className="py-2 px-2">Txn ID</th>
                <th className="py-2 px-2">Payment Method</th>
                <th className="py-2 px-2">Amount</th>
                <th className="py-2 px-2">Tax</th>
                <th className="py-2 px-2">Grand Total</th>
                <th className="py-2 px-2">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-mono text-[10px]">
              {orders.slice(0, 10).map(o => (
                <tr key={o._id}>
                  <td className="py-2 px-2 text-stone-400">{o.paymentResult?.id || `COD-TXN-${o._id.slice(0, 6)}`}</td>
                  <td className="py-2 px-2 font-sans font-bold text-stone-700 uppercase">{o.paymentMethod || 'COD'}</td>
                  <td className="py-2 px-2">${o.itemsPrice?.toFixed(2) || o.totalPrice}</td>
                  <td className="py-2 px-2">${o.taxPrice?.toFixed(2) || '0.00'}</td>
                  <td className="py-2 px-2 font-bold text-[#78532f]">${o.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-2">
                    {o.isPaid ? (
                      <span className="bg-green-50 text-green-700 text-[8px] font-bold px-1 py-0.2 rounded-xs uppercase">Success</span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 text-[8px] font-bold px-1 py-0.2 rounded-xs uppercase">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentsTab;
