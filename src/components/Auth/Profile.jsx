import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Mail, Calendar, CreditCard, Truck, RefreshCw, ShoppingBag } from 'lucide-react';
import { api } from '../../utils/api';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load user profile details
      const profile = await api.get('/auth/profile');
      setUser(profile);

      // Load user orders list
      const ordersList = await api.get('/orders/myorders');
      setOrders(ordersList);
    } catch (err) {
      setError(err.message || 'Failed to sync your account profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-32 pb-24 px-6 font-sans antialiased text-[#362720]">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Title Header */}
        <div className="text-center mb-12">
          <p className="text-[#b38f44] text-xs tracking-[0.4em] mb-3 uppercase font-bold">Personal Vault</p>
          <h1 className="text-4xl font-light text-[#261c16] tracking-tight">Atelier Profile & Orders</h1>
          <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Account Info Sidebar panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm">
              <h2 className="text-xs uppercase tracking-widest text-[#b38f44] font-bold mb-4 border-b border-stone-100 pb-2 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Account Credentials
              </h2>
              
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#78532f]/10 text-[#78532f] flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 text-sm">{user.name}</h3>
                      <span className="text-[10px] uppercase font-mono tracking-widest bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-xs">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs text-stone-600 font-light pt-2">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 opacity-60 text-stone-500" />
                      {user.email}
                    </p>
                    {user.role === 'admin' && (
                      <p className="flex items-center gap-2 text-amber-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        Admin Access Enabled
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-stone-400 text-xs">
                  {loading ? 'Retrieving profile...' : 'Failed to retrieve profile credentials'}
                </div>
              )}
            </div>
          </div>

          {/* Main Orders List tracker container */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-6">
                <h2 className="text-xs uppercase tracking-widest text-stone-700 font-bold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#b38f44]" />
                  Order Tracking History ({orders.length})
                </h2>
                <button 
                  onClick={fetchOrders}
                  className="p-1 text-stone-500 hover:text-[#b38f44] transition-colors"
                  title="Reload orders"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-16 text-stone-500 text-xs tracking-widest">
                  SYNCING LIVE VAULT ORDERS...
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-700 text-xs bg-red-50 p-4 border border-red-200 rounded-sm">
                  {error}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 opacity-40">
                  <ShoppingBag size={42} strokeWidth={1} className="mb-3 text-[#d4af37] mx-auto" />
                  <p className="text-xs tracking-wider uppercase font-medium text-stone-600">No orders discovered</p>
                  <p className="text-[10px] text-stone-400 font-light mt-1 max-w-xs mx-auto">
                    Blends purchased from Orvélia checkout will appear here instantly for full tracking and courier monitoring.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <motion.div
                      layout
                      key={order._id}
                      className="border border-stone-200 rounded-sm overflow-hidden p-5 space-y-4 hover:border-stone-300 transition-colors"
                    >
                      {/* Order Metadata Header row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50/50 p-3 rounded-xs border border-stone-100 text-xs">
                        <div className="font-mono text-[10px] text-stone-500">
                          ID: <span className="font-semibold text-stone-700">{order._id}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-3 pt-2">
                        {order.orderItems.map((item) => (
                          <div key={item._id} className="flex items-center gap-4 text-xs">
                            <div className="w-12 h-14 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200/50">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-medium text-stone-800 truncate">{item.name}</h4>
                              <p className="text-[9px] text-[#b38f44] tracking-wider uppercase font-semibold">Qty: {item.qty} × ${item.price}</p>
                            </div>
                            <div className="text-right text-stone-700 font-semibold font-mono">
                              ${(item.qty * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Status Badges Row */}
                      <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4 text-xs font-light text-stone-500">
                        {/* Payment badge */}
                        <div className="flex items-start gap-2">
                          <CreditCard className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400 mb-0.5">Payment</span>
                            {order.isPaid ? (
                              <span className="inline-block bg-green-50 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs font-mono uppercase tracking-wider">
                                Paid
                              </span>
                            ) : (
                              <span className="inline-block bg-amber-50 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs font-mono uppercase tracking-wider">
                                Unpaid / COD
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delivery badge */}
                        <div className="flex items-start gap-2">
                          <Truck className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400 mb-0.5">Courier</span>
                            {order.isDelivered ? (
                              <span className="inline-block bg-green-50 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs font-mono uppercase tracking-wider">
                                Delivered
                              </span>
                            ) : (
                              <span className="inline-block bg-stone-100 text-stone-600 text-[9px] font-bold px-1.5 py-0.5 rounded-xs font-mono uppercase tracking-wider">
                                In Transit
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pricing Footer */}
                      <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-xs">
                        <span className="text-stone-400 uppercase tracking-widest font-medium text-[10px]">Grand Total</span>
                        <span className="text-base font-semibold text-[#78532f] font-mono">${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
