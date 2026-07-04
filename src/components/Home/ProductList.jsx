import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { api } from '../../utils/api';



const ProductList = ({ onAddToCart }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get('/products?pageSize=8');
        
       const normalized = (data.products || []).map((p) => ({
  ...p,
  id: p._id,
}));

setProducts(normalized);
      } catch (err) {
      console.error(err);  
      } finally {
        setLoading(false);
      }
    };

    fetchLiveProducts();
  }, []);
  

  const handleExploreMore = () => {
    window.location.href = '/products';
  };

  return (
    <div className="bg-[#78532f] py-20 px-6 font-sans antialiased">
      
      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <p className="text-[#d4af37] text-xs tracking-[0.3em] mb-3 uppercase font-bold">
          The Curated Collection
        </p>
        <h2 className="text-4xl md:text-5xl font-light text-[#362720] mb-4 tracking-tight leading-tight">
          Our Signature Creations
        </h2>
        <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mb-6" />
        <p className="max-w-2xl mx-auto text-[#382820] text-sm md:text-base leading-relaxed font-light font-sans">
          Explore liquid poetry. Every bottle houses rare extractions, aged agarwood, and tailored molecules mixed by hand.
        </p>
      </div>

      {/* --- PRODUCT GRID (2 Rows, 4 Columns) --- */}
      {/* --- PRODUCT GRID --- */}
{loading ? (
  <div className="text-center py-20">
    <p className="text-white text-lg">Loading products...</p>
  </div>
) : products.length === 0 ? (
  <div className="text-center py-20">
    <h3 className="text-2xl text-white mb-2">No Products Available</h3>
    <p className="text-stone-400">
      Products will appear here once they are added.
    </p>
  </div>
) : (
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
    {products.map((product, index) => (
      <motion.div
        key={product.id || index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-[#26201c] rounded-sm overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between group"
      >
        {/* Keep your existing product card code here exactly as it is */}
      </motion.div>
    ))}
  </div>
)}

      {/* --- EXPLORE MORE CALL TO ACTION --- */}
      <div className="text-center">
        <button
          onClick={handleExploreMore}
          className="inline-flex items-center gap-4 px-12 py-4 bg-gradient-to-r from-[#2a2420] to-[#1a1512] text-white border border-[#d4af37]/30 font-bold text-xs tracking-[0.25em] uppercase hover:border-[#d4af37] shadow-xl transition-all duration-300 rounded-sm hover:tracking-[0.3em]"
        >
          EXPLORE ENTIRE ATELIER
        </button>
      </div>
    </div>
  );
};

export default ProductList;