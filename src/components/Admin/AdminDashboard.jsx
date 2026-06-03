import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, PlusCircle, Layers, DollarSign, 
  ShoppingBag, ClipboardList, TrendingUp, Trash2, 
  Upload, CheckCircle, RefreshCw, Star,
  Search, Filter, Clock, Truck, CreditCard, MapPin, User, Package, MessageSquare, Settings
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

  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Orders Management Search, Filtering, and Actions States
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [orderDeliveryFilter, setOrderDeliveryFilter] = useState('all');
  const [orderSortBy, setOrderSortBy] = useState('newest');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState('');

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

  // Store Settings States (Loaded from and saved to localStorage for dynamic checkout flow configuration)
  const [isCodAvailable, setIsCodAvailable] = useState(() => {
    const saved = localStorage.getItem('checkoutSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.isCodAvailable !== undefined ? parsed.isCodAvailable : false;
      } catch (e) {}
    }
    return false;
  });

  const [minCodAmountINR, setMinCodAmountINR] = useState(() => {
    const saved = localStorage.getItem('checkoutSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.minCodAmountINR || 500;
      } catch (e) {}
    }
    return 500;
  });

  const [freeDeliveryThresholdINR, setFreeDeliveryThresholdINR] = useState(() => {
    const saved = localStorage.getItem('checkoutSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.freeDeliveryThresholdINR || 10000;
      } catch (e) {}
    }
    return 10000;
  });

  const [defaultCheckoutStep, setDefaultCheckoutStep] = useState(() => {
    const saved = localStorage.getItem('checkoutSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.defaultCheckoutStep || 2;
      } catch (e) {}
    }
    return 2;
  });

  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Security / Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

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

      // Fetch all customer queries (requires admin permission)
      try {
        const queryRes = await api.get('/contact');
        setQueries(queryRes || []);
      } catch (qErr) {
        console.error('Failed to load customer queries:', qErr);
      }

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

  const handleDeleteQuery = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to remove this query from Orvélia archives?')) {
      return;
    }

    try {
      await api.delete(`/contact/${id}`);
      const queryRes = await api.get('/contact');
      setQueries(queryRes || []);
    } catch (err) {
      alert(err.message || 'Failed to remove message.');
    }
  };

  // Mark order as paid
  const handleMarkAsPaid = async (id) => {
    if (!window.confirm('Mark this order as paid? This will confirm receipt of payment.')) {
      return;
    }

    setStatusUpdatingId(id);
    try {
      await api.put(`/orders/${id}/pay`, {});
      await syncData();
    } catch (err) {
      alert(err.message || 'Failed to update payment status.');
    } finally {
      setStatusUpdatingId('');
    }
  };

  // Mark order as delivered
  const handleMarkAsDelivered = async (id) => {
    if (!window.confirm('Mark this order as delivered? This will confirm dispatch completion.')) {
      return;
    }

    setStatusUpdatingId(id);
    try {
      await api.put(`/orders/${id}/deliver`, {});
      await syncData();
    } catch (err) {
      alert(err.message || 'Failed to update delivery status.');
    } finally {
      setStatusUpdatingId('');
    }
  };

  // Save checkout configuration parameters
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSuccess(false);

    const updatedSettings = {
      isCodAvailable,
      minCodAmountINR: Number(minCodAmountINR),
      freeDeliveryThresholdINR: Number(freeDeliveryThresholdINR),
      defaultCheckoutStep: Number(defaultCheckoutStep),
    };

    localStorage.setItem('checkoutSettings', JSON.stringify(updatedSettings));
    setSettingsSuccess(true);

    // Also trigger custom event to notify other components reactively
    window.dispatchEvent(new Event('checkoutSettingsUpdated'));

    setTimeout(() => setSettingsSuccess(false), 4000);
  };

  // Rotate/Change password handler securely calling backend PUT /api/auth/profile
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!newPassword || !confirmNewPassword) {
      setPasswordError('Please fill in all security fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      // Calls user profile PUT update password
      await api.put('/auth/profile', { password: newPassword });
      
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to rotate administrator credentials.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Reactive order filtering and search logic
  const filteredOrders = orders.filter((order) => {
    // 1. Search Match: matches order ID, buyer name, or perfume name
    const matchesSearch = 
      order._id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (order.user?.name || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.orderItems.some(item => item.name.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    // 2. Payment Status Filter Match
    const matchesPayment = 
      orderPaymentFilter === 'all' ||
      (orderPaymentFilter === 'paid' && order.isPaid) ||
      (orderPaymentFilter === 'unpaid' && !order.isPaid);

    // 3. Delivery Status Filter Match
    const matchesDelivery = 
      orderDeliveryFilter === 'all' ||
      (orderDeliveryFilter === 'delivered' && order.isDelivered) ||
      (orderDeliveryFilter === 'transit' && !order.isDelivered);

    return matchesSearch && matchesPayment && matchesDelivery;
  }).sort((a, b) => {
    if (orderSortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (orderSortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (orderSortBy === 'price-high') {
      return b.totalPrice - a.totalPrice;
    } else if (orderSortBy === 'price-low') {
      return a.totalPrice - b.totalPrice;
    }
    return 0;
  });

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

            {/* Manage Orders Tab */}
            <button
              onClick={() => setActiveTab('manage-orders')}
              className={`w-full py-3 px-4 rounded-sm flex items-center gap-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'manage-orders'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'hover:bg-white/5 text-stone-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Manage Orders
            </button>

            {/* Customer Queries Tab */}
            <button
              onClick={() => setActiveTab('customer-queries')}
              className={`w-full py-3 px-4 rounded-sm flex items-center gap-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'customer-queries'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'hover:bg-white/5 text-stone-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Customer Queries
            </button>

            {/* Store Settings Tab */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full py-3 px-4 rounded-sm flex items-center gap-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'hover:bg-white/5 text-stone-300 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Store Settings
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

          {/* TAB 4: MANAGE ORDERS TAB */}
          {activeTab === 'manage-orders' && (
            <motion.div
              key="manage-orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-light text-[#261c16] tracking-tight">Manage System Orders</h1>
                  <p className="text-xs text-stone-500 font-light mt-1">Review guest/customer checkouts, monitor logistics, and transition delivery status.</p>
                </div>
                <div className="text-stone-400 text-xs">
                  Showing <span className="font-semibold text-stone-700">{filteredOrders.length}</span> of {orders.length} orders
                </div>
              </div>

              {/* SEARCH & FILTERS CONTROLS */}
              <div className="bg-white border border-stone-200/80 rounded-sm p-4 shadow-xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search Bar */}
                  <div className="md:col-span-2 relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Buyer Name, or Perfume Name..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-9 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#d4af37] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Payment Filter */}
                  <div className="relative">
                    <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={orderPaymentFilter}
                      onChange={(e) => setOrderPaymentFilter(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 pl-9 pr-3 text-xs text-stone-700 focus:outline-none focus:border-[#d4af37] focus:bg-white cursor-pointer appearance-none transition-colors"
                    >
                      <option value="all">Payment: All</option>
                      <option value="paid">Payment: Paid</option>
                      <option value="unpaid">Payment: Unpaid / COD</option>
                    </select>
                  </div>

                  {/* Delivery Filter */}
                  <div className="relative">
                    <Truck className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={orderDeliveryFilter}
                      onChange={(e) => setOrderDeliveryFilter(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 pl-9 pr-3 text-xs text-stone-700 focus:outline-none focus:border-[#d4af37] focus:bg-white cursor-pointer appearance-none transition-colors"
                    >
                      <option value="all">Delivery: All</option>
                      <option value="delivered">Delivery: Delivered</option>
                      <option value="transit">Delivery: In Transit</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between border-t border-stone-100 pt-3 text-[10px] text-stone-400 font-medium">
                  {/* Sorting dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="uppercase tracking-widest text-[9px] font-bold">Sort By:</span>
                    <select
                      value={orderSortBy}
                      onChange={(e) => setOrderSortBy(e.target.value)}
                      className="bg-transparent border-none py-0.5 text-[10px] text-stone-600 focus:outline-none cursor-pointer font-bold"
                    >
                      <option value="newest">Newest Checkout</option>
                      <option value="oldest">Oldest Checkout</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="price-low">Price: Low to High</option>
                    </select>
                  </div>

                  {/* Clear filters button */}
                  {(orderSearchQuery || orderPaymentFilter !== 'all' || orderDeliveryFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setOrderSearchQuery('');
                        setOrderPaymentFilter('all');
                        setOrderDeliveryFilter('all');
                      }}
                      className="text-[#b38f44] hover:text-[#78532f] uppercase tracking-wider font-bold transition-colors"
                    >
                      Clear Active Filters
                    </button>
                  )}
                </div>
              </div>

              {/* ORDERS LISTING CONTAINER */}
              {loading ? (
                <div className="text-center py-20 text-xs text-stone-400">Syncing live archive orders...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-sm text-center py-20 px-6">
                  <ShoppingBag size={48} strokeWidth={1} className="mb-3 text-[#d4af37] mx-auto opacity-60" />
                  <p className="text-xs tracking-wider uppercase font-semibold text-stone-600">No Orders Found</p>
                  <p className="text-[10px] text-stone-400 font-light mt-1 max-w-sm mx-auto">
                    No orders matched your active search query or filter combination. Adjust your parameters to find catalog entries.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrderId === order._id;
                    
                    // Inferred delivery status details
                    let trackingStage = 1; // 1: Placed, 2: Paid/Processing, 3: Dispatched, 4: Delivered
                    if (order.isPaid) trackingStage = 2;
                    if (order.isPaid && !order.isDelivered) trackingStage = 3; // Paid, not delivered -> Shipped / Transit
                    if (order.isDelivered) trackingStage = 4;

                    return (
                      <div
                        key={order._id}
                        className="bg-white border border-stone-200 hover:border-stone-300 rounded-sm overflow-hidden transition-all shadow-xs"
                      >
                        {/* Summary Header Row */}
                        <div
                          onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                          className="p-5 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/20 transition-colors select-none text-xs"
                        >
                          {/* Order Identifier */}
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                              ORDER ID
                            </span>
                            <span className="font-mono font-bold text-stone-800 text-[11px] truncate block">
                              {order._id}
                            </span>
                          </div>

                          {/* Customer info */}
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                              BUYER
                            </span>
                            <span className="font-semibold text-stone-700 block">
                              {order.user?.name || 'Guest / Account Removed'}
                            </span>
                          </div>

                          {/* Purchase Date */}
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                              CHECKOUT DATE
                            </span>
                            <span className="text-stone-600 block">
                              {new Date(order.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          {/* Grand Total */}
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                              TOTAL VALUE
                            </span>
                            <span className="font-semibold font-mono text-[#78532f] text-sm block">
                              ${order.totalPrice.toFixed(2)}
                            </span>
                          </div>

                          {/* Tracking Stages Indicator Badge */}
                          <div className="flex gap-2">
                            {order.isPaid ? (
                              <span className="bg-green-50 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider border border-green-200/50">
                                PAID
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider border border-amber-200/50">
                                COD / UNPAID
                              </span>
                            )}

                            {order.isDelivered ? (
                              <span className="bg-green-50 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider border border-green-200/50">
                                DELIVERED
                              </span>
                            ) : (
                              <span className="bg-blue-50 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider border border-blue-200/50">
                                IN TRANSIT
                              </span>
                            )}
                          </div>

                          {/* Toggle label */}
                          <div className="text-[#b38f44] font-semibold text-[10px] tracking-wider uppercase">
                            {isExpanded ? 'Collapse ▲' : 'View Details ▼'}
                          </div>
                        </div>

                        {/* Interactive Tracking Timeline & Details Breakdown */}
                        {isExpanded && (
                          <div className="border-t border-stone-100 bg-[#fdfcf9]/40 p-5 space-y-6">
                            
                            {/* PREMIUM TRACKING TIMELINE */}
                            <div className="p-4 bg-white border border-stone-200/60 rounded-sm">
                              <h4 className="text-[10px] uppercase tracking-widest text-[#b38f44] font-bold mb-6 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Order Shipment & Delivery Tracking Timeline
                              </h4>
                              
                              <div className="relative">
                                {/* Connecting line */}
                                <div className="absolute top-1/2 left-0 w-full h-[3px] bg-stone-100 -translate-y-1/2" />
                                <div 
                                  className="absolute top-1/2 left-0 h-[3px] bg-[#d4af37] -translate-y-1/2 transition-all duration-700 ease-out" 
                                  style={{ 
                                    width: `${
                                      trackingStage === 1 ? '0%' : 
                                      trackingStage === 2 ? '33.33%' : 
                                      trackingStage === 3 ? '66.66%' : '100%'
                                    }` 
                                  }}
                                />

                                {/* Stages nodes */}
                                <div className="relative flex justify-between items-center text-center">
                                  
                                  {/* Node 1: Checkout Placed */}
                                  <div className="flex flex-col items-center bg-[#fdfcf9] px-2 z-10">
                                    <div className="w-7 h-7 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold text-xs shadow-md border border-[#d4af37]">
                                      ✓
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-700 mt-2">Placed</span>
                                    <span className="text-[7.5px] font-mono text-stone-400 mt-0.5">
                                      {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  {/* Node 2: Payment Verified */}
                                  <div className="flex flex-col items-center bg-[#fdfcf9] px-2 z-10">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                                      trackingStage >= 2 
                                        ? 'bg-[#d4af37] text-black shadow-md border-[#d4af37]' 
                                        : 'bg-white text-stone-300 border-stone-200'
                                    }`}>
                                      {trackingStage >= 2 ? '✓' : '2'}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider mt-2 ${
                                      trackingStage >= 2 ? 'text-stone-700' : 'text-stone-400'
                                    }`}>Paid</span>
                                    {order.isPaid ? (
                                      <span className="text-[7.5px] font-mono text-stone-400 mt-0.5">
                                        {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'Verified'}
                                      </span>
                                    ) : (
                                      <span className="text-[7.5px] text-amber-600 mt-0.5">Awaiting Pay</span>
                                    )}
                                  </div>

                                  {/* Node 3: Dispatched */}
                                  <div className="flex flex-col items-center bg-[#fdfcf9] px-2 z-10">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                                      trackingStage >= 3 
                                        ? 'bg-[#d4af37] text-black shadow-md border-[#d4af37]' 
                                        : 'bg-white text-stone-300 border-stone-200'
                                    }`}>
                                      {trackingStage >= 3 ? '✓' : '3'}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider mt-2 ${
                                      trackingStage >= 3 ? 'text-stone-700' : 'text-stone-400'
                                    }`}>Dispatched</span>
                                    <span className="text-[7.5px] font-mono text-stone-400 mt-0.5">
                                      {order.isPaid ? 'In Transit' : 'Pending Pay'}
                                    </span>
                                  </div>

                                  {/* Node 4: Delivered */}
                                  <div className="flex flex-col items-center bg-[#fdfcf9] px-2 z-10">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                                      trackingStage === 4 
                                        ? 'bg-green-600 text-white shadow-md border-green-600' 
                                        : 'bg-white text-stone-300 border-stone-200'
                                    }`}>
                                      {trackingStage === 4 ? '✓' : '4'}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider mt-2 ${
                                      trackingStage === 4 ? 'text-green-700' : 'text-stone-400'
                                    }`}>Delivered</span>
                                    {order.isDelivered ? (
                                      <span className="text-[7.5px] font-mono text-stone-400 mt-0.5">
                                        {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'Completed'}
                                      </span>
                                    ) : (
                                      <span className="text-[7.5px] text-stone-400 mt-0.5">Pending delivery</span>
                                    )}
                                  </div>

                                </div>
                              </div>
                            </div>

                            {/* CORE DETAILS COLLATERAL (ITEMS, SHIPPING, CONTROL BUTTONS) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              
                              {/* Shipping address & payment metadata */}
                              <div className="lg:col-span-1 bg-white border border-stone-200/55 p-4 rounded-sm space-y-4">
                                <div>
                                  <h5 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold mb-2 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" /> Shipping Address
                                  </h5>
                                  <div className="text-stone-600 text-xs font-light space-y-1">
                                    <p className="font-semibold text-stone-800">{order.user?.name || 'Customer Address'}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                    <p className="font-medium">{order.shippingAddress.country}</p>
                                  </div>
                                </div>

                                <div className="border-t border-stone-100 pt-3">
                                  <h5 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold mb-2 flex items-center gap-1">
                                    <CreditCard className="w-3.5 h-3.5" /> Payment Method
                                  </h5>
                                  <p className="text-stone-700 text-xs font-medium uppercase tracking-wide">
                                    {order.paymentMethod === 'cod' ? 'Cash On Delivery (COD)' : order.paymentMethod}
                                  </p>
                                </div>
                              </div>

                              {/* Purchased Items List */}
                              <div className="lg:col-span-2 bg-white border border-stone-200/55 p-4 rounded-sm space-y-3">
                                <h5 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold mb-2 flex items-center gap-1">
                                  <Package className="w-3.5 h-3.5" /> Checked Out Perfumes
                                </h5>

                                <div className="divide-y divide-stone-100">
                                  {order.orderItems.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 text-xs">
                                      <div className="w-10 h-12 bg-stone-50 rounded-xs overflow-hidden shrink-0 border border-stone-200/30">
                                        <img 
                                          src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} 
                                          className="w-full h-full object-cover" 
                                        />
                                      </div>
                                      
                                      <div className="flex-grow min-w-0">
                                        <h6 className="font-semibold text-stone-800 truncate">{item.name}</h6>
                                        <p className="text-[9px] text-[#b38f44] font-bold tracking-wider uppercase">
                                          Qty: {item.qty} × ${item.price.toFixed(2)}
                                        </p>
                                      </div>

                                      <div className="font-mono font-bold text-stone-700 text-right">
                                        ${(item.qty * item.price).toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Transaction Financials Footer */}
                                <div className="border-t border-stone-100 pt-3 text-[10px] space-y-1 font-mono text-stone-500">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${order.itemsPrice ? order.itemsPrice.toFixed(2) : (order.totalPrice - (order.taxPrice || 0) - (order.shippingPrice || 0)).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Courier Shipping:</span>
                                    <span>${order.shippingPrice ? order.shippingPrice.toFixed(2) : '0.00'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>VAT / Tax:</span>
                                    <span>${order.taxPrice ? order.taxPrice.toFixed(2) : '0.00'}</span>
                                  </div>
                                  <div className="flex justify-between border-t border-dashed border-stone-100 pt-1.5 text-xs font-semibold text-stone-800 font-sans">
                                    <span className="uppercase tracking-widest text-[9px] text-stone-400 font-bold">Grand Total Value:</span>
                                    <span className="text-[#78532f] font-mono font-bold">${order.totalPrice.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                            </div>

                            {/* ADMINISTRATIVE UPDATE TRIGGERS */}
                            <div className="bg-[#1a1512] text-[#f7f5f2] rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="text-center sm:text-left">
                                <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-bold block mb-0.5">
                                  Administrative Logistics Override
                                </span>
                                <p className="text-[10px] text-stone-400 font-light">
                                  Alter verified status markers. These changes will reflect immediately in both database entries and buyer dashboard history.
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                {/* Mark as Paid Button */}
                                {!order.isPaid ? (
                                  <button
                                    onClick={() => handleMarkAsPaid(order._id)}
                                    disabled={statusUpdatingId === order._id}
                                    className="py-2 px-4 bg-[#d4af37] hover:bg-[#c29d2b] text-black font-bold uppercase tracking-wider rounded-xs text-[10px] shadow-sm disabled:opacity-40 transition-all duration-300"
                                  >
                                    {statusUpdatingId === order._id ? 'Verifying...' : 'Mark as Paid'}
                                  </button>
                                ) : (
                                  <div className="py-2 px-4 bg-white/5 text-stone-400 border border-white/10 rounded-xs text-[10px] tracking-wider uppercase font-semibold">
                                    ✓ Payment Secured
                                  </div>
                                )}

                                {/* Mark as Delivered Button */}
                                {!order.isDelivered ? (
                                  <button
                                    onClick={() => handleMarkAsDelivered(order._id)}
                                    disabled={statusUpdatingId === order._id || !order.isPaid}
                                    className={`py-2 px-4 font-bold uppercase tracking-wider rounded-xs text-[10px] shadow-sm disabled:opacity-40 transition-all duration-300 ${
                                      order.isPaid
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                                    }`}
                                    title={!order.isPaid ? 'Orders must be paid before marking as delivered' : 'Complete Delivery'}
                                  >
                                    {statusUpdatingId === order._id ? 'Completing...' : 'Mark as Delivered'}
                                  </button>
                                ) : (
                                  <div className="py-2 px-4 bg-green-950/40 text-green-400 border border-green-900/50 rounded-xs text-[10px] tracking-wider uppercase font-semibold">
                                    ✓ Fully Delivered
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: CUSTOMER QUERIES */}
          {activeTab === 'customer-queries' && (
            <motion.div
              key="customer-queries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-light text-[#261c16] tracking-tight">Customer Queries</h1>
                  <p className="text-xs text-stone-500 font-light mt-1">Review contact form submissions, guest emails, and direct queries.</p>
                </div>
                <div className="text-stone-400 text-xs">
                  Total Queries: <span className="font-semibold text-stone-700">{queries.length}</span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-xs text-stone-400">Loading queries...</div>
              ) : queries.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-sm text-center py-20 px-6">
                  <MessageSquare size={48} strokeWidth={1} className="mb-3 text-[#d4af37] mx-auto opacity-60" />
                  <p className="text-xs tracking-wider uppercase font-semibold text-stone-600">No Queries Discovered</p>
                  <p className="text-[10px] text-stone-400 font-light mt-1 max-w-sm mx-auto">
                    No customer transmissions have been submitted yet. When a user submits the "Contact Us" form, their queries will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {queries.map((query) => (
                    <div 
                      key={query._id} 
                      className="bg-white border border-stone-200 hover:border-stone-300 rounded-sm p-6 space-y-4 transition-all shadow-xs"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-stone-800 text-sm">{query.name}</h3>
                          <a href={`mailto:${query.email}`} className="text-xs text-[#b38f44] hover:underline font-medium block">
                            {query.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <span className="text-[10px] font-mono text-stone-400">
                            {new Date(query.createdAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleDeleteQuery(query._id)}
                            className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded-full transition-all"
                            title="Delete query"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-stone-50/50 border-l-2 border-[#d4af37] text-stone-700 text-xs font-light leading-relaxed whitespace-pre-wrap">
                        {query.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 6: STORE CONFIGURATION & SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-2xl font-light text-[#261c16] tracking-tight">Store Configurations</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Configure checkout logic, payment limits, merchant accounts, and administrator credentials.</p>
              </div>

              {/* Grid of Settings Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* 1. CHECKOUT & PAYMENT FLOW CONTROLS */}
                <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="text-xs uppercase tracking-widest text-stone-700 font-bold">Checkout & Payment Flow</h3>
                  </div>

                  {settingsSuccess && (
                    <div className="p-3 bg-green-50 border-l-2 border-green-500 text-green-800 text-[11px] font-medium rounded-sm flex items-center gap-1.5 animate-pulse">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Checkout configurations updated successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs text-stone-600 font-medium">
                    
                    {/* COD Availability Toggle Switch */}
                    <div className="flex items-center justify-between p-3 bg-stone-50/50 rounded-sm border border-stone-100">
                      <div>
                        <label className="text-stone-800 font-bold block">Cash on Delivery (COD)</label>
                        <span className="text-[10px] text-stone-400 font-light">Determine if buyers can select COD during checkout.</span>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isCodAvailable}
                          onChange={(e) => setIsCodAvailable(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d4af37]"></div>
                      </label>
                    </div>

                    {/* Minimum order for COD */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
                        Minimum COD Threshold Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="500"
                        value={minCodAmountINR}
                        disabled={!isCodAvailable}
                        onChange={(e) => setMinCodAmountINR(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white disabled:opacity-40 disabled:cursor-not-allowed font-mono"
                      />
                    </div>

                    {/* Free Delivery Threshold Amount */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
                        Free Delivery Threshold Value (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="10000"
                        value={freeDeliveryThresholdINR}
                        onChange={(e) => setFreeDeliveryThresholdINR(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white font-mono"
                      />
                    </div>

                    {/* Default checkout landing step selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
                        Default Landing Step at /checkout
                      </label>
                      <select
                        value={defaultCheckoutStep}
                        onChange={(e) => setDefaultCheckoutStep(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white cursor-pointer"
                      >
                        <option value={1}>Step 1: Cart Items Summary</option>
                        <option value={2}>Step 2: Shipping Delivery Form</option>
                        <option value={3}>Step 3: Select Payment Gateway</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 mt-2 bg-[#26201c] hover:bg-black text-[#d4af37] text-xs font-bold tracking-widest uppercase rounded-sm shadow-md transition-colors"
                    >
                      Save Configurations
                    </button>
                  </form>
                </div>

                {/* 2. DIRECT SETTLEMENT BANK ACCOUNT (UNAVAILABLE / COMPLIANCE LOCK) */}
                <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6 relative overflow-hidden">
                  
                  {/* Visual Grey/Compliance Lock Overlay */}
                  <div className="absolute inset-0 bg-[#f7f5f2]/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-[#d4af37] shadow-md border border-stone-200 mb-4 animate-bounce">
                      🔒
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-1">
                      Settlement Account Locked
                    </h4>
                    <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider scale-95 mb-3 inline-block">
                      Compliance Hold
                    </span>
                    <p className="text-[10.5px] text-stone-500 font-light max-w-xs leading-relaxed">
                      Direct merchant bank settlements routing is locked for verification audit. Please contact integration merchant support to amend settlement coordinates.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <CreditCard className="w-5 h-5 text-stone-400" />
                    <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold">Settlement Account</h3>
                  </div>

                  <div className="space-y-4 text-xs text-stone-300 font-medium">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Settlement Bank Name</label>
                      <input
                        type="text"
                        disabled
                        value="State Bank of India"
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-400 font-light"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Account Holder Name</label>
                      <input
                        type="text"
                        disabled
                        value="Al Özhan Perfumes Ltd."
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-400 font-light"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Account Number</label>
                        <input
                          type="text"
                          disabled
                          value="•••• •••• •••• 9876"
                          className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-400 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">IFSC Code</label>
                        <input
                          type="text"
                          disabled
                          value="SBIN0001234"
                          className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-stone-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. ADMINISTRATOR SECURITY (CHANGE PASSWORD) */}
                <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6 lg:col-span-2">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <User className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="text-xs uppercase tracking-widest text-stone-700 font-bold">Change Administrator Password</h3>
                  </div>

                  {passwordError && (
                    <div className="p-3 bg-red-50 border-l-2 border-red-500 text-red-800 text-[11px] font-medium rounded-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-3 bg-green-50 border-l-2 border-green-500 text-green-800 text-[11px] font-medium rounded-sm flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-600 animate-bounce" />
                      <span>Administrator password updated successfully! Please keep this key secure.</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600 font-medium items-end">
                    
                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
                        New Security Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white"
                      />
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2.5 px-3 text-stone-800 focus:outline-none focus:border-[#d4af37] focus:bg-white"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full py-3 bg-[#26201c] hover:bg-black text-[#d4af37] text-xs font-bold tracking-widest uppercase rounded-sm shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      {passwordLoading ? 'Rotating password...' : 'Rotate Credentials'}
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};

export default AdminDashboard;
