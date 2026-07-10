import React from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle } from 'lucide-react';

const AddProductTab = ({
  categories, families, genders, occasionList,
  newProductName, setNewProductName,
  newProductBrand, setNewProductBrand,
  newProductCategory, setNewProductCategory,
  newProductPrice, setNewProductPrice,
  newProductStock, setNewProductStock,
  newProductDescription, setNewProductDescription,
  newProductImage,
  topNotesText, setTopNotesText,
  middleNotesText, setMiddleNotesText,
  baseNotesText, setBaseNotesText,
  perfumeFamily, setPerfumeFamily,
  perfumeGender, setPerfumeGender,
  perfumeOccasions, handleOccasionToggle,
  uploading, handleImageUpload,
  formError, formSuccess, handleAddProduct
}) => {
  return (
    <motion.div
      key="add-product"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="max-w-3xl bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6"
    >
      <div>
        <h1 className="text-xl font-light text-[#261c16] tracking-tight">Add New Perfume</h1>
        <p className="text-xs text-stone-500 font-light mt-1">Configure perfume note attributes, scent families, gender target and stock metrics.</p>
      </div>

      {formError && <div className="p-3 bg-red-50 text-red-800 text-xs rounded-sm">{formError}</div>}
      {formSuccess && (
        <div className="p-3 bg-green-50 text-green-800 text-xs rounded-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Perfume catalog published successfully!</span>
        </div>
      )}

      <form onSubmit={handleAddProduct} className="space-y-5 text-xs text-stone-700 font-semibold">

        {/* 1. Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Perfume Name</label>
            <input
              type="text" required placeholder="e.g. Royal Oud Intense"
              value={newProductName} onChange={(e) => setNewProductName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Designer Brand</label>
            <input
              type="text" required placeholder="e.g. Al Özhan"
              value={newProductBrand} onChange={(e) => setNewProductBrand(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Olfactory Note Category</label>
            <select
              value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Unit Price ($)</label>
            <input
              type="number" required min="1" placeholder="e.g. 195"
              value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">In-Stock Units</label>
            <input
              type="number" required min="0" placeholder="10"
              value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white font-mono"
            />
          </div>
        </div>

        {/* 2. Fragrance Specifics (Very Important) */}
        <div className="border border-stone-200/50 p-4 bg-stone-50/30 space-y-4 rounded-sm">
          <h3 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold border-b border-stone-200 pb-1.5">
            Fragrance Characteristics
          </h3>

          {/* Notes fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Top Notes</label>
              <input
                type="text" placeholder="Comma separated, e.g. Lime, Mint"
                value={topNotesText} onChange={(e) => setTopNotesText(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Middle Notes</label>
              <input
                type="text" placeholder="Comma separated, e.g. Rose, Orchid"
                value={middleNotesText} onChange={(e) => setMiddleNotesText(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Base Notes</label>
              <input
                type="text" placeholder="Comma separated, e.g. Amber, Musk"
                value={baseNotesText} onChange={(e) => setBaseNotesText(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Scent Family */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Perfume Scent Family</label>
              <select
                value={perfumeFamily} onChange={(e) => setPerfumeFamily(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none cursor-pointer"
              >
                {families.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Gender target */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Gender Focus</label>
              <select
                value={perfumeGender} onChange={(e) => setPerfumeGender(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none cursor-pointer"
              >
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Occasion Checklist */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Occasions</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {occasionList.map(occ => (
                  <button
                    key={occ} type="button"
                    onClick={() => handleOccasionToggle(occ)}
                    className={`py-1 px-2.5 border rounded-full text-[9px] font-bold transition-all ${
                      perfumeOccasions.includes(occ)
                        ? 'bg-[#d4af37] text-black border-[#d4af37]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Scent Description</label>
          <textarea
            required rows="3" placeholder="Notes outline description..."
            value={newProductDescription} onChange={(e) => setNewProductDescription(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Perfume Media Image</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-dashed border-stone-200 hover:border-[#d4af37] rounded-sm p-4 bg-stone-50 flex flex-col items-center justify-center text-center cursor-pointer relative">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
              <Upload className="w-5 h-5 text-stone-400 mb-1" />
              <span className="text-[9px] text-stone-600 block">{uploading ? 'Uploading image...' : 'Upload Image file'}</span>
            </div>
            <div className="space-y-2">
              <input type="text" placeholder="URL path..." value={newProductImage} readOnly className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-500 font-mono text-[10px]" />
              {newProductImage && (
                <div className="w-14 h-14 border border-stone-200 rounded-xs overflow-hidden">
                  <img src={newProductImage.startsWith('http') ? newProductImage : `https://ozhan-backend.onrender.com${newProductImage}`} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <button type="submit" disabled={uploading} className="w-full py-3 bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold tracking-widest uppercase rounded-sm transition-colors shadow-md">
          Publish Perfume Blend
        </button>
      </form>
    </motion.div>
  );
};

export default AddProductTab;
