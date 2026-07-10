import React from 'react';
import { motion } from 'framer-motion';

const SettingsTab = ({
  businessName, setBusinessName,
  gstNumber, setGstNumber,
  businessAddress, setBusinessAddress,
  gstPercent, setGstPercent,
  stateTax, setStateTax,
  invoiceLogo, setInvoiceLogo,
  invoiceFooter, setInvoiceFooter,
  invoiceTerms, setInvoiceTerms,
  settingsSuccess, handleSaveStoreSettings
}) => {
  return (
    <motion.div
      key="settings-gst"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="max-w-3xl bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6"
    >
      <div>
        <h1 className="text-xl font-light text-[#261c16] tracking-tight">Atelier Store Settings</h1>
        <p className="text-xs text-stone-500 font-light mt-1">Configure business identifiers, tax/GST percentages, invoice logos, and checkout terms.</p>
      </div>

      {settingsSuccess && (
        <div className="p-3 bg-green-50 text-green-800 text-xs rounded-sm">
          Atelier configurations updated successfully!
        </div>
      )}

      <form onSubmit={handleSaveStoreSettings} className="space-y-5 text-xs text-stone-700 font-semibold">

        {/* General Settings */}
        <div className="space-y-4">
          <h4 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold border-b border-stone-100 pb-1">
            General Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Business Name</label>
              <input
                type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">GST Number</label>
              <input
                type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none font-mono"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Business Address</label>
            <input
              type="text" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Tax Settings */}
        <div className="space-y-4 pt-3">
          <h4 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold border-b border-stone-100 pb-1">
            Tax Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">GST Percentage (%)</label>
              <input
                type="number" value={gstPercent} onChange={(e) => setGstPercent(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">State Tax (%)</label>
              <input
                type="number" value={stateTax} onChange={(e) => setStateTax(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="space-y-4 pt-3">
          <h4 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold border-b border-stone-100 pb-1">
            Invoice Configurations
          </h4>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Atelier Logo Path (URL)</label>
              <input
                type="text" value={invoiceLogo} onChange={(e) => setInvoiceLogo(e.target.value)}
                placeholder="/uploads/logo-atelier.png"
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Invoice Footer template</label>
              <input
                type="text" value={invoiceFooter} onChange={(e) => setInvoiceFooter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Terms &amp; Conditions</label>
              <textarea
                rows="2" value={invoiceTerms} onChange={(e) => setInvoiceTerms(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full py-3 bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold tracking-widest uppercase rounded-sm shadow-md transition-colors">
          Save Configurations
        </button>
      </form>
    </motion.div>
  );
};

export default SettingsTab;
