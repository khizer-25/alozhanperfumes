<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { api } from '../../utils/api';

const ProductList = ({ onAddToCart }) => {
  const mockProducts = [
=======
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Star } from 'lucide-react';

const ProductList = ({ onAddToCart }) => {
  const products = [
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
    {
      id: 1,
      name: 'Royal Oud Intense',
      category: 'Artisan Ouds',
<<<<<<< HEAD
      price: 240,
=======
      price: '$240',
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      rating: 5,
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Velvet Musk Absolute',
      category: 'Noble Essences',
<<<<<<< HEAD
      price: 185,
=======
      price: '$185',
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      rating: 4,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Smoked Saffron',
      category: 'Custom Blends',
<<<<<<< HEAD
      price: 210,
=======
      price: '$210',
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      rating: 5,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      name: 'Midnight Bakhoor',
      category: 'Artisan Ouds',
<<<<<<< HEAD
      price: 195,
=======
      price: '$195',
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      rating: 5,
      image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      name: 'Imperial Rose Water',
      category: 'Noble Essences',
<<<<<<< HEAD
      price: 160,
=======
      price: '$160',
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      rating: 4,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      name: 'Amber Élite',
      category: 'Custom Blends',
<<<<<<< HEAD
      price: 225,
=======
      price: '$225',
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      rating: 5,
      image: 'https://images.unsplash.com/photo-1512203530485-2a6081498144?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 7,
      name: 'Golden Agarwood',
      category: 'Artisan Ouds',
<<<<<<< HEAD
      price: 310,
=======
      price: '$310',
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      rating: 5,
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 8,
      name: 'Mystic Scent Atelier',
      category: 'Custom Blends',
<<<<<<< HEAD
      price: 190,
=======
      price: '$190',
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
      rating: 4,
      image: 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=600&auto=format&fit=crop&q=80',
    },
  ];

<<<<<<< HEAD
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get('/products?pageSize=8');
        
        // If products exist in db, use them. Otherwise, let it fallback to mock
        if (data.products && data.products.length > 0) {
          // Normalize matching structures (e.g. id field)
          const normalized = data.products.map(p => ({
            ...p,
            id: p._id, // Assign database id to react key
          }));
          setProducts(normalized);
        }
      } catch (err) {
        console.warn('API connection failed or timed out. Falling back to signature mock collections:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveProducts();
  }, []);

=======
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
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
<<<<<<< HEAD
        <p className="max-w-2xl mx-auto text-[#382820] text-sm md:text-base leading-relaxed font-light font-sans">
=======
        <p className="max-w-2xl mx-auto text-[#382820] text-sm md:text-base leading-relaxed font-light">
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
          Explore liquid poetry. Every bottle houses rare extractions, aged agarwood, and tailored molecules mixed by hand.
        </p>
      </div>

      {/* --- PRODUCT GRID (2 Rows, 4 Columns) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
<<<<<<< HEAD
        {products.map((product, index) => (
          <motion.div
            key={product.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
=======
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: product.id * 0.05 }}
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
            className="bg-[#26201c] rounded-sm overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between group"
          >
            <div className="h-80 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10" />
<<<<<<< HEAD
              {product.image.startsWith('http') ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] scale-105 group-hover:scale-100"
                />
              ) : (
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] scale-105 group-hover:scale-100"
                />
              )}
=======
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[1.2s] scale-105 group-hover:scale-100"
              />
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-[#26201c]/80 backdrop-blur-sm border border-white/10 rounded-full text-stone-300 hover:text-[#d4af37]">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between text-center">
              <div>
                <p className="text-[#d4af37]/70 text-[10px] tracking-[0.2em] uppercase mb-1 font-medium">
                  {product.category}
                </p>
                <h3 className="text-lg font-medium text-white mb-2 tracking-wide group-hover:text-[#d4af37] transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="flex justify-center gap-1 mb-4 opacity-60">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
<<<<<<< HEAD
                      className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-stone-600'}`} 
=======
                      className={`w-3 h-3 ${i < product.rating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-stone-600'}`} 
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
                    />
                  ))}
                </div>
              </div>

              <div>
<<<<<<< HEAD
                <p className="text-xl font-light text-stone-200 mb-6 tracking-wider font-mono">
                  ${product.price}
=======
                <p className="text-xl font-light text-stone-200 mb-6 tracking-wider">
                  {product.price}
>>>>>>> 5871381b716b4a0776dfb39179167000712b33ac
                </p>

                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full py-3 bg-transparent border border-[#d4af37] text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  ADD TO CART
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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