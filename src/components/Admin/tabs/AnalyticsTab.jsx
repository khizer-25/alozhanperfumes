import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, ClipboardList, TrendingUp } from 'lucide-react';

const AnalyticsTab = ({ analytics, orders }) => {
  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-light text-[#261c16] tracking-tight">Business Analytics</h1>
        <p className="text-xs text-stone-500 font-light mt-1">Monitor revenue, customer growth, product sales, and store performance in real time.</p>
      </div>

      {/* Stats Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-stone-200/80 p-5 rounded-sm flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Total Revenue</span>
            <h3 className="text-xl font-light font-mono text-[#78532f]">₹{Number(analytics.totalRevenue || 0).toLocaleString("en-IN")}</h3>
          </div>
          <div className="p-2.5 bg-[#78532f]/10 text-[#78532f] rounded-full">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 p-5 rounded-sm flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Items Sold</span>
            <h3 className="text-xl font-light font-mono text-[#78532f]">{analytics.totalSales} units</h3>
          </div>
          <div className="p-2.5 bg-[#78532f]/10 text-[#78532f] rounded-full">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 p-5 rounded-sm flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Total Checkouts</span>
            <h3 className="text-xl font-light font-mono text-[#78532f]">{analytics.totalOrders} orders</h3>
          </div>
          <div className="p-2.5 bg-[#78532f]/10 text-[#78532f] rounded-full">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 p-5 rounded-sm flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Avg Order Value</span>
            <h3 className="text-xl font-light font-mono text-[#78532f]">₹{Number(analytics.averageOrderValue || 0).toLocaleString("en-IN")}</h3>
          </div>
          <div className="p-2.5 bg-[#78532f]/10 text-[#78532f] rounded-full">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-xs">
        <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold mb-4 border-b border-stone-100 pb-2">
          Latest Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                <th className="py-2.5 px-2">Order ID</th>
                <th className="py-2.5 px-2">Buyer</th>
                <th className="py-2.5 px-2">Checkout Date</th>
                <th className="py-2.5 px-2">Payment Status</th>
                <th className="py-2.5 px-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
  {orders.length > 0 ? (
    orders.slice(0, 5).map((order) => (
      <tr key={order._id} className="hover:bg-stone-50/50">
        <td className="py-2.5 px-2 font-mono text-[9px] text-stone-500">
          #{order._id.slice(-6).toUpperCase()}
        </td>

        <td className="py-2.5 px-2">
          {order.user?.name || "Guest"}
        </td>

        <td className="py-2.5 px-2 text-stone-400">
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </td>

        <td className="py-2.5 px-2">
          <span
            className={`text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider ${
              order.isPaid
                ? "bg-green-50 text-green-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
        </td>

        <td className="py-2.5 px-2 text-right font-semibold font-mono text-[#78532f]">
          ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="5"
        className="text-center py-8 text-stone-400"
      >
        No recent orders available.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;
