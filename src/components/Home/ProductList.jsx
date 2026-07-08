import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { api } from '../../utils/api';
import { useNavigate } from "react-router-dom";


const ProductList = ({ onAddToCart }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get("/products?pageSize=8");
setProducts(data.products || []);
      } catch (err) {
      console.error(err);  
      } finally {
        setLoading(false);
      }
    };

    fetchLiveProducts();
  }, []);
  


const cleanPrice = (price) => {
  if (typeof price === "number") return price;
  if (!price) return 0;

  return (
    parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0
  );
};

const navigate = useNavigate();

const handleExploreMore = () => {
    navigate("/products");
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
        key={product._id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="bg-[#26201c] rounded-sm overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between group"
      >
       {/* Product Image */}
<div className="relative h-72 overflow-hidden bg-stone-100">
  <img
  src={product.image}
  alt={product.name}
  onError={(e) => {
    e.target.src = "/placeholder.png";
  }}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>

  {product.size && (
    <span className="absolute bottom-3 left-3 bg-white/90 text-[10px] px-2 py-1 rounded">
      {product.size}
    </span>
  )}

  <button
  onClick={() => navigate(`/products/${product._id}`)}
  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition"
>
  <Eye className="w-4 h-4 text-stone-700" />
</button>
</div>

{/* Product Details */}
<div className="p-5 text-center flex flex-col justify-between flex-grow">

  <div>
    <p className="text-[#d4af37] text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">
      {product.category}
    </p>

    <h3 className="text-white text-lg font-medium mb-3">
      {product.name}
    </h3>

    <div className="flex justify-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < Math.floor(product.rating || 0)
              ? "fill-[#d4af37] text-[#d4af37]"
              : "text-stone-500"
          }`}
        />
      ))}

      <span className="text-xs text-stone-400 ml-2">
        ({product.rating || 0})
      </span>
    </div>
  </div>

  <div>
    <p className="text-[#d4af37] text-xl font-light mb-5">
      ₹{cleanPrice(product.price).toLocaleString("en-IN")}
    </p>

   <button
  disabled={product.countInStock === 0}
  onClick={() => onAddToCart(product)}
  className={`w-full py-3 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition
    ${
      product.countInStock > 0
        ? "border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white"
        : "bg-stone-700 text-stone-400 cursor-not-allowed"
    }`}
>
  <ShoppingBag className="w-4 h-4" />
  {product.countInStock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
</button>
  </div>

</div>
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