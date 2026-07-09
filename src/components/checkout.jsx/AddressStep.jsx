import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';

const AddressStep = ({ addressForm, onInputChange, onSubmit }) => {
  return (
    <motion.div
      key="step-address"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-base font-bold uppercase tracking-widest text-stone-800 mb-5 flex items-center gap-2 border-b border-stone-200/60 pb-2">
        <MapPin className="w-4 h-4 text-[#c59b27]" />
        Delivery Information
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">Recipient Full Name</label>
          <input
            type="text"
            required
            name="fullName"
            placeholder="e.g. Namya Shah"
            value={addressForm.fullName}
            onChange={onInputChange}
            className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c59b27]/30 focus:border-[#c59b27] transition-all text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">Mobile Phone Number</label>
          <input
            type="tel"
            required
            name="phone"
            placeholder="e.g. 9876543210"
            value={addressForm.phone}
            onChange={onInputChange}
            className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c59b27]/30 focus:border-[#c59b27] transition-all text-sm font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">Street Address</label>
          <input
            type="text"
            required
            name="street"
            placeholder="Apartment, suite, building, street address..."
            value={addressForm.street}
            onChange={onInputChange}
            className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c59b27]/30 focus:border-[#c59b27] transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">City</label>
            <input
              type="text"
              required
              name="city"
              placeholder="e.g. Mumbai"
              value={addressForm.city}
              onChange={onInputChange}
              className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c59b27]/30 focus:border-[#c59b27] transition-all text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">State</label>
            <input
              type="text"
              required
              name="state"
              placeholder="e.g. Maharashtra"
              value={addressForm.state}
              onChange={onInputChange}
              className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c59b27]/30 focus:border-[#c59b27] transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">Pin Code</label>
            <input
              type="text"
              required
              name="postalCode"
              placeholder="e.g. 400001"
              value={addressForm.postalCode}
              onChange={onInputChange}
              className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c59b27]/30 focus:border-[#c59b27] transition-all text-sm font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">Country</label>
            <input
              type="text"
              required
              name="country"
              placeholder="e.g. India"
              value={addressForm.country}
              onChange={onInputChange}
              className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c59b27]/30 focus:border-[#c59b27] transition-all text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-6 bg-[#26201c] hover:bg-[#3d332d] text-white font-bold text-xs tracking-[0.2em] uppercase rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          Proceed to Payment
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
};

export default AddressStep;
