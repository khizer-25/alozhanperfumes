import React from 'react';
import {
  BarChart3, PlusCircle, Layers, Package, Users, MessageSquare,
  RefreshCw, CreditCard, ShoppingBag, Shield, Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'analytics', label: 'Live Analytics', icon: BarChart3 },
  { key: 'add-product', label: 'Add Perfume', icon: PlusCircle },
  { key: 'manage-products', label: 'Store Catalog', icon: Layers },
  { key: 'inventory', label: 'Inventory Stock', icon: Package },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'reviews', label: 'Reviews', icon: MessageSquare },
  { key: 'returns', label: 'Returns Queue', icon: RefreshCw },
  { key: 'payments', label: 'Payment gateways', icon: CreditCard },
  { key: 'manage-orders', label: 'Manage Orders', icon: ShoppingBag },
  { key: 'staff', label: 'Staff (RBAC)', icon: Shield },
  { key: 'settings-gst', label: 'Atelier Settings', icon: Settings },
  { key: 'customer-queries', label: 'Contact Queries', icon: MessageSquare },
];

const Sidebar = ({ activeTab, setActiveTab, currentUserRole, syncData }) => {
  return (
    <div className="w-full md:w-64 bg-[#1a1512] text-[#f7f5f2] border-r border-[#d4af37]/15 flex-shrink-0 flex flex-col justify-between p-6">
      <div>
        <div className="border-b border-[#d4af37]/10 pb-4 mb-6">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37] font-bold block mb-1">
            Atelier Control Console
          </span>
          <h2 className="text-xl font-bold tracking-tighter text-white uppercase">Al Özhan Admin</h2>
        </div>

        <nav className="space-y-1.5 h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === key ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-stone-500 font-mono">
        <span>Privilege: {currentUserRole}</span>
        <button onClick={syncData} className="p-1 hover:bg-white/5 text-stone-400 rounded-full transition-all">
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
