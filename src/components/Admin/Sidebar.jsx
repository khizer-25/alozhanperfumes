import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, PlusCircle, Layers, Package, Users, MessageSquare,
  RefreshCw, CreditCard, ShoppingBag, Shield, Settings, HelpCircle, ChevronDown
} from 'lucide-react';

const NAVIGATION_GROUPS = [
  {
    group: "Core Operations",
    items: [
      { key: 'analytics', label: 'Live Analytics', icon: BarChart3 },
      { key: 'manage-orders', label: 'Manage Orders', icon: ShoppingBag },
      { key: 'returns', label: 'Returns Queue', icon: RefreshCw },
    ]
  },
  {
    group: "Store Management",
    items: [
      { key: 'add-product', label: 'Add Perfume', icon: PlusCircle },
      { key: 'manage-products', label: 'Store Catalog', icon: Layers },
      { key: 'inventory', label: 'Inventory Stock', icon: Package },
      { key: 'customers', label: 'Customers', icon: Users },
    ]
  },
  {
    group: "Communications",
    items: [
      { key: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
      { key: 'customer-queries', label: 'Contact Queries', icon: HelpCircle },
    ]
  },
  {
    group: "Configurations",
    items: [
      { key: 'payments', label: 'Payment Gateways', icon: CreditCard },
      { key: 'staff', label: 'Staff Permissions', icon: Shield },
      { key: 'settings-gst', label: 'Atelier Settings', icon: Settings },
    ]
  }
];

const Sidebar = ({ activeTab, setActiveTab, currentUserRole, syncData }) => {
  const [openGroups, setOpenGroups] = useState({
    "Core Operations": true,
    "Store Management": true,
    "Communications": false,
    "Configurations": false
  });

  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div 
        className="relative h-screen w-64 bg-[#0d0a09] text-[#f7f5f2] border-r border-[#d4af37]/10 flex flex-col justify-between z-30 antialiased flex-shrink-0 sticky top-0 left-0"
      >
        {/* 
          FIXED: Increased top padding (pt-24) to shift only the internal header content 
          down below the overlaying navbar, while keeping the container structural background touching the screen top.
        */}
        <div className="p-6 pt-24 border-b border-white/[0.03] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#d4af37] font-semibold block">
              Atelier Control Console
            </span>
          </div>
          <h2 className="text-xl font-light tracking-wide text-white mt-1.5 relative z-10">
            Al Özhan <span className="font-semibold text-stone-300">Admin</span>
          </h2>
        </div>

        {/* --- LIST NAVIGATION AREA WITH DROPDOWNS --- */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-3 no-scrollbar">
          {NAVIGATION_GROUPS.map((group) => {
            const isGroupOpen = openGroups[group.group];
            const hasActiveChild = group.items.some(item => item.key === activeTab);

            return (
              <div key={group.group} className="space-y-1 bg-white/[0.01] border border-white/[0.02] p-1.5 rounded-md">
                
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full py-2 px-3 flex items-center justify-between text-[10px] font-semibold tracking-[0.15em] text-stone-500 uppercase hover:text-stone-300 transition-colors duration-200"
                >
                  <span className={hasActiveChild ? "text-[#d4af37]" : ""}>{group.group}</span>
                  <motion.div
                    animate={{ rotate: isGroupOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3 h-3 text-stone-500" />
                  </motion.div>
                </button>

                {/* Dropdown Items Menu */}
                <AnimatePresence initial={false}>
                  {isGroupOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden space-y-0.5 pl-1"
                    >
                      {group.items.map(({ key, label, icon: Icon }) => {
                        const isActive = activeTab === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`w-full py-2 px-3 flex items-center gap-3.5 text-xs tracking-wide transition-all duration-300 text-left rounded-md relative group/btn overflow-hidden ${
                              isActive 
                                ? 'text-white bg-white/[0.04] font-medium' 
                                : 'text-stone-400 hover:text-stone-100 hover:bg-white/[0.02]'
                            }`}
                          >
                            {isActive && (
                              <motion.div 
                                layoutId="activeSideRibbon"
                                className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d4af37] shadow-[0_0_8px_#d4af37]"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            
                            <Icon className={`w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110 ${
                              isActive ? 'text-[#d4af37]' : 'text-stone-500 group-hover/btn:text-stone-300'
                            }`} />
                            
                            <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5">
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* --- FOOTER METRICS ACCESS BAR --- */}
        <div className="p-5 bg-black/40 border-t border-white/[0.03] flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold">Security Access</span>
            <span className="text-xs text-stone-300 font-mono tracking-wide">
              {currentUserRole || 'admin'}
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={syncData} 
            title="Force Sync Remote Data Pipeline"
            className="p-2 bg-white/[0.02] border border-white/5 text-stone-400 hover:text-[#d4af37] hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 rounded-md transition-all duration-300 shadow-md shadow-black/40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;