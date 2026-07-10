import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const InventoryTab = ({
  inventoryList, inventoryHistory,
  selectedInventoryProduct, setSelectedInventoryProduct,
  inventoryAction, setInventoryAction,
  inventoryQuantity, setInventoryQuantity,
  inventorySuccess, handleAdjustInventorySubmit
}) => {
  return (
    <motion.div
      key="inventory"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-light text-[#261c16] tracking-tight">Inventory & Stock Tracking</h1>
          <p className="text-xs text-stone-500 font-light mt-1">Monitor available stock levels, view low stock alerts, and record adjustment logs.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Low Stock: {inventoryList.filter(i => i.countInStock <= (i.lowStockThreshold || 10) && i.countInStock > 0).length}
          </div>
          <div className="bg-red-100 border border-red-300 text-red-900 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 font-black" />
            Out of Stock: {inventoryList.filter(i => i.countInStock === 0).length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Available Stock Table */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Stock Inventory levels</h3>

          <div className="overflow-x-auto h-[350px] overflow-y-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold sticky top-0 bg-white">
                  <th className="py-2.5 px-2">Perfume Name</th>
                  <th className="py-2.5 px-2">Available</th>
                  <th className="py-2.5 px-2">Reserved</th>
                  <th className="py-2.5 px-2">Sold</th>
                  <th className="py-2.5 px-2">Threshold</th>
                  <th className="py-2.5 px-2">Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                {inventoryList.map((item) => {
                  const isLow = item.countInStock <= (item.lowStockThreshold || 10);
                  const isOut = item.countInStock === 0;
                  return (
                    <tr key={item._id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-2 text-stone-850">{item.name}</td>
                      <td className="py-2.5 px-2 font-mono font-bold">{item.countInStock}</td>
                      <td className="py-2.5 px-2 font-mono text-stone-400">{item.reservedStock || 0}</td>
                      <td className="py-2.5 px-2 font-mono text-green-700">{item.soldStock || 0}</td>
                      <td className="py-2.5 px-2 font-mono text-stone-400">{item.lowStockThreshold || 10}</td>
                      <td className="py-2.5 px-2">
                        {isOut ? (
                          <span className="bg-red-100 text-red-800 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">Out of Stock</span>
                        ) : isLow ? (
                          <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">Low Stock</span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">Healthy</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adjust Stock Form */}
        <div className="lg:col-span-1 bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Inventory Actions</h3>

          {inventorySuccess && <div className="p-3 bg-green-50 text-green-800 text-xs rounded-sm">Stock adjusted and logged!</div>}

          <form onSubmit={handleAdjustInventorySubmit} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Select Perfume</label>
              <select
                value={selectedInventoryProduct} onChange={(e) => setSelectedInventoryProduct(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 cursor-pointer"
              >
                <option value="">-- Choose Perfume --</option>
                {inventoryList.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Action</label>
              <select
                value={inventoryAction} onChange={(e) => setInventoryAction(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 cursor-pointer"
              >
                <option value="Add">Add Inventory (+)</option>
                <option value="Reduce">Reduce Inventory (-)</option>
                <option value="Adjustment">Stock Adjustment (Exact)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Quantity</label>
              <input
                type="number" min="0" value={inventoryQuantity} onChange={(e) => setInventoryQuantity(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 font-mono"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold tracking-widest uppercase rounded-sm shadow-md transition-colors">
              Perform Operation
            </button>
          </form>
        </div>
      </div>

      {/* Inventory history logging */}
      <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-xs">
        <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold mb-4 border-b border-stone-100 pb-2">Inventory transaction logs</h3>
        <div className="overflow-x-auto max-h-[250px] overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold sticky top-0 bg-white">
                <th className="py-2.5 px-2">Log Date</th>
                <th className="py-2.5 px-2">Product</th>
                <th className="py-2.5 px-2">Action</th>
                <th className="py-2.5 px-2">Quantity Change</th>
                <th className="py-2.5 px-2">Operator (RBAC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-medium font-mono text-[10px]">
              {inventoryHistory.map((log) => (
                <tr key={log._id}>
                  <td className="py-2 px-2 text-stone-400">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-2 text-stone-800 font-sans">{log.product?.name || 'Removed Product'}</td>
                  <td className="py-2 px-2">
                    <span className={`px-1.5 py-0.5 rounded-xs text-[8px] font-bold uppercase tracking-wider ${
                      log.action === 'Add' ? 'bg-green-50 text-green-700' : log.action === 'Reduce' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-bold">{log.quantity}</td>
                  <td className="py-2 px-2 font-sans text-stone-500">
                    {log.user?.name} ({log.user?.role})
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

export default InventoryTab;
