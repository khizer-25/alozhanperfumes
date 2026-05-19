import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Eye, Star, Grid3X3, ArrowUpDown, X } from 'lucide-react';
import { products as localProducts } from '../../data/products';

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState(localProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(500); // Updated default max to match range scale
  
  // Quick View Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ==========================================
     PERMANENT BACKEND API CONNECTION (FUTURE USE)
     ==========================================
     Uncomment this section when your backend is ready.
  */
  /*
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.orvelia.com/v1/products'); // Replace with actual backend API link
        if (!response.ok) throw new Error('Failed to capture atelier vault data.');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  */

  // --- Dynamic Category Aggregation ---
  const categories = ['All', ...new Set(localProducts.map(p => p.category))];

  // Helper to strip '$' if price is supplied as a string instead of number
  const cleanPrice = (price) => {
    if (typeof price === 'number') return price;
    return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
  };

  // --- Filter and Sort Core Logic ---
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = cleanPrice(product.price) <= priceRange;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return cleanPrice(a.price) - cleanPrice(b.price);
      if (sortBy === 'price-high') return cleanPrice(b.price) - cleanPrice(a.price);
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.id - b.id; // Featured default sorting
    });

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-32 pb-24 px-6 font-sans antialiased text-[#362720]">
      <div className="max-w-7xl mx-auto">
        
        {/* --- PAGE TITLE HEADER --- */}
        <div className="text-center mb-12">
          <p className="text-[#b38f44] text-xs tracking-[0.4em] mb-3 uppercase font-bold">The Complete Archive</p>
          <h1 className="text-4xl md:text-5xl font-light text-[#261c16] tracking-tight mb-4">The Olfactory Library</h1>
          <div className="w-20 h-[1px] bg-[#d4af37] mx-auto mb-6" />
          <p className="max-w-2xl mx-auto text-stone-600 text-sm md:text-base font-light leading-relaxed">
            Browse through every engineered formula, raw extraction, and limited reserve artifact in the Orvélia collection.
          </p>
        </div>

        {/* --- CONTROLS OVERVIEW BAR (Search & Filters) --- */}
        <div className="bg-white border border-stone-200/80 p-6 rounded-sm shadow-sm flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-12">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text"
              placeholder="Search fragrance notes, names, ouds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-sm py-3 pl-12 pr-4 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>

          {/* Sorter and Price Range Sliders */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Price Filter Slider */}
            <div className="flex items-center gap-3 min-w-[200px]">
              <span className="text-xs tracking-wider uppercase text-stone-500 font-medium">Max Price:</span>
              <input 
                type="range" 
                min="50" 
                max="500" 
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="accent-[#d4af37] bg-stone-200 h-1 flex-grow rounded-sm cursor-pointer"
              />
              <span className="text-sm font-mono text-[#b38f44] font-semibold">${priceRange}</span>
            </div>

            {/* Dropdown Sorter Selector */}
            <div className="flex items-center gap-2 border border-stone-200 rounded-sm px-3 py-2.5 bg-stone-50">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#b38f44]" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs tracking-wider uppercase text-stone-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- CATEGORY QUICK NAVIGATION SEGMENT --- */}
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-10 border-b border-stone-200 pb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase border transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#d4af37] text-white border-[#d4af37] shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* --- PRODUCT QUANTITY INDICATOR COUNTER --- */}
        <p className="text-stone-500 text-xs tracking-widest uppercase font-light mb-6 flex items-center gap-2">
          <Grid3X3 className="w-3.5 h-3.5 opacity-60" />
          Showing {filteredProducts.length} items of {products.length} catalog elements
        </p>

        {/* --- MAIN PRODUCT GRID CONTAINER --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-stone-200/60 rounded-sm overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between group"
              >
                {/* Visual Imagery Box Container */}
                <div className="h-72 overflow-hidden relative bg-stone-100">
                  <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-[1.2s] scale-105 group-hover:scale-100"
                  />
                  {/* Floating Size Tag */}
                  {product.size && (
                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[10px] tracking-widest font-mono text-stone-700 px-2 py-0.5 rounded-xs border border-stone-200/50 z-20">
                      {product.size}
                    </span>
                  )}
                  {/* Functional Quick View Trigger Button */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="p-2 bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full text-stone-600 hover:text-[#b38f44] shadow-xs hover:scale-105 transition-all"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Meta Description Area Content Block */}
                <div className="p-5 flex-grow flex flex-col justify-between text-center border-t border-stone-100">
                  <div>
                    <p className="text-[#b38f44] text-[10px] tracking-[0.2em] uppercase mb-1 font-semibold">
                      {product.category}
                    </p>
                    <h3 className="text-base font-medium text-stone-800 mb-2 tracking-wide group-hover:text-[#b38f44] transition-colors duration-300">
                      {product.name}
                    </h3>

                    {/* Dynamic Stars Engine Rendering */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-stone-200'}`} 
                        />
                      ))}
                      <span className="text-[10px] text-stone-400 font-mono ml-1">({product.rating || '5.0'})</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-lg font-light text-stone-900 mb-4 tracking-wider">
                      {typeof product.price === 'number' ? `$${product.price}` : product.price}
                    </p>

                    {/* Fully Functional Add To Cart Action Hook */}
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full py-2.5 bg-transparent border border-[#d4af37] text-[#b38f44] text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      ADD TO CART
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- EMPTY RESULT GRAPHIC NOTICE --- */}
        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white rounded-sm border border-stone-200 shadow-xs mt-6"
          >
            <p className="text-stone-500 tracking-wider font-medium uppercase text-sm mb-2">No matching blends discovered</p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">Try refining your filter criteria, reducing price bounds, or checking for alternate olfactory signatures.</p>
          </motion.div>
        )}

      </div>

      {/* --- QUICK VIEW LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-2xl w-full rounded-sm shadow-2xl relative overflow-hidden flex flex-col md:flex-row text-stone-800"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-30 p-1.5 bg-white/80 rounded-full border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-stone-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[#b38f44] text-[10px] tracking-widest uppercase font-bold">{selectedProduct.category}</span>
                  <h2 className="text-2xl font-light tracking-tight text-stone-900 mt-1 mb-2">{selectedProduct.name}</h2>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(selectedProduct.rating || 5) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-stone-200'}`} />
                    ))}
                    <span className="text-xs text-stone-500 font-mono ml-2">({selectedProduct.rating || '5.0'})</span>
                  </div>
                  
                  <p className="text-sm text-stone-600 font-light leading-relaxed mb-4">
                    Experience an curated premium arrangement composed of rare structural compounds, custom configured for luxury standard endurance.
                  </p>
                  
                  {selectedProduct.size && (
                    <div className="text-xs text-stone-500 font-mono mb-2">
                      Bottle Size: <span className="text-stone-800 font-semibold">{selectedProduct.size}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-stone-100 pt-4">
                  <div className="text-2xl font-light text-stone-900 mb-4">
                    {typeof selectedProduct.price === 'number' ? `$${selectedProduct.price}` : selectedProduct.price}
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full py-3 bg-[#d4af37] text-white text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#b38f44] transition-all duration-300 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    ADD TO BAG
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;