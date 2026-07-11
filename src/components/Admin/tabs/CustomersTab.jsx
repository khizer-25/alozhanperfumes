import React from 'react';
import { motion } from 'framer-motion';
import { Search, User } from 'lucide-react';

const CustomersTab = ({
  filteredCustomers, customerSearchQuery, setCustomerSearchQuery,
  selectedCustomerProfile, setSelectedCustomerProfile,
  couponCode, setCouponCode, setCouponTargetId, couponSuccess, handleIssueCouponSubmit
}) => {
  return (
    <motion.div
      key="customers"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-light text-[#261c16] tracking-tight">Customer Management</h1>
          <p className="text-xs text-stone-500 font-light mt-1">Review customer profiles, purchase history, lifetime value, and issue coupon codes.</p>
        </div>

        <div className="relative w-full max-w-xs shrink-0">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="Search by name or email..."
            value={customerSearchQuery} onChange={(e) => setCustomerSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-sm py-1.5 pl-9 pr-3 text-xs placeholder-stone-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Customers Listing Table */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Registered Customer Directory</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                  <th className="py-2.5 px-2">Name</th>
                  <th className="py-2.5 px-2">Email</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                {filteredCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-2 text-stone-850 flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#78532f] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">{c.name}</span>
                    </td>
                    <td className="py-2.5 px-2 text-stone-500 truncate max-w-[120px]">{c.email}</td>
                    <td className="py-2.5 px-2 text-right space-x-1 whitespace-nowrap">
                    
                      <button
  onClick={() => setSelectedCustomerProfile(c)}
  className="text-[9px] font-bold uppercase tracking-wider border border-stone-200 py-1 px-2 rounded-xs hover:border-stone-400 bg-white"
>
  View Profile
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Details & Actions panel */}
        <div className="lg:col-span-1 bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-5">
          <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Customer Details</h3>

          {selectedCustomerProfile ? (
            <div className="space-y-4 text-xs">
              {/* Details block */}
              <div className="space-y-2 bg-stone-50/50 p-3.5 rounded-sm border border-stone-200/50">
                <h4 className="font-bold text-stone-850 text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#d4af37]" /> Profile Details
                </h4>
                <div className="space-y-1.5 font-light text-stone-600">
                  <p><strong className="font-medium text-stone-800">Phone:</strong> {selectedCustomerProfile.phone || 'N/A'}</p>
                  <p>
<strong className="font-medium text-stone-800">
Email:
</strong>{" "}
{selectedCustomerProfile.email}
</p>
                  <p><strong className="font-medium text-stone-800">Address:</strong> {selectedCustomerProfile.address || 'N/A'}</p>
                  <p><strong className="font-medium text-stone-800">Spend:</strong>₹{Number(
selectedCustomerProfile.totalSpend || 0
).toLocaleString("en-IN")}</p>
                  <p>
  <strong className="font-medium text-stone-800">
    Orders:
  </strong>{" "}
  {selectedCustomerProfile.totalOrders || 0}
</p>
<p>
  <strong className="font-medium text-stone-800">
    Joined:
  </strong>{" "}
 {new Date(selectedCustomerProfile.createdAt).toLocaleString()}
</p>
<p>
  <strong className="font-medium text-stone-800">
    Coupons:
  </strong>
</p>

<div className="flex flex-wrap gap-2 mt-1">
  {selectedCustomerProfile.coupons?.length ? (
    selectedCustomerProfile.coupons.map(code => (
      <span
        key={code}
        className="bg-[#d4af37]/20 text-[#78532f] border border-[#d4af37]/40 text-[10px] px-2 py-1 rounded-sm font-semibold">
        {code}
      </span>
    ))
  ) : (
    <span>No Coupons Issued</span>
  )}
</div>
                  <p><strong className="font-medium text-stone-800">LTV:</strong> ₹{Number(
selectedCustomerProfile.lifetimeValue || 0
).toLocaleString("en-IN")}</p>
                  <p><strong className="font-medium text-stone-800">Frequency:</strong> {selectedCustomerProfile.purchaseFrequency || 0} orders/month</p>
                  <p><strong className="font-medium text-stone-800">Last Purchase:</strong> {selectedCustomerProfile.lastPurchaseDate ? new Date(selectedCustomerProfile.lastPurchaseDate).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>

            

              {/* Issue Coupon form */}
              <div className="space-y-1.5 border-t border-stone-100 pt-3">
                <h5 className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Issue Coupon</h5>
                {couponSuccess && <p className="text-green-700 text-[10px]">Coupon code issued!</p>}
                <form onSubmit={handleIssueCouponSubmit} className="flex gap-2">
                  <input
                    type="text" placeholder="e.g. OUD15..."
                    value={couponCode} onChange={(e) => {
  setCouponCode(e.target.value.toUpperCase());
  setCouponTargetId(selectedCustomerProfile._id);
}}
                    className="bg-stone-50 border border-stone-200 rounded-sm py-1 px-2 text-xs flex-grow focus:outline-none focus:border-[#d4af37] uppercase"
                  />
                  <button type="submit" className="bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold px-3 py-1 rounded-sm uppercase">
                    Issue
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-stone-400 font-light text-xs">
              Select a customer to view profile details and issue coupon codes.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomersTab;
