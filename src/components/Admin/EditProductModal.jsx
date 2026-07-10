import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';

const EditProductModal = ({
  editingProduct, setEditingProduct,
  categories, families, genders, occasionList,
  editProductName, setEditProductName,
  editProductBrand, setEditProductBrand,
  editProductCategory, setEditProductCategory,
  editProductPrice, setEditProductPrice,
  editProductStock, setEditProductStock,
  editProductDescription, setEditProductDescription,
  editProductImage,
  editTopNotesText, setEditTopNotesText,
  editMiddleNotesText, setEditMiddleNotesText,
  editBaseNotesText, setEditBaseNotesText,
  editPerfumeFamily, setEditPerfumeFamily,
  editPerfumeGender, setEditPerfumeGender,
  editPerfumeOccasions, handleEditOccasionToggle,
  editUploading, handleEditImageUpload,
  editFormError, handleUpdateProductSubmit
}) => {
  return (
    <AnimatePresence>
      {editingProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white border border-stone-200 w-full max-w-3xl rounded-sm p-6 shadow-2xl my-8 relative flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-light text-[#261c16] tracking-tight">Edit Perfume Catalogue</h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">Modify fragrance notes, category, family, price, stock, and graphics.</p>
            </div>

            {editFormError && <div className="p-3 mb-4 bg-red-50 text-red-800 text-xs rounded-sm">{editFormError}</div>}

            <form onSubmit={handleUpdateProductSubmit} className="space-y-4 text-xs text-stone-700 font-semibold overflow-y-auto pr-1 scrollbar-thin flex-1">

              {/* 1. Core Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Perfume Name</label>
                  <input
                    type="text" required placeholder="e.g. Royal Oud Intense"
                    value={editProductName} onChange={(e) => setEditProductName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Designer Brand</label>
                  <input
                    type="text" required placeholder="e.g. Al Özhan"
                    value={editProductBrand} onChange={(e) => setEditProductBrand(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Olfactory Note Category</label>
                  <select
                    value={editProductCategory} onChange={(e) => setEditProductCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Unit Price ($)</label>
                  <input
                    type="number" required min="1" placeholder="e.g. 195"
                    value={editProductPrice} onChange={(e) => setEditProductPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">In-Stock Units</label>
                  <input
                    type="number" required min="0" placeholder="10"
                    value={editProductStock} onChange={(e) => setEditProductStock(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* 2. Fragrance Specifics */}
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
                      value={editTopNotesText} onChange={(e) => setEditTopNotesText(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Middle Notes</label>
                    <input
                      type="text" placeholder="Comma separated, e.g. Rose, Orchid"
                      value={editMiddleNotesText} onChange={(e) => setEditMiddleNotesText(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Base Notes</label>
                    <input
                      type="text" placeholder="Comma separated, e.g. Amber, Musk"
                      value={editBaseNotesText} onChange={(e) => setEditBaseNotesText(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Scent Family */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Perfume Scent Family</label>
                    <select
                      value={editPerfumeFamily} onChange={(e) => setEditPerfumeFamily(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-sm py-2 px-3 focus:outline-none cursor-pointer"
                    >
                      {families.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  {/* Gender target */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Gender Focus</label>
                    <select
                      value={editPerfumeGender} onChange={(e) => setEditPerfumeGender(e.target.value)}
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
                          onClick={() => handleEditOccasionToggle(occ)}
                          className={`py-1 px-2.5 border rounded-full text-[9px] font-bold transition-all ${
                            editPerfumeOccasions.includes(occ)
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
                  value={editProductDescription} onChange={(e) => setEditProductDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none focus:border-[#d4af37] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Perfume Media Image</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-dashed border-stone-200 hover:border-[#d4af37] rounded-sm p-4 bg-stone-50 flex flex-col items-center justify-center text-center cursor-pointer relative">
                    <input type="file" accept="image/*" onChange={handleEditImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={editUploading} />
                    <Upload className="w-5 h-5 text-stone-400 mb-1" />
                    <span className="text-[9px] text-stone-600 block">{editUploading ? 'Uploading image...' : 'Upload Image file'}</span>
                  </div>
                  <div className="space-y-2">
                    <input type="text" placeholder="URL path..." value={editProductImage} readOnly className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-500 font-mono text-[10px]" />
                    {editProductImage && (
                      <div className="w-14 h-14 border border-stone-200 rounded-xs overflow-hidden">
                        <img src={editProductImage.startsWith('http') ? editProductImage : `https://ozhan-backend.onrender.com${editProductImage}`} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-1/3 py-3 border border-stone-200 hover:bg-stone-50 text-stone-750 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editUploading}
                  className="flex-1 py-3 bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold tracking-widest uppercase rounded-sm transition-colors shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProductModal;
