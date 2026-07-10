import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const OrdersTab = ({
  filteredOrders,
  orderSearchQuery, setOrderSearchQuery,
  orderPaymentFilter, setOrderPaymentFilter,
  orderDeliveryFilter, setOrderDeliveryFilter,
  expandedOrderId, setExpandedOrderId,
  handleMarkAsPaid, handleMarkAsDelivered
}) => {
  return (
    <motion.div
      key="manage-orders"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-light text-[#261c16] tracking-tight">Active Orders</h1>
          <p className="text-xs text-stone-500 font-light mt-1">Review checkouts, adjust shipment tracking statuses, and process deliveries.</p>
        </div>
      </div>

      {/* SEARCH & FILTERS CONTROLS */}
      <div className="bg-white border border-stone-200/80 rounded-sm p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text" placeholder="Search by Order ID, Buyer Name, or Perfume Name..."
              value={orderSearchQuery} onChange={(e) => setOrderSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-9 text-xs text-stone-850 focus:outline-none"
            />
          </div>
          <div>
            <select
              value={orderPaymentFilter} onChange={(e) => setOrderPaymentFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-xs focus:outline-none"
            >
              <option value="all">Payment: All</option>
              <option value="paid">Payment: Paid</option>
              <option value="unpaid">Payment: Unpaid / COD</option>
            </select>
          </div>
          <div>
            <select
              value={orderDeliveryFilter} onChange={(e) => setOrderDeliveryFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-xs focus:outline-none"
            >
              <option value="all">Delivery: All</option>
              <option value="delivered">Delivery: Delivered</option>
              <option value="transit">Delivery: In Transit</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const isExpanded = expandedOrderId === order._id;
          return (
            <div key={order._id} className="bg-white border border-stone-200 rounded-sm overflow-hidden text-xs">
              <div onClick={() => setExpandedOrderId(isExpanded ? null : order._id)} className="p-4 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-stone-50/20">
                <div>
                  <span className="text-[8px] text-stone-400 font-bold uppercase block">Order ID</span>
                  <span className="font-mono text-stone-850 font-bold">{order._id}</span>
                </div>
                <div>
                  <span className="text-[8px] text-stone-400 font-bold uppercase block">Buyer</span>
                  <span className="font-semibold">{order.user?.name || 'Guest'}</span>
                </div>
                <div>
                  <span className="text-[8px] text-stone-400 font-bold uppercase block">Total Price</span>
                  <span className="font-mono text-[#78532f] font-bold">${order.totalPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[8px] text-stone-400 font-bold uppercase block">Status</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-xs uppercase ${
                    order.isPaid ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
                  }`}>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
                </div>
                <span className="text-[#b38f44] font-bold text-[9px] uppercase">{isExpanded ? 'Collapse' : 'Details'}</span>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-stone-100 bg-[#fdfcf9]/30 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-[#b38f44] text-[9px] uppercase tracking-wider mb-1.5">Shipping</h5>
                      <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-[#b38f44] text-[9px] uppercase tracking-wider mb-1.5">Items</h5>
                      {order.orderItems.map((item, idx) => (
                        <p key={idx} className="font-light text-stone-600">{item.name} (Qty: {item.qty})</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-stone-100 pt-3">
                    {!order.isPaid && (
                      <button onClick={() => handleMarkAsPaid(order._id)} className="bg-[#d4af37] text-black font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-xs">
                        Set Paid
                      </button>
                    )}
                    {!order.isDelivered && (
                      <button onClick={() => handleMarkAsDelivered(order._id)} className="bg-green-600 text-white font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-xs">
                        Set Delivered
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default OrdersTab;
