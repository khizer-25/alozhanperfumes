import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, PlusCircle, Layers, DollarSign, 
  ShoppingBag, ClipboardList, TrendingUp, Trash2, Edit, X,
  Upload, CheckCircle, RefreshCw, Star, Shield, AlertTriangle,
  Search, Filter, Clock, Truck, CreditCard, MapPin, User, Package, MessageSquare, Settings, Users, Ban, Lock, Award
} from 'lucide-react';
import { api } from '../../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Core lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Inventory States
  const [inventoryList, setInventoryList] = useState([]);
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState('');
  const [inventoryAction, setInventoryAction] = useState('Add');
  const [inventoryQuantity, setInventoryQuantity] = useState('5');
  const [inventorySuccess, setInventorySuccess] = useState(false);

  // 2. Customer States
  const [customers, setCustomers] = useState([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponTargetId, setCouponTargetId] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [passResetTargetId, setPassResetTargetId] = useState('');
  const [passResetValue, setPassResetValue] = useState('');
  const [passResetSuccess, setPassResetSuccess] = useState(false);

  // 3. Review States
  const [reviewsList, setReviewsList] = useState([]);
  const [selectedReviewForReply, setSelectedReviewForReply] = useState(null);
  const [reviewReplyText, setReviewReplyText] = useState('');
  const [reviewActionSuccess, setReviewActionSuccess] = useState(false);

  // 4. Returns & Refunds States
  const [returnsList, setReturnsList] = useState([]);
  const [returnActionSuccess, setReturnActionSuccess] = useState(false);
  const [returnRefundAmount, setReturnRefundAmount] = useState('');

  // 5. Payment States
  const [paymentMetrics, setPaymentMetrics] = useState({
    Razorpay: { successful: 0, failed: 0, refunds: 0 },
    Stripe: { successful: 0, failed: 0, refunds: 0 },
    PayPal: { successful: 0, failed: 0, refunds: 0 },
    COD: { successful: 0, failed: 0, refunds: 0 }
  });

  // 6. User & Staff RBAC States
  const [staffList, setStaffList] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('admin');

  // 7. Store & GST Settings States
  const [businessName, setBusinessName] = useState('Al Özhan Parfums');
  const [gstNumber, setGstNumber] = useState('27AAAAA0000A1Z5');
  const [businessAddress, setBusinessAddress] = useState('Atelier House, Colaba, Mumbai, India');
  const [gstPercent, setGstPercent] = useState('18');
  const [stateTax, setStateTax] = useState('9');
  const [invoiceLogo, setInvoiceLogo] = useState('');
  const [invoiceFooter, setInvoiceFooter] = useState('Al Özhan Parfums - Artisanal Fragrances. All Rights Reserved.');
  const [invoiceTerms, setInvoiceTerms] = useState('Products purchased are subject to return guidelines within 7 business days.');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // 8. Add Product Form States (Updated with perfume-specific inputs)
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('Al Özhan');
  const [newProductCategory, setNewProductCategory] = useState('Floral');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('10');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Perfume-specific additions
  const [topNotesText, setTopNotesText] = useState('Bergamot, Lemon, Orange Blossom');
  const [middleNotesText, setMiddleNotesText] = useState('Jasmine, Rose, Saffron');
  const [baseNotesText, setBaseNotesText] = useState('Oud, Cedarwood, Musk, Amber');
  const [perfumeFamily, setPerfumeFamily] = useState('Woody');
  const [perfumeGender, setPerfumeGender] = useState('Unisex');
  const [perfumeOccasions, setPerfumeOccasions] = useState(['Daily Wear']);

  const categories = ['Floral', 'Fresh', 'Woody', 'Gourmand', 'Musk', 'Aromatic', 'Oriental'];
  const families = ['Woody', 'Fresh', 'Citrus', 'Floral', 'Oriental', 'Aquatic', 'Spicy'];
  const genders = ['Men', 'Women', 'Unisex'];
  const occasionList = ['Office', 'Party', 'Wedding', 'Daily Wear'];

  // Edit Product States
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductBrand, setEditProductBrand] = useState('');
  const [editProductCategory, setEditProductCategory] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');
  const [editProductStock, setEditProductStock] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductImage, setEditProductImage] = useState('');
  const [editTopNotesText, setEditTopNotesText] = useState('');
  const [editMiddleNotesText, setEditMiddleNotesText] = useState('');
  const [editBaseNotesText, setEditBaseNotesText] = useState('');
  const [editPerfumeFamily, setEditPerfumeFamily] = useState('');
  const [editPerfumeGender, setEditPerfumeGender] = useState('');
  const [editPerfumeOccasions, setEditPerfumeOccasions] = useState([]);
  const [editUploading, setEditUploading] = useState(false);
  const [editFormError, setEditFormError] = useState('');

  // Global Analytics totals
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0
  });

  // Orders Management Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [orderDeliveryFilter, setOrderDeliveryFilter] = useState('all');
  const [orderSortBy, setOrderSortBy] = useState('newest');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState('');

  // Load user role
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { role } = JSON.parse(userInfo);
        if (role) setCurrentUserRole(role);
      } catch (e) {}
    }
  }, []);

  const syncData = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch store products
      const productRes = await api.get('/products?pageSize=100');
      const loadedProducts = productRes.products || [];
      setProducts(loadedProducts);

      // 2. Fetch system orders
      const loadedOrders = await api.get('/orders');
      setOrders(loadedOrders);

      // 3. Fetch customer queries
      try {
        const queryRes = await api.get('/contact');
        setQueries(queryRes || []);
      } catch (qErr) {
        console.error('Failed to load customer queries:', qErr);
      }

      // 4. Fetch Inventory list and history
      try {
        const inv = await api.get('/admin/inventory');
        setInventoryList(inv || []);
        
        const hist = await api.get('/admin/inventory/history');
        setInventoryHistory(hist || []);
      } catch (iErr) {
        console.warn('Inventory endpoints fallback:', iErr);
      }

      // 5. Fetch Customers list
      try {
        const custs = await api.get('/admin/customers');
        setCustomers(custs || []);
      } catch (cErr) {
        console.warn('Customers fallback:', cErr);
      }

      // 6. Fetch Reviews
      try {
        const revs = await api.get('/admin/reviews');
        setReviewsList(revs || []);
      } catch (rErr) {
        console.warn('Reviews endpoint fallback:', rErr);
      }

      // 7. Fetch Returns
      try {
        const rets = await api.get('/admin/returns');
        setReturnsList(rets || []);
      } catch (retErr) {
        console.warn('Returns endpoint fallback:', retErr);
      }

      // 8. Fetch Payment Metrics
      try {
        const payMetrics = await api.get('/admin/payments/analytics');
        setPaymentMetrics(payMetrics || paymentMetrics);
      } catch (pErr) {
        console.warn('Payments endpoint fallback:', pErr);
      }

      // 9. Fetch Staff RBAC accounts
      try {
        const staff = await api.get('/admin/staff');
        setStaffList(staff || []);
      } catch (sErr) {
        console.warn('Staff endpoint fallback:', sErr);
      }

      // 10. Fetch Configuration Settings
      try {
        const settings = await api.get('/admin/settings');
        if (settings) {
          setBusinessName(settings.businessName || 'Al Özhan Parfums');
          setGstNumber(settings.gstNumber || '27AAAAA0000A1Z5');
          setBusinessAddress(settings.address || 'Atelier House, Colaba, Mumbai, India');
          setGstPercent(settings.gstPercent?.toString() || '18');
          setStateTax(settings.stateTax?.toString() || '9');
          setInvoiceLogo(settings.logo || '');
          setInvoiceFooter(settings.footerText || '');
          setInvoiceTerms(settings.terms || '');
        }
      } catch (setErr) {
        console.warn('Settings endpoint fallback:', setErr);
      }

      // Compute general live business analytics
      const totalOrdersCount = loadedOrders.length;
      const totalProductsCount = loadedProducts.length;
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
      setError(err.message || 'Failed to synchronize administrative dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  // Multer file upload
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

  // Submit product creation (updated with fragrance characteristics)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!newProductName || !newProductBrand || !newProductPrice || !newProductDescription || !newProductImage) {
      setFormError('Please fill in all mandatory fields and upload a product image.');
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
        image: newProductImage,
        // Fragrance specific attributes
        topNotes: topNotesText.split(',').map(s => s.trim()).filter(Boolean),
        middleNotes: middleNotesText.split(',').map(s => s.trim()).filter(Boolean),
        baseNotes: baseNotesText.split(',').map(s => s.trim()).filter(Boolean),
        family: perfumeFamily,
        gender: perfumeGender,
        occasions: perfumeOccasions
      };

      await api.post('/products', productData);
      
      setFormSuccess(true);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductStock('10');
      setNewProductDescription('');
      setNewProductImage('');
      
      // Refresh Lists
      syncData();

      setTimeout(() => setFormSuccess(false), 4000);
    } catch (err) {
      setFormError(err.message || 'Failed to publish new perfume catalog entry.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to remove this perfume from catalogs?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      syncData();
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setEditProductName(product.name || '');
    setEditProductBrand(product.brand || '');
    setEditProductCategory(product.category || 'Floral');
    setEditProductPrice(product.price?.toString() || '');
    setEditProductStock(product.countInStock?.toString() || '0');
    setEditProductDescription(product.description || '');
    setEditProductImage(product.image || '');
    setEditTopNotesText(product.topNotes?.join(', ') || '');
    setEditMiddleNotesText(product.middleNotes?.join(', ') || '');
    setEditBaseNotesText(product.baseNotes?.join(', ') || '');
    setEditPerfumeFamily(product.family || 'Floral');
    setEditPerfumeGender(product.gender || 'Unisex');
    setEditPerfumeOccasions(product.occasions || []);
    setEditFormError('');
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setEditUploading(true);
    setEditFormError('');

    try {
      const res = await api.upload('/upload', formData);
      setEditProductImage(res.image);
    } catch (err) {
      setEditFormError(err.message || 'Image upload failed. Ensure server is online.');
    } finally {
      setEditUploading(false);
    }
  };

  const handleEditOccasionToggle = (occ) => {
    if (editPerfumeOccasions.includes(occ)) {
      setEditPerfumeOccasions(editPerfumeOccasions.filter(o => o !== occ));
    } else {
      setEditPerfumeOccasions([...editPerfumeOccasions, occ]);
    }
  };

  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    setEditFormError('');

    if (!editProductName || !editProductBrand || !editProductPrice || !editProductDescription || !editProductImage) {
      setEditFormError('Please fill in all mandatory fields and upload a product image.');
      return;
    }

    try {
      const updatedData = {
        name: editProductName,
        brand: editProductBrand,
        category: editProductCategory,
        price: Number(editProductPrice),
        countInStock: Number(editProductStock),
        description: editProductDescription,
        image: editProductImage,
        topNotes: editTopNotesText.split(',').map(s => s.trim()).filter(Boolean),
        middleNotes: editMiddleNotesText.split(',').map(s => s.trim()).filter(Boolean),
        baseNotes: editBaseNotesText.split(',').map(s => s.trim()).filter(Boolean),
        family: editPerfumeFamily,
        gender: editPerfumeGender,
        occasions: editPerfumeOccasions
      };

      await api.put(`/products/${editingProduct._id}`, updatedData);
      setEditingProduct(null);
      syncData();
    } catch (err) {
      setEditFormError(err.message || 'Failed to update perfume catalogue entry.');
    }
  };

  const handleDeleteQuery = async (id) => {
    if (!window.confirm('Delete this user query from archives?')) {
      return;
    }

    try {
      await api.delete(`/contact/${id}`);
      syncData();
    } catch (err) {
      alert(err.message || 'Failed to remove query.');
    }
  };

  // Mark order status
  const handleMarkAsPaid = async (id) => {
    setStatusUpdatingId(id);
    try {
      await api.put(`/orders/${id}/pay`, {});
      await syncData();
    } catch (err) {
      alert(err.message || 'Failed to update order payment.');
    } finally {
      setStatusUpdatingId('');
    }
  };

  const handleMarkAsDelivered = async (id) => {
    setStatusUpdatingId(id);
    try {
      await api.put(`/orders/${id}/deliver`, {});
      await syncData();
    } catch (err) {
      alert(err.message || 'Failed to update delivery.');
    } finally {
      setStatusUpdatingId('');
    }
  };

  // Inventory Adjustment Form Submit
  const handleAdjustInventorySubmit = async (e) => {
    e.preventDefault();
    if (!selectedInventoryProduct || !inventoryQuantity) {
      alert('Please select product and enter quantity');
      return;
    }

    setInventorySuccess(false);
    try {
      await api.put('/admin/inventory/adjust', {
        productId: selectedInventoryProduct,
        action: inventoryAction,
        quantity: Number(inventoryQuantity)
      });
      setInventorySuccess(true);
      setInventoryQuantity('5');
      syncData();
      setTimeout(() => setInventorySuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Adjustment failed');
    }
  };

  // Customer Actions
  const handleBlockCustomer = async (id, isBlocked) => {
    if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this customer?`)) {
      return;
    }

    try {
      await api.put(`/admin/customers/${id}/block`, { isBlocked: !isBlocked });
      syncData();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passResetValue || passResetValue.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await api.put(`/admin/customers/${passResetTargetId}/reset-password`, { newPassword: passResetValue });
      setPassResetSuccess(true);
      setPassResetValue('');
      setTimeout(() => {
        setPassResetSuccess(false);
        setPassResetTargetId('');
      }, 3000);
    } catch (err) {
      alert(err.message || 'Reset failed');
    }
  };

  const handleIssueCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode) {
      alert('Please enter a coupon code');
      return;
    }

    try {
      await api.put(`/admin/customers/${couponTargetId}/coupon`, { couponCode });
      setCouponSuccess(true);
      setCouponCode('');
      syncData();
      setTimeout(() => {
        setCouponSuccess(false);
        setCouponTargetId('');
      }, 3000);
    } catch (err) {
      alert(err.message || 'Failed to issue coupon');
    }
  };

  // Review Actions
  const handleReviewStatusUpdate = async (reviewId, productId, status) => {
    try {
      setReviewActionSuccess(false);
      await api.put(`/admin/reviews/${reviewId}/status`, { productId, status });
      setReviewActionSuccess(true);
      syncData();
      setTimeout(() => setReviewActionSuccess(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to update review');
    }
  };

  const handleReviewReplySubmit = async (e) => {
    e.preventDefault();
    if (!reviewReplyText) return;

    try {
      await api.post(`/admin/reviews/${selectedReviewForReply._id}/reply`, {
        productId: selectedReviewForReply.productId,
        reply: reviewReplyText
      });
      setReviewReplyText('');
      setSelectedReviewForReply(null);
      syncData();
    } catch (err) {
      alert(err.message || 'Failed to submit reply');
    }
  };

  // Return & Refund Actions
  const handleReturnAction = async (id, status) => {
    try {
      setReturnActionSuccess(false);
      let refAmt = returnRefundAmount ? Number(returnRefundAmount) : undefined;
      await api.put(`/admin/returns/${id}`, { status, refundAmount: refAmt });
      setReturnRefundAmount('');
      setReturnActionSuccess(true);
      syncData();
      setTimeout(() => setReturnActionSuccess(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to execute returns action');
    }
  };

  // Staff Management (RBAC Role Editing)
  const handleUpdateStaffRole = async (staffId, newRole) => {
    try {
      await api.put(`/admin/staff/${staffId}/role`, { role: newRole });
      syncData();
      alert('Staff access privileges updated.');
    } catch (err) {
      alert(err.message || 'Failed to change staff credentials');
    }
  };

  // Save Config GST/Settings
  const handleSaveStoreSettings = async (e) => {
    e.preventDefault();
    setSettingsSuccess(false);

    try {
      await api.put('/admin/settings', {
        businessName,
        gstNumber,
        address: businessAddress,
        gstPercent: Number(gstPercent),
        stateTax: Number(stateTax),
        logo: invoiceLogo,
        footerText: invoiceFooter,
        terms: invoiceTerms
      });
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save store configurations');
    }
  };

  // Occasions checklist toggler
  const handleOccasionToggle = (occ) => {
    if (perfumeOccasions.includes(occ)) {
      setPerfumeOccasions(perfumeOccasions.filter(o => o !== occ));
    } else {
      setPerfumeOccasions([...perfumeOccasions, occ]);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order._id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (order.user?.name || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.orderItems.some(item => item.name.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    const matchesPayment = 
      orderPaymentFilter === 'all' ||
      (orderPaymentFilter === 'paid' && order.isPaid) ||
      (orderPaymentFilter === 'unpaid' && !order.isPaid);

    const matchesDelivery = 
      orderDeliveryFilter === 'all' ||
      (orderDeliveryFilter === 'delivered' && order.isDelivered) ||
      (orderDeliveryFilter === 'transit' && !order.isDelivered);

    return matchesSearch && matchesPayment && matchesDelivery;
  }).sort((a, b) => {
    if (orderSortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (orderSortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (orderSortBy === 'price-high') return b.totalPrice - a.totalPrice;
    if (orderSortBy === 'price-low') return a.totalPrice - b.totalPrice;
    return 0;
  });

  // Customer Filtering
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  // Review Analytics
  const averageReviewRating = reviewsList.length > 0 
    ? reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length
    : 0;

  return (
    <div className="min-h-screen bg-[#fdfcf9] flex flex-col md:flex-row pt-20 font-sans antialiased text-[#362720]">
      
      {/* Sleek Dark Admin Navigation Sidebar */}
      <div className="w-full md:w-64 bg-[#1a1512] text-[#f7f5f2] border-r border-[#d4af37]/15 flex-shrink-0 flex flex-col justify-between p-6">
        <div>
          <div className="border-b border-[#d4af37]/10 pb-4 mb-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37] font-bold block mb-1">
              Atelier Control Console
            </span>
            <h2 className="text-xl font-bold tracking-tighter text-white uppercase">Al Özhan Admin</h2>
          </div>

          <nav className="space-y-1.5 h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
            {/* 1. Analytics */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'analytics' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Live Analytics
            </button>

            {/* 2. Add Product */}
            <button
              onClick={() => setActiveTab('add-product')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'add-product' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Perfume
            </button>

            {/* 3. Manage Products */}
            <button
              onClick={() => setActiveTab('manage-products')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'manage-products' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Store Catalog
            </button>

            {/* 4. Inventory Management */}
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'inventory' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Inventory Stock
            </button>

            {/* 5. Customer Management */}
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'customers' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Customers
            </button>

            {/* 6. Review Management */}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'reviews' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Reviews
            </button>

            {/* 7. Returns & Refunds */}
            <button
              onClick={() => setActiveTab('returns')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'returns' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Returns Queue
            </button>

            {/* 8. Payment Management */}
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'payments' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Payment gateways
            </button>

            {/* 9. Orders */}
            <button
              onClick={() => setActiveTab('manage-orders')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'manage-orders' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Manage Orders
            </button>

            {/* 10. Staff RBAC */}
            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'staff' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Staff (RBAC)
            </button>

            {/* 11. Settings */}
            <button
              onClick={() => setActiveTab('settings-gst')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'settings-gst' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Atelier Settings
            </button>

            {/* 12. Queries */}
            <button
              onClick={() => setActiveTab('customer-queries')}
              className={`w-full py-2.5 px-3 rounded-xs flex items-center gap-2.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                activeTab === 'customer-queries' ? 'bg-[#d4af37] text-black' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Queries
            </button>
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-stone-500 font-mono">
          <span>Privilege: {currentUserRole}</span>
          <button onClick={syncData} className="p-1 hover:bg-white/5 text-stone-400 rounded-full transition-all">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-2 border-red-500 text-red-800 text-xs font-semibold rounded-sm">
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
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-light text-[#261c16] tracking-tight">Business Overview</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Calculated in real-time from active catalogs, checkout transactions, and ledger logs.</p>
              </div>

              {/* Stats Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-stone-200/80 p-5 rounded-sm flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Total Revenue</span>
                    <h3 className="text-xl font-light font-mono text-[#78532f]">${analytics.totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="p-2.5 bg-[#78532f]/10 text-[#78532f] rounded-full">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white border border-stone-200/80 p-5 rounded-sm flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Items Sold</span>
                    <h3 className="text-xl font-light font-mono text-[#78532f]">{analytics.totalSales} units</h3>
                  </div>
                  <div className="p-2.5 bg-[#78532f]/10 text-[#78532f] rounded-full">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white border border-stone-200/80 p-5 rounded-sm flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Total Checkouts</span>
                    <h3 className="text-xl font-light font-mono text-[#78532f]">{analytics.totalOrders} orders</h3>
                  </div>
                  <div className="p-2.5 bg-[#78532f]/10 text-[#78532f] rounded-full">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-white border border-stone-200/80 p-5 rounded-sm flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">Avg Order Value</span>
                    <h3 className="text-xl font-light font-mono text-[#78532f]">${analytics.averageOrderValue.toFixed(2)}</h3>
                  </div>
                  <div className="p-2.5 bg-[#78532f]/10 text-[#78532f] rounded-full">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Recent Orders table */}
              <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-xs">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold mb-4 border-b border-stone-100 pb-2">
                  Recent Store Checkouts
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                        <th className="py-2.5 px-2">Order ID</th>
                        <th className="py-2.5 px-2">Buyer</th>
                        <th className="py-2.5 px-2">Checkout Date</th>
                        <th className="py-2.5 px-2">Payment Status</th>
                        <th className="py-2.5 px-2 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="hover:bg-stone-50/50">
                          <td className="py-2.5 px-2 font-mono text-[9px] text-stone-500">{order._id}</td>
                          <td className="py-2.5 px-2">{order.user?.name || 'Guest'}</td>
                          <td className="py-2.5 px-2 text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider ${
                              order.isPaid ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {order.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-semibold font-mono text-[#78532f]">
                            ${order.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ADD PRODUCT CATALOG FORM (with fragrance note inputs) */}
          {activeTab === 'add-product' && (
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
          )}

          {/* TAB 3: CATALOG LIST */}
          {activeTab === 'manage-products' && (
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

              {loading ? (
                <div className="text-center py-10 text-xs text-stone-400">Loading catalog...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-10 text-xs text-stone-400">No products found.</div>
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
                        <th className="py-2.5 px-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-stone-50/50">
                          <td className="py-2.5 px-2">
                            <div className="w-8 h-10 bg-stone-100 rounded-xs overflow-hidden border border-stone-200/50">
                              <img src={product.image.startsWith('http') ? product.image : `https://ozhan-backend.onrender.com${product.image}`} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-stone-850">{product.name}</td>
                          <td className="py-2.5 px-2 text-stone-400">{product.brand}</td>
                          <td className="py-2.5 px-2 text-amber-700">{product.family || 'Floral'}</td>
                          <td className="py-2.5 px-2 text-stone-500">{product.gender || 'Unisex'}</td>
                          <td className="py-2.5 px-2 text-stone-400 text-[10px] max-w-[150px] truncate">
                            {product.topNotes?.join(', ') || 'N/A'}
                          </td>
                          <td className="py-2.5 px-2 text-right font-semibold font-mono text-[#78532f]">${product.price.toFixed(2)}</td>
                          <td className="py-2.5 px-2 text-center space-x-2 whitespace-nowrap">
                            <button onClick={() => handleEditProductClick(product)} className="p-1 text-stone-400 hover:text-[#d4af37] rounded-full transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(product._id)} className="p-1 text-stone-400 hover:text-red-500 rounded-full transition-all">
                              <Trash2 className="w-4 h-4" />
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

          {/* TAB 4: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-light text-[#261c16] tracking-tight">Inventory & Stock Tracking</h1>
                  <p className="text-xs text-stone-500 font-light mt-1">Monitor available stock levels, view low stock alerts, and record adjustment logs.</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Low Stock: {inventoryList.filter(i => i.countInStock <= (i.lowStockThreshold || 10) && i.countInStock > 0).length}
                  </div>
                  <div className="bg-red-100 border border-red-300 text-red-900 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 font-black" />
                    Out of Stock: {inventoryList.filter(i => i.countInStock === 0).length}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Available Stock Table */}
                <div className="lg:col-span-2 bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Stock Inventory levels</h3>
                  
                  <div className="overflow-x-auto h-[350px] overflow-y-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold sticky top-0 bg-white">
                          <th className="py-2.5 px-2">Perfume Name</th>
                          <th className="py-2.5 px-2">Available</th>
                          <th className="py-2.5 px-2">Reserved</th>
                          <th className="py-2.5 px-2">Sold</th>
                          <th className="py-2.5 px-2">Threshold</th>
                          <th className="py-2.5 px-2">Alert</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                        {inventoryList.map((item) => {
                          const isLow = item.countInStock <= (item.lowStockThreshold || 10);
                          const isOut = item.countInStock === 0;
                          return (
                            <tr key={item._id} className="hover:bg-stone-50/50">
                              <td className="py-2.5 px-2 text-stone-850">{item.name}</td>
                              <td className="py-2.5 px-2 font-mono font-bold">{item.countInStock}</td>
                              <td className="py-2.5 px-2 font-mono text-stone-400">{item.reservedStock || 0}</td>
                              <td className="py-2.5 px-2 font-mono text-green-700">{item.soldStock || 0}</td>
                              <td className="py-2.5 px-2 font-mono text-stone-400">{item.lowStockThreshold || 10}</td>
                              <td className="py-2.5 px-2">
                                {isOut ? (
                                  <span className="bg-red-100 text-red-800 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">Out of Stock</span>
                                ) : isLow ? (
                                  <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">Low Stock</span>
                                ) : (
                                  <span className="bg-green-100 text-green-800 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">Healthy</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Adjust Stock Form */}
                <div className="lg:col-span-1 bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Inventory Actions</h3>
                  
                  {inventorySuccess && <div className="p-3 bg-green-50 text-green-800 text-xs rounded-sm">Stock adjusted and logged!</div>}

                  <form onSubmit={handleAdjustInventorySubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Select Perfume</label>
                      <select
                        value={selectedInventoryProduct} onChange={(e) => setSelectedInventoryProduct(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 cursor-pointer"
                      >
                        <option value="">-- Choose Perfume --</option>
                        {inventoryList.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Action</label>
                      <select
                        value={inventoryAction} onChange={(e) => setInventoryAction(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 cursor-pointer"
                      >
                        <option value="Add">Add Inventory (+)</option>
                        <option value="Reduce">Reduce Inventory (-)</option>
                        <option value="Adjustment">Stock Adjustment (Exact)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Quantity</label>
                      <input
                        type="number" min="0" value={inventoryQuantity} onChange={(e) => setInventoryQuantity(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 font-mono"
                      />
                    </div>

                    <button type="submit" className="w-full py-2.5 bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold tracking-widest uppercase rounded-sm shadow-md transition-colors">
                      Perform Operation
                    </button>
                  </form>
                </div>
              </div>

              {/* Inventory history logging */}
              <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-xs">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold mb-4 border-b border-stone-100 pb-2">Inventory transaction logs</h3>
                <div className="overflow-x-auto max-h-[250px] overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold sticky top-0 bg-white">
                        <th className="py-2.5 px-2">Log Date</th>
                        <th className="py-2.5 px-2">Product</th>
                        <th className="py-2.5 px-2">Action</th>
                        <th className="py-2.5 px-2">Quantity Change</th>
                        <th className="py-2.5 px-2">Operator (RBAC)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600 font-medium font-mono text-[10px]">
                      {inventoryHistory.map((log) => (
                        <tr key={log._id}>
                          <td className="py-2 px-2 text-stone-400">{new Date(log.createdAt).toLocaleString()}</td>
                          <td className="py-2 px-2 text-stone-800 font-sans">{log.product?.name || 'Removed Product'}</td>
                          <td className="py-2 px-2">
                            <span className={`px-1.5 py-0.5 rounded-xs text-[8px] font-bold uppercase tracking-wider ${
                              log.action === 'Add' ? 'bg-green-50 text-green-700' : log.action === 'Reduce' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2 px-2 font-bold">{log.quantity}</td>
                          <td className="py-2 px-2 font-sans text-stone-500">
                            {log.user?.name} ({log.user?.role})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: CUSTOMER MANAGEMENT */}
          {activeTab === 'customers' && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-light text-[#261c16] tracking-tight">Customer Management</h1>
                  <p className="text-xs text-stone-500 font-light mt-1">Review purchase histories, lifetime values, restrict customer access, and issue coupons.</p>
                </div>
                
                <div className="relative w-full max-w-xs shrink-0">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text" placeholder="Search by name or email..."
                    value={customerSearchQuery} onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-sm py-1.5 pl-9 pr-3 text-xs placeholder-stone-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Customers Listing Table */}
                <div className="lg:col-span-2 bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Registered Customer Directory</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                          <th className="py-2.5 px-2">Name</th>
                          <th className="py-2.5 px-2">Email</th>
                          <th className="py-2.5 px-2">Status</th>
                          <th className="py-2.5 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                        {filteredCustomers.map((c) => (
                          <tr key={c._id} className="hover:bg-stone-50/50">
                            <td className="py-2.5 px-2 text-stone-850 flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#78532f] font-bold text-[10px] flex items-center justify-center shrink-0">
                                {c.name.charAt(0).toUpperCase()}
                              </span>
                              <span className="truncate">{c.name}</span>
                            </td>
                            <td className="py-2.5 px-2 text-stone-500 truncate max-w-[120px]">{c.email}</td>
                            <td className="py-2.5 px-2">
                              {c.isBlocked ? (
                                <span className="bg-red-50 text-red-800 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">Blocked</span>
                              ) : (
                                <span className="bg-green-50 text-green-800 text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">Active</span>
                              )}
                            </td>
                            <td className="py-2.5 px-2 text-right space-x-1 whitespace-nowrap">
                              <button onClick={() => setSelectedCustomerProfile(c)} className="text-[9px] font-bold uppercase tracking-wider border border-stone-200 py-1 px-2 rounded-xs hover:border-stone-400 bg-white">
                                Analytics
                              </button>
                              <button onClick={() => handleBlockCustomer(c._id, c.isBlocked)} className={`text-[9px] font-bold uppercase tracking-wider border py-1 px-2 rounded-xs ${
                                c.isBlocked ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100' : 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                              }`}>
                                {c.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Customer Details & Actions panel */}
                <div className="lg:col-span-1 bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-5">
                  <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Details & Controls</h3>
                  
                  {selectedCustomerProfile ? (
                    <div className="space-y-4 text-xs">
                      {/* Details block */}
                      <div className="space-y-2 bg-stone-50/50 p-3.5 rounded-sm border border-stone-200/50">
                        <h4 className="font-bold text-stone-850 text-sm flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[#d4af37]" /> Profile Details
                        </h4>
                        <div className="space-y-1.5 font-light text-stone-600">
                          <p><strong className="font-medium text-stone-800">Phone:</strong> {selectedCustomerProfile.phone || 'N/A'}</p>
                          <p><strong className="font-medium text-stone-800">Address:</strong> {selectedCustomerProfile.address || 'N/A'}</p>
                          <p><strong className="font-medium text-stone-800">Spend:</strong> ${selectedCustomerProfile.totalSpend?.toFixed(2) || '0.00'}</p>
                          <p><strong className="font-medium text-stone-800">LTV:</strong> ${selectedCustomerProfile.lifetimeValue?.toFixed(2) || '0.00'}</p>
                          <p><strong className="font-medium text-stone-800">Frequency:</strong> {selectedCustomerProfile.purchaseFrequency || 0} ord/mo</p>
                          <p><strong className="font-medium text-stone-800">Last Purchase:</strong> {selectedCustomerProfile.lastPurchaseDate ? new Date(selectedCustomerProfile.lastPurchaseDate).toLocaleDateString() : 'Never'}</p>
                        </div>
                      </div>

                      {/* Reset Password form */}
                      <div className="space-y-1.5 border-t border-stone-100 pt-3">
                        <h5 className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Reset Password</h5>
                        {passResetSuccess && <p className="text-green-700 text-[10px]">Password reset successful!</p>}
                        <form onSubmit={handleResetPasswordSubmit} className="flex gap-2">
                          <input
                            type="password" placeholder="New password..."
                            value={passResetValue} onChange={(e) => {
                              setPassResetValue(e.target.value);
                              setPassResetTargetId(selectedCustomerProfile._id);
                            }}
                            className="bg-stone-50 border border-stone-200 rounded-sm py-1 px-2 text-xs flex-grow focus:outline-none focus:border-[#d4af37]"
                          />
                          <button type="submit" className="bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold px-3 py-1 rounded-sm uppercase">
                            Reset
                          </button>
                        </form>
                      </div>

                      {/* Issue Coupon form */}
                      <div className="space-y-1.5 border-t border-stone-100 pt-3">
                        <h5 className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Issue Coupon</h5>
                        {couponSuccess && <p className="text-green-700 text-[10px]">Coupon code issued!</p>}
                        <form onSubmit={handleIssueCouponSubmit} className="flex gap-2">
                          <input
                            type="text" placeholder="e.g. OUD15..."
                            value={couponCode} onChange={(e) => {
                              setCouponCode(e.target.value);
                              setCouponTargetId(selectedCustomerProfile._id);
                            }}
                            className="bg-stone-50 border border-stone-200 rounded-sm py-1 px-2 text-xs flex-grow focus:outline-none focus:border-[#d4af37] uppercase"
                          />
                          <button type="submit" className="bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold px-3 py-1 rounded-sm uppercase">
                            Issue
                          </button>
                        </form>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-10 text-stone-400 font-light text-xs">
                      Select a customer profile to edit password, award coupons, or review lifetime analytics details.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: REVIEW MANAGEMENT */}
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-light text-[#261c16] tracking-tight">Review Management</h1>
                  <p className="text-xs text-stone-500 font-light mt-1">Moderate customer reviews, configure visibility states, and post official developer replies.</p>
                </div>
                
                <div className="bg-white border border-stone-200/80 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                  Average Rating: {averageReviewRating.toFixed(1)} / 5.0
                </div>
              </div>

              {/* Review metrics: top and low rated perfumes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Rated */}
                <div className="bg-green-50/20 border border-green-200/60 p-4 rounded-sm">
                  <h4 className="text-[10px] uppercase tracking-widest text-green-800 font-bold mb-2.5">Top-Rated Perfumes (Rating &gt;= 4.5)</h4>
                  <div className="space-y-2 h-[120px] overflow-y-auto pr-1">
                    {products.filter(p => p.rating >= 4.5).map(p => (
                      <div key={p._id} className="flex justify-between items-center text-xs font-semibold text-stone-700">
                        <span>{p.name}</span>
                        <span className="font-mono text-green-700 font-bold">{p.rating.toFixed(1)} ★</span>
                      </div>
                    ))}
                    {products.filter(p => p.rating >= 4.5).length === 0 && (
                      <p className="text-stone-400 text-xs font-light">No top rated products yet.</p>
                    )}
                  </div>
                </div>

                {/* Low Rated */}
                <div className="bg-red-50/20 border border-red-200/60 p-4 rounded-sm">
                  <h4 className="text-[10px] uppercase tracking-widest text-red-800 font-bold mb-2.5">Low-Rated Perfumes (Rating &lt;= 3.0)</h4>
                  <div className="space-y-2 h-[120px] overflow-y-auto pr-1">
                    {products.filter(p => p.rating > 0 && p.rating <= 3.0).map(p => (
                      <div key={p._id} className="flex justify-between items-center text-xs font-semibold text-stone-700">
                        <span>{p.name}</span>
                        <span className="font-mono text-red-700 font-bold">{p.rating.toFixed(1)} ★</span>
                      </div>
                    ))}
                    {products.filter(p => p.rating > 0 && p.rating <= 3.0).length === 0 && (
                      <p className="text-stone-400 text-xs font-light">No low rated products found.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Listing */}
              <div className="bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Customer Reviews Moderation Queue</h3>
                
                {reviewActionSuccess && <div className="p-2 bg-green-50 text-green-800 text-[10px] rounded-xs font-bold uppercase tracking-wider">Action processed!</div>}

                <div className="divide-y divide-stone-100 space-y-4">
                  {reviewsList.map((rev) => (
                    <div key={rev._id} className="pt-4 first:pt-0 flex flex-col md:flex-row gap-4 justify-between items-start text-xs font-medium">
                      
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-850">{rev.name}</span>
                          <span className="text-[9px] font-bold font-mono text-[#d4af37] bg-stone-100 px-1 py-0.2 rounded-xs">{rev.rating} ★</span>
                          <span className="text-stone-400 font-light text-[9px]">- on {rev.productName}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-xs uppercase tracking-wider border ${
                            rev.status === 'approved' ? 'border-green-200 text-green-700 bg-green-50/50' : rev.status === 'rejected' ? 'border-red-200 text-red-700 bg-red-50/50' : 'border-stone-200 text-stone-600 bg-stone-50'
                          }`}>{rev.status}</span>
                        </div>
                        
                        <p className="text-stone-600 font-light leading-relaxed">{rev.comment}</p>
                        
                        {rev.reply && (
                          <div className="p-2 bg-stone-50 border-l-2 border-[#d4af37] text-[10px] font-light text-stone-500">
                            <strong>Official Reply:</strong> {rev.reply}
                          </div>
                        )}

                        {selectedReviewForReply?._id === rev._id && (
                          <form onSubmit={handleReviewReplySubmit} className="flex gap-2 items-end pt-2">
                            <textarea
                              required placeholder="Write a reply..." rows="2"
                              value={reviewReplyText} onChange={(e) => setReviewReplyText(e.target.value)}
                              className="bg-stone-50 border border-stone-200 rounded-sm p-2 text-[10px] flex-grow focus:outline-none focus:border-[#d4af37]"
                            />
                            <button type="submit" className="bg-[#26201c] hover:bg-black text-[#d4af37] text-[9px] font-bold px-3 py-2 rounded-sm uppercase shadow-xs shrink-0">
                              Submit Reply
                            </button>
                          </form>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0 md:self-center">
                        <button onClick={() => handleReviewStatusUpdate(rev._id, rev.productId, 'approved')} className="text-[8px] font-bold uppercase tracking-wider border border-green-200 text-green-700 px-2 py-1 rounded-xs bg-green-50/30 hover:bg-green-50">
                          Approve
                        </button>
                        <button onClick={() => handleReviewStatusUpdate(rev._id, rev.productId, 'rejected')} className="text-[8px] font-bold uppercase tracking-wider border border-red-200 text-red-700 px-2 py-1 rounded-xs bg-red-50/30 hover:bg-red-50">
                          Reject
                        </button>
                        <button onClick={() => handleReviewStatusUpdate(rev._id, rev.productId, 'hidden')} className="text-[8px] font-bold uppercase tracking-wider border border-stone-200 text-stone-500 px-2 py-1 rounded-xs bg-stone-50 hover:bg-stone-100">
                          Hide
                        </button>
                        <button onClick={() => setSelectedReviewForReply(rev)} className="text-[8px] font-bold uppercase tracking-wider border border-[#d4af37] text-black px-2 py-1 rounded-xs bg-[#d4af37]/15 hover:bg-[#d4af37]/35">
                          Reply
                        </button>
                      </div>

                    </div>
                  ))}
                  {reviewsList.length === 0 && (
                    <div className="text-center py-10 text-stone-400 font-light">No reviews found.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: RETURNS & REFUNDS */}
          {activeTab === 'returns' && (
            <motion.div
              key="returns"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-xl font-light text-[#261c16] tracking-tight">Returns & Refunds Queue</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Moderate customer return requests, request product image evidence, and issue payments refunds.</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-sm p-5 shadow-xs space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold border-b border-stone-100 pb-2">Return Requests Queue</h3>
                
                {returnActionSuccess && <div className="p-2 bg-green-50 text-green-800 text-[10px] rounded-xs font-bold uppercase tracking-wider">Returns request updated!</div>}

                <div className="divide-y divide-stone-100 space-y-4">
                  {returnsList.map((ret) => (
                    <div key={ret._id} className="pt-4 first:pt-0 flex flex-col md:flex-row gap-4 justify-between items-start text-xs font-medium">
                      
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-850">{ret.user?.name}</span>
                          <span className="text-stone-400 text-[9px]">- on Order ID {ret.order?._id}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-xs uppercase tracking-wider border ${
                            ret.status === 'Refunded' ? 'border-green-200 text-green-700 bg-green-50' : ret.status === 'Rejected' ? 'border-red-200 text-red-700 bg-red-50' : 'border-amber-200 text-amber-700 bg-amber-50'
                          }`}>{ret.status}</span>
                        </div>
                        
                        <p className="text-stone-600 font-light"><strong className="font-medium text-stone-800">Reason:</strong> {ret.reason}</p>
                        <p className="text-stone-600 font-light font-mono text-[10px]"><strong className="font-medium text-stone-800 font-sans">Refund Amount:</strong> ${ret.refundAmount.toFixed(2)}</p>
                        
                        {/* Display returns products */}
                        <div className="space-y-1 pt-1.5">
                          <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold block">Return Items</span>
                          {ret.items?.map((item, idx) => (
                            <p key={idx} className="text-stone-500 font-mono text-[10px] font-light">
                              {item.name} × {item.qty}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {ret.status === 'Pending' && (
                          <div className="space-y-2">
                            <input
                              type="number" placeholder="Refund amount..."
                              value={returnRefundAmount} onChange={(e) => setReturnRefundAmount(e.target.value)}
                              className="bg-stone-50 border border-stone-200 rounded-sm py-1 px-2 text-xs focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => handleReturnAction(ret._id, 'Approved')} className="text-[8px] font-bold uppercase tracking-wider border border-green-200 text-green-700 px-2 py-1 rounded-xs bg-green-50/50 hover:bg-green-50">
                                Approve
                              </button>
                              <button onClick={() => handleReturnAction(ret._id, 'Rejected')} className="text-[8px] font-bold uppercase tracking-wider border border-red-200 text-red-700 px-2 py-1 rounded-xs bg-red-50/50 hover:bg-red-50">
                                Reject
                              </button>
                              <button onClick={() => handleReturnAction(ret._id, 'ImagesRequested')} className="text-[8px] font-bold uppercase tracking-wider border border-amber-200 text-amber-700 px-2 py-1 rounded-xs bg-amber-50/50 hover:bg-amber-50">
                                Ask Pics
                              </button>
                            </div>
                          </div>
                        )}

                        {ret.status === 'Approved' && (
                          <button onClick={() => handleReturnAction(ret._id, 'Refunded')} className="text-[8px] font-bold uppercase tracking-wider bg-green-600 text-white py-1 px-3.5 rounded-xs hover:bg-green-700">
                            Issue Refund payment
                          </button>
                        )}

                        {(ret.status === 'Refunded' || ret.status === 'Rejected') && (
                          <span className="text-[9px] text-stone-400 font-mono italic">
                            Closed on {new Date(ret.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                    </div>
                  ))}
                  {returnsList.length === 0 && (
                    <div className="text-center py-10 text-stone-400 font-light">No return requests.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 8: PAYMENT MANAGEMENT */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-xl font-light text-[#261c16] tracking-tight">Payment Gateways & Transactions</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Review active transactions, gateway success percentages, and refund volumes.</p>
              </div>

              {/* Gateways Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.entries(paymentMetrics).map(([gw, data]) => {
                  const totalTrans = data.successful + data.failed + data.refunds;
                  const rate = totalTrans > 0 ? (data.successful / totalTrans) * 100 : 100;
                  return (
                    <div key={gw} className="bg-white border border-stone-200 p-5 rounded-sm shadow-xs space-y-3">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                        <h4 className="font-bold text-stone-850 text-xs tracking-wider uppercase">{gw}</h4>
                        <CreditCard className="w-4 h-4 text-[#d4af37]" />
                      </div>
                      <div className="space-y-1.5 font-mono text-[10px] text-stone-500">
                        <p className="flex justify-between text-green-700"><strong>Success:</strong> <span>{data.successful}</span></p>
                        <p className="flex justify-between text-red-700"><strong>Failed:</strong> <span>{data.failed}</span></p>
                        <p className="flex justify-between text-blue-700"><strong>Refunds:</strong> <span>{data.refunds}</span></p>
                        <p className="flex justify-between border-t border-stone-100 pt-1.5 text-stone-800 font-semibold font-sans text-xs">
                          <span>Health Rate:</span> <span>{rate.toFixed(0)}%</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Transactions list */}
              <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-xs">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-700 font-bold mb-4 border-b border-stone-100 pb-2">Recent transactions list</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                        <th className="py-2 px-2">Txn ID</th>
                        <th className="py-2 px-2">Payment Method</th>
                        <th className="py-2 px-2">Amount</th>
                        <th className="py-2 px-2">Tax</th>
                        <th className="py-2 px-2">Grand Total</th>
                        <th className="py-2 px-2">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600 font-mono text-[10px]">
                      {orders.slice(0, 10).map(o => (
                        <tr key={o._id}>
                          <td className="py-2 px-2 text-stone-400">{o.paymentResult?.id || `COD-TXN-${o._id.slice(0, 6)}`}</td>
                          <td className="py-2 px-2 font-sans font-bold text-stone-700 uppercase">{o.paymentMethod || 'COD'}</td>
                          <td className="py-2 px-2">${o.itemsPrice?.toFixed(2) || o.totalPrice}</td>
                          <td className="py-2 px-2">${o.taxPrice?.toFixed(2) || '0.00'}</td>
                          <td className="py-2 px-2 font-bold text-[#78532f]">${o.totalPrice.toFixed(2)}</td>
                          <td className="py-2 px-2">
                            {o.isPaid ? (
                              <span className="bg-green-50 text-green-700 text-[8px] font-bold px-1 py-0.2 rounded-xs uppercase">Success</span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 text-[8px] font-bold px-1 py-0.2 rounded-xs uppercase">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 9: ORDERS */}
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
                  <h1 className="text-xl font-light text-[#261c16] tracking-tight">Active Orders</h1>
                  <p className="text-xs text-stone-500 font-light mt-1">Review checkouts, adjust shipment tracking statuses, and process deliveries.</p>
                </div>
              </div>

              {/* SEARCH & FILTERS CONTROLS */}
              <div className="bg-white border border-stone-200/80 rounded-sm p-4 shadow-xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text" placeholder="Search by Order ID, Buyer Name, or Perfume Name..."
                      value={orderSearchQuery} onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-9 text-xs text-stone-850 focus:outline-none"
                    />
                  </div>
                  <div>
                    <select
                      value={orderPaymentFilter} onChange={(e) => setOrderPaymentFilter(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="all">Payment: All</option>
                      <option value="paid">Payment: Paid</option>
                      <option value="unpaid">Payment: Unpaid / COD</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={orderDeliveryFilter} onChange={(e) => setOrderDeliveryFilter(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="all">Delivery: All</option>
                      <option value="delivered">Delivery: Delivered</option>
                      <option value="transit">Delivery: In Transit</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredOrders.map(order => {
                  const isExpanded = expandedOrderId === order._id;
                  return (
                    <div key={order._id} className="bg-white border border-stone-200 rounded-sm overflow-hidden text-xs">
                      <div onClick={() => setExpandedOrderId(isExpanded ? null : order._id)} className="p-4 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-stone-50/20">
                        <div>
                          <span className="text-[8px] text-stone-400 font-bold uppercase block">Order ID</span>
                          <span className="font-mono text-stone-850 font-bold">{order._id}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-stone-400 font-bold uppercase block">Buyer</span>
                          <span className="font-semibold">{order.user?.name || 'Guest'}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-stone-400 font-bold uppercase block">Total Price</span>
                          <span className="font-mono text-[#78532f] font-bold">${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-stone-400 font-bold uppercase block">Status</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-xs uppercase ${
                            order.isPaid ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
                          }`}>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
                        </div>
                        <span className="text-[#b38f44] font-bold text-[9px] uppercase">{isExpanded ? 'Collapse' : 'Details'}</span>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-stone-100 bg-[#fdfcf9]/30 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-bold text-[#b38f44] text-[9px] uppercase tracking-wider mb-1.5">Shipping</h5>
                              <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                              <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                            </div>
                            <div>
                              <h5 className="font-bold text-[#b38f44] text-[9px] uppercase tracking-wider mb-1.5">Items</h5>
                              {order.orderItems.map((item, idx) => (
                                <p key={idx} className="font-light text-stone-600">{item.name} (Qty: {item.qty})</p>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end border-t border-stone-100 pt-3">
                            {!order.isPaid && (
                              <button onClick={() => handleMarkAsPaid(order._id)} className="bg-[#d4af37] text-black font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-xs">
                                Set Paid
                              </button>
                            )}
                            {!order.isDelivered && (
                              <button onClick={() => handleMarkAsDelivered(order._id)} className="bg-green-600 text-white font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-xs">
                                Set Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 10: STAFF MANAGEMENT (RBAC) */}
          {activeTab === 'staff' && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6"
            >
              <div>
                <h1 className="text-xl font-light text-[#261c16] tracking-tight">Staff & Permissions (RBAC)</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Configure role-based access control permissions. Assign privileges to staff members.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                      <th className="py-2.5 px-2">Operator Name</th>
                      <th className="py-2.5 px-2">Email</th>
                      <th className="py-2.5 px-2">Access Role privilege</th>
                      <th className="py-2.5 px-2">Permissions</th>
                      <th className="py-2.5 px-2 text-right">Edit Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-600 font-medium">
                    {staffList.map((s) => {
                      const isSuper = s.role === 'super_admin';
                      return (
                        <tr key={s._id}>
                          <td className="py-3 px-2 text-stone-850 flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-full bg-[#1a1512] text-white flex items-center justify-center font-bold text-[9px]">
                              {s.name.charAt(0).toUpperCase()}
                            </span>
                            <span>{s.name}</span>
                          </td>
                          <td className="py-3 px-2 text-stone-500">{s.email}</td>
                          <td className="py-3 px-2">
                            <span className={`px-1.5 py-0.5 rounded-xs text-[8px] font-bold uppercase tracking-wider ${
                              isSuper ? 'bg-red-50 text-red-700' : s.role === 'admin' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {s.role}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-stone-400 text-[10px] font-light font-mono max-w-[180px] truncate">
                            {s.role === 'super_admin' && 'full_access (all_writes)'}
                            {s.role === 'admin' && 'full_access (except_super)'}
                            {s.role === 'manager' && 'products_orders_inventory'}
                            {s.role === 'inventory_manager' && 'inventory_stock_adjustments'}
                            {s.role === 'marketing_manager' && 'reviews_coupons_catalog'}
                            {s.role === 'customer_support' && 'returns_refunds_moderation'}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {isSuper && currentUserRole !== 'super_admin' ? (
                              <span className="text-[9px] text-stone-400 italic">Locked</span>
                            ) : (
                              <select
                                value={s.role} onChange={(e) => handleUpdateStaffRole(s._id, e.target.value)}
                                className="bg-stone-50 border border-stone-200 rounded-sm py-1 px-2 text-[10px] focus:outline-none cursor-pointer"
                              >
                                <option value="super_admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="inventory_manager">Inventory Manager</option>
                                <option value="marketing_manager">Marketing Manager</option>
                                <option value="customer_support">Customer Support</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 11: STORE & GST SETTINGS */}
          {activeTab === 'settings-gst' && (
            <motion.div
              key="settings-gst"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="max-w-3xl bg-white border border-stone-200 rounded-sm p-6 shadow-sm space-y-6"
            >
              <div>
                <h1 className="text-xl font-light text-[#261c16] tracking-tight">Atelier Store Settings</h1>
                <p className="text-xs text-stone-500 font-light mt-1">Configure business identifiers, tax/GST percentages, invoice logos, and checkout terms.</p>
              </div>

              {settingsSuccess && (
                <div className="p-3 bg-green-50 text-green-800 text-xs rounded-sm">
                  Atelier configurations updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveStoreSettings} className="space-y-5 text-xs text-stone-700 font-semibold">
                
                {/* General Settings */}
                <div className="space-y-4">
                  <h4 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold border-b border-stone-100 pb-1">
                    General Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Business Name</label>
                      <input
                        type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">GST Number</label>
                      <input
                        type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Business Address</label>
                    <input
                      type="text" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tax Settings */}
                <div className="space-y-4 pt-3">
                  <h4 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold border-b border-stone-100 pb-1">
                    Tax Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">GST Percentage (%)</label>
                      <input
                        type="number" value={gstPercent} onChange={(e) => setGstPercent(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">State Tax (%)</label>
                      <input
                        type="number" value={stateTax} onChange={(e) => setStateTax(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Settings */}
                <div className="space-y-4 pt-3">
                  <h4 className="text-[9px] uppercase tracking-widest text-[#b38f44] font-bold border-b border-stone-100 pb-1">
                    Invoice Configurations
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Atelier Logo Path (URL)</label>
                      <input
                        type="text" value={invoiceLogo} onChange={(e) => setInvoiceLogo(e.target.value)}
                        placeholder="/uploads/logo-atelier.png"
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Invoice Footer template</label>
                      <input
                        type="text" value={invoiceFooter} onChange={(e) => setInvoiceFooter(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Terms &amp; Conditions</label>
                      <textarea
                        rows="2" value={invoiceTerms} onChange={(e) => setInvoiceTerms(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm py-2 px-3 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[#26201c] hover:bg-black text-[#d4af37] text-[10px] font-bold tracking-widest uppercase rounded-sm shadow-md transition-colors">
                  Save Configurations
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 12: CUSTOMER QUERIES */}
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
                  <h1 className="text-xl font-light text-[#261c16] tracking-tight">Customer Queries</h1>
                  <p className="text-xs text-stone-500 font-light mt-1">Review contact form submissions, guest emails, and direct queries.</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-xs text-stone-400">Loading queries...</div>
              ) : queries.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-sm text-center py-20 px-6">
                  <MessageSquare size={48} strokeWidth={1} className="mb-3 text-[#d4af37] mx-auto opacity-60" />
                  <p className="text-xs tracking-wider uppercase font-semibold text-stone-600">No Queries Discovered</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {queries.map((query) => (
                    <div key={query._id} className="bg-white border border-stone-200 hover:border-stone-300 rounded-sm p-5 space-y-3 transition-all shadow-xs text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-stone-850 text-sm">{query.name}</h3>
                          <a href={`mailto:${query.email}`} className="text-xs text-[#b38f44] hover:underline font-semibold block">{query.email}</a>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-mono text-stone-400">{new Date(query.createdAt).toLocaleString()}</span>
                          <button onClick={() => handleDeleteQuery(query._id)} className="p-1 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded-full transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 bg-stone-50 border-l-2 border-[#d4af37] text-stone-600 font-light leading-relaxed whitespace-pre-wrap">
                        {query.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Edit Product Modal */}
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

    </div>
  );
};

export default AdminDashboard;
