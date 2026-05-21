import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, PlusCircle, Layers, DollarSign, 
  ShoppingBag, ClipboardList, TrendingUp, Trash2, 
  Upload, CheckCircle, RefreshCw, Star 
} from 'lucide-react';
import { api } from '../../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Product Form States
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Floral');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('10');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const categories = ['Floral', 'Fresh', 'Woody', 'Gourmand', 'Musk', 'Aromatic', 'Oriental'];

  const syncData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all store products
      const productRes = await api.get('/products?pageSize=100');
      const loadedProducts = productRes.products || [];
      setProducts(loadedProducts);

      // Fetch all system orders (requires admin permission)
      const loadedOrders = await api.get('/orders');
      setOrders(loadedOrders);

      // Compute live business analytics
      const totalOrdersCount = loadedOrders.length;
      const totalProductsCount = loadedProducts.length;

      // Paid orders only contribute to revenue
      const paidOrders = loadedOrders.filter(o => o.isPaid);
      const totalRev = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      const totalSalesCount = paidOrders.reduce(
        (qtySum, o) => qtySum + o.orderItems.reduce((acc, item) => acc + item.qty, 0),
        0
      );

      const aov = paidOrders.length > 0 ? totalRev / paidOrders.length : 0;

      setAnalytics({
        totalRevenue: totalRev,
        totalSales: totalSalesCount,
        totalOrders: totalOrdersCount,
        totalProducts: totalProductsCount,
        averageOrderValue: aov
      });

    } catch (err) {
      setError(err.message || 'Failed to sync administrator analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  // Handle direct file upload via multer
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setFormError('');

    try {
      const res = await api.upload('/upload', formData);
      setNewProductImage(res.image);
    } catch (err) {
      setFormError(err.message || 'Image upload failed. Ensure server is online.');
    } finally {
      setUploading(false);
    }
  };

  // Submit product creation
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!newProductName || !newProductBrand || !newProductPrice || !newProductDescription || !newProductImage) {
      setFormError('Please fill in all fields and upload a product image.');
      return;
    }

    try {
      const productData = {
        name: newProductName,
        brand: newProductBrand,
        category: newProductCategory,
        price: Number(newProductPrice),
        countInStock: Number(newProductStock),
        description: newProductDescription,
        image: newProductImage
      };

      await api.post('/products', productData);
      
      // Success triggers
      setFormSuccess(true);
      
      // Reset inputs
      setNewProductName('');
      setNewProductBrand('');
      setNewProductCategory('Floral');
      setNewProductPrice('');
      setNewProductStock('10');
      setNewProductDescription('');
      setNewProductImage('');

      // Refresh product lists
      syncData();

      // Clear success notification after delay
      setTimeout(() => setFormSuccess(false), 4000);

    } catch (err) {
      setFormError(err.message || 'Failed to publish new perfume catalog entry.');
    }
  };

  // Delete an existing product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to remove this perfume from Orvélia catalogs?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      syncData();
    } catch (err) {
      alert(err.message || 'Failed to remove product from server database.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] flex flex-col md:flex-row pt-20 font-sans antialiased text-[#362720]">
      
      {/* Sleek Dark Admin Navigation Sidebar */}
      <div className="w-full md:w-64 bg-[#1a1512] text-[#f7f5f2] border-r border-[#d4af37]/15 flex-shrink-0 flex flex-col justify-between p-6">
        <div>
          <div className="border-b border-[#d4af37]/10 pb-4 mb-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37] font-bold block mb-1">
              Store Control Center
            </span>
            <h2 className="text-xl font-bold tracking-tighter text-white">ORVÉLIA ARCHIVE</h2>
          </div>

          <nav className="space-y-2">
            {/* Dashboard Tab */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full py-3 px-4 rounded-sm flex items-center gap-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'hover:bg-white/5 text-stone-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Live Analytics
            </button>

            {/* Add Product Tab */}
            <button
              onClick={() => setActiveTab('add-product')}
              className={`w-full py-3 px-4 rounded-sm flex items-center gap-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'add-product'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'hover:bg-white/5 text-stone-300 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Add Product
            </button>

            {/* Manage Products Tab */}
            <button
              onClick={() => setActiveTab('manage-products')}
              className={`w-full py-3 px-4 rounded-sm flex items-center gap-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'manage-products'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'hover:bg-white/5 text-stone-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Store Catalog
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-stone-500">
          <span>Server Port: 5000</span>
          <button 
            onClick={syncData}
            className="p-1.5 hover:bg-white/5 text-stone-400 rounded-full transition-all"
            title="Reload data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8 md:p-12 overflow-y-auto">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-2 border-red-500 text-red-800 text-xs font-medium rounded-sm">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* TAB 1: LIVE BUSINESS ANALYTICS */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl font-light text-[#261c16] tracking-tight">Business Analytics</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Calculated in real-time from active store catalogs and transactions.</p>
              </div>

              {/* Stats Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Revenue Card */}
                <div className="bg-white border border-stone-200/80 p-6 rounded-sm shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Total Revenue</span>
                    <h3 className="text-2xl font-light font-mono text-[#78532f]">${analytics.totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="p-3 bg-[#78532f]/10 text-[#78532f] rounded-full">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                {/* Total Sales count */}
                <div className="bg-white border border-stone-200/80 p-6 rounded-sm shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Items Sold</span>
                    <h3 className="text-2xl font-light font-mono text-[#78532f]">{analytics.totalSales} units</h3>
                  </div>
                  <div className="p-3 bg-[#78532f]/10 text-[#78532f] rounded-full">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                {/* Total Orders count */}
                <div className="bg-white border border-stone-200/80 p-6 rounded-sm shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Total Checkouts</span>
                    <h3 className="text-2xl font-light font-mono text-[#78532f]">{analytics.totalOrders} orders</h3>
                  </div>
                  <div className="p-3 bg-[#78532f]/10 text-[#78532f] rounded-full">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                </div>

                {/* Average Order Value Card */}
                <div className="bg-white border border-stone-200/80 p-6 rounded-sm shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Avg Order Value</span>
                    <h3 className="text-2xl font-light font-mono text-[#78532f]">${analytics.averageOrderValue.toFixed(2)}</h3>
                  </div>
                  <div className="p-3 bg-[#78532f]/10 text-[#78532f] rounded-full">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Recent Orders Listing Table */}
              <div className="bg-white border border-stone-200 rounded-sm shadow-xs p-6">
                <h3 className="text-xs uppercase tracking-widest text-stone-700 font-bold mb-4 border-b border-stone-100 pb-2">
                  Recent E-Commerce Checkouts
                </h3>
                
                {loading ? (
                  <div className="text-center py-10 text-xs text-stone-400">Loading transactional data...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 text-xs text-stone-400">No checkout transactions recorded yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-100 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                          <th className="py-3 px-2">Order ID</th>
                          <th className="py-3 px-2">Buyer</th>
                          <th className="py-3 px-2">Checkout Date</th>
                          <th className="py-3 px-2">Payment Status</th>
                          <th className="py-3 px-2 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-600">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id} className="hover:bg-stone-50/50">
                            <td className="py-3.5 px-2 font-mono text-[10px] text-stone-500">{order._id}</td>
                            <td className="py-3.5 px-2 font-medium">{order.user?.name || 'Customer'}</td>
                            <td className="py-3.5 px-2 text-stone-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-2">
                              {order.isPaid ? (
                                <span className="bg-green-50 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                                  Paid
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                                  Unpaid / COD
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-2 text-right font-semibold font-mono text-[#78532f]">
                              ${order.totalPrice.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: ADD PRODUCT CATALOG FORM */}
          {activeTab === 'add-product' && (
            <motion.div
              key="add-product"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="max-w-2xl bg-white border border-stone-200 rounded-sm p-8 shadow-sm space-y-6"
            >
              <div>
                <h1 className="text-2xl font-light text-[#261c16] tracking-tight">Add New Perfume</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Publish a newly engineered formula to the public Orvélia catalog.</p>
              </div>

              {/* Form Status Notifications */}
              {formError && (
                <div className="p-4 bg-red-50 border-l-2 border-red-500 text-red-800 text-xs font-medium rounded-sm">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-4 bg-green-50 border-l-2 border-green-500 text-green-800 text-xs font-medium rounded-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Perfume published successfully to active catalogs!</span>
                </div>
              )}

              <form onSubmit={handleAddProduct} className="space-y-5 text-xs text-stone-700 font-medium">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Perfume Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Oud Intense"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white"
                    />
                  </div>

                  {/* Brand field */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Designer Brand</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Orvélia"
                      value={newProductBrand}
                      onChange={(e) => setNewProductBrand(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-3 gap-4">
                  
                  {/* Category selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Olfactory Note Category</label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price field */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Unit Price ($)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 195"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white font-mono"
                    />
                  </div>

                  {/* Stock Count field */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">In-Stock units</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="10"
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white font-mono"
                    />
                  </div>

                </div>

                {/* Description field */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Olfactory Description</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe notes, ingredients, and endurance characteristics..."
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white font-light"
                  />
                </div>

                {/* Image File upload and Input */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Product Media (Image)</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Multer file upload */}
                    <div className="border border-dashed border-stone-200 hover:border-[#d4af37] transition-colors rounded-sm p-4 bg-stone-50 flex flex-col items-center justify-center text-center cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <Upload className="w-5 h-5 text-stone-400 mb-1.5" />
                      <span className="text-[10px] text-stone-600 block">
                        {uploading ? 'Uploading image to local folder...' : 'Select Local Image File'}
                      </span>
                      <span className="text-[8px] text-stone-400 mt-0.5">JPEG, PNG, WEBP (Max 5MB)</span>
                    </div>

                    {/* Image URL preview / input */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Image URI path appears here..."
                        value={newProductImage}
                        onChange={(e) => setNewProductImage(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-500 font-mono focus:outline-none"
                        readOnly
                      />
                      
                      {newProductImage && (
                        <div className="h-16 w-16 rounded-xs overflow-hidden border border-stone-200 bg-stone-100">
                          {newProductImage.startsWith('http') ? (
                            <img src={newProductImage} className="w-full h-full object-cover" />
                          ) : (
                            <img src={`http://localhost:5000${newProductImage}`} className="w-full h-full object-cover" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form submit button */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3.5 bg-[#26201c] hover:bg-black text-[#d4af37] text-xs font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 rounded-sm shadow-md transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  PUBLISH PERFUME BLEND
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 3: STORE CATALOG CONTROL LIST */}
          {activeTab === 'manage-products' && (
            <motion.div
              key="manage-products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6"
            >
              <div>
                <h1 className="text-2xl font-light text-[#261c16] tracking-tight">Active Perfume Store</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Manage database catalogue elements, monitor inventory levels, and delete items.</p>
              </div>

              {loading ? (
                <div className="text-center py-10 text-xs text-stone-400">Loading catalog...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-10 text-xs text-stone-400">No products published in the database yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                        <th className="py-3 px-2">Image</th>
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Brand</th>
                        <th className="py-3 px-2">Category</th>
                        <th className="py-3 px-2">Stock Level</th>
                        <th className="py-3 px-2 text-right">Price</th>
                        <th className="py-3 px-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-stone-50/50">
                          {/* Image cell */}
                          <td className="py-3 px-2">
                            <div className="w-8 h-10 bg-stone-100 rounded-xs overflow-hidden border border-stone-200/50">
                              {product.image.startsWith('http') ? (
                                <img src={product.image} className="w-full h-full object-cover" />
                              ) : (
                                <img src={`http://localhost:5000${product.image}`} className="w-full h-full object-cover" />
                              )}
                            </div>
                          </td>
                          {/* Name cell */}
                          <td className="py-3 px-2 text-stone-800">{product.name}</td>
                          {/* Brand cell */}
                          <td className="py-3 px-2 text-stone-400">{product.brand}</td>
                          {/* Category cell */}
                          <td className="py-3 px-2">
                            <span className="text-[10px] text-[#b38f44] tracking-wider uppercase font-semibold">
                              {product.category}
                            </span>
                          </td>
                          {/* Stock Level cell */}
                          <td className="py-3 px-2">
                            {product.countInStock > 0 ? (
                              <span className="font-mono">{product.countInStock} units</span>
                            ) : (
                              <span className="bg-red-50 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                                Sold Out
                              </span>
                            )}
                          </td>
                          {/* Price cell */}
                          <td className="py-3 px-2 text-right font-semibold font-mono text-[#78532f]">
                            ${product.price.toFixed(2)}
                          </td>
                          {/* Delete Action cell */}
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-2 text-stone-400 hover:text-red-500 hover:bg-stone-100 rounded-full transition-all"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};

export default AdminDashboard;
