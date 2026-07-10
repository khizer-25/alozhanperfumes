import React from 'react';
import { motion } from 'framer-motion';

const StaffTab = ({ staffList, currentUserRole, handleUpdateStaffRole }) => {
  return (
    <motion.div
      key="staff"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6"
    >
      <div>
        <h1 className="text-xl font-light text-[#261c16] tracking-tight">Staff & Permissions (RBAC)</h1>
        <p className="text-xs text-stone-500 font-light mt-1">Configure role-based access control permissions. Assign privileges to staff members.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
              <th className="py-2.5 px-2">Operator Name</th>
              <th className="py-2.5 px-2">Email</th>
              <th className="py-2.5 px-2">Access Role privilege</th>
              <th className="py-2.5 px-2">Permissions</th>
              <th className="py-2.5 px-2 text-right">Edit Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
            {staffList.map((s) => {
              const isSuper = s.role === 'super_admin';
              return (
                <tr key={s._id}>
                  <td className="py-3 px-2 text-stone-850 flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-[#1a1512] text-white flex items-center justify-center font-bold text-[9px]">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3 px-2 text-stone-500">{s.email}</td>
                  <td className="py-3 px-2">
                    <span className={`px-1.5 py-0.5 rounded-xs text-[8px] font-bold uppercase tracking-wider ${
                      isSuper ? 'bg-red-50 text-red-700' : s.role === 'admin' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-stone-400 text-[10px] font-light font-mono max-w-[180px] truncate">
                    {s.role === 'super_admin' && 'full_access (all_writes)'}
                    {s.role === 'admin' && 'full_access (except_super)'}
                    {s.role === 'manager' && 'products_orders_inventory'}
                    {s.role === 'inventory_manager' && 'inventory_stock_adjustments'}
                    {s.role === 'marketing_manager' && 'reviews_coupons_catalog'}
                    {s.role === 'customer_support' && 'returns_refunds_moderation'}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {isSuper && currentUserRole !== 'super_admin' ? (
                      <span className="text-[9px] text-stone-400 italic">Locked</span>
                    ) : (
                      <select
                        value={s.role} onChange={(e) => handleUpdateStaffRole(s._id, e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-sm py-1 px-2 text-[10px] focus:outline-none cursor-pointer"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="inventory_manager">Inventory Manager</option>
                        <option value="marketing_manager">Marketing Manager</option>
                        <option value="customer_support">Customer Support</option>
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StaffTab;
