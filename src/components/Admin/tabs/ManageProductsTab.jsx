import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search, Star } from 'lucide-react';

const ManageProductsTab = ({ products, loading, handleEditProductClick, handleDeleteProduct }) => {
 const [searchTerm, setSearchTerm] = useState("");
const [deletingId, setDeletingId] = useState("");

const filteredProducts = useMemo(() => {
  return products.filter((product) => {
    const search = searchTerm.toLowerCase();

    return (
      product.name?.toLowerCase().includes(search) ||
      product.brand?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search) ||
      product.family?.toLowerCase().includes(search)
    );
  });
}, [products, searchTerm]);

const handleDelete = async (id) => {
  try {
    setDeletingId(id);
    await handleDeleteProduct(id);
  } finally {
    setDeletingId("");
  }
};

  return (
    <motion.div
      key="manage-products"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6"
    >
      <div>
        <h1 className="text-xl font-light text-[#261c16] tracking-tight">Active Catalogs</h1>
        <p className="text-xs text-stone-500 font-light mt-1">Manage database catalogue elements, monitor inventory levels, and delete items.</p>
      </div>
<div className="relative max-w-sm">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />

  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full border border-stone-200 rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-[#d4af37]"
  />
</div>
      {loading ? (
        <div className="text-center py-10 text-xs text-stone-400">Loading catalog...</div>
      ) : filteredProducts.length === 0 ? (
       <div className="text-center py-10 text-xs text-stone-400">
  No matching products found.
</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                <th className="py-2.5 px-2">Image</th>
                <th className="py-2.5 px-2">Name</th>
                <th className="py-2.5 px-2">Brand</th>
                <th className="py-2.5 px-2">Family</th>
                <th className="py-2.5 px-2">Gender</th>
                <th className="py-2.5 px-2">Notes</th>
                <th className="py-2.5 px-2 text-right">Price</th>
                <th className="py-2.5 px-2 text-center">Rating</th>
                <th className="py-2.5 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-stone-50/50">
                  <td className="py-2.5 px-2">
                    <div className="w-8 h-10 bg-stone-100 rounded-xs overflow-hidden border border-stone-200/50">
                     <img
  src={product.image}
  alt={product.name}
  className="w-full h-full object-cover"
/>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-stone-850">{product.name}</td>
                  <td className="py-2.5 px-2 text-stone-400">{product.brand}</td>
                  <td className="py-2.5 px-2 text-amber-700">{product.family || 'Floral'}</td>
                  <td className="py-2.5 px-2 text-stone-500">{product.gender || 'Unisex'}</td>
                  <td className="py-2.5 px-2 text-stone-400 text-[10px] max-w-[150px] truncate">
                    {product.topNotes?.join(', ') || 'N/A'}
                  </td>
                  <td className="py-2.5 px-2 text-right font-semibold font-mono text-[#78532f]">${Number(product.price || 0).toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center">
  <div className="flex items-center justify-center gap-1">
    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
    <span>
      {Number(product.rating || 0).toFixed(1)}
    </span>
    <span className="text-[10px] text-stone-400">
      ({product.numReviews || 0})
    </span>
  </div>
</td>
                  <td className="py-2.5 px-2 text-center space-x-2 whitespace-nowrap">
                    <button onClick={() => handleEditProductClick(product)} className="p-1 text-stone-400 hover:text-[#d4af37] rounded-full transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                   <button
  onClick={() => handleDelete(product._id)}
  disabled={deletingId === product._id}
  className={`p-1 rounded-full transition-all ${
    deletingId === product._id
      ? "opacity-50 cursor-not-allowed"
      : "text-stone-400 hover:text-red-500"
  }`}
>
  {deletingId === product._id ? (
    <span className="text-[10px]">...</span>
  ) : (
    <Trash2 className="w-4 h-4" />
  )}
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ManageProductsTab;
