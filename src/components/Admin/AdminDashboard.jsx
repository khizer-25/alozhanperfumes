import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';

import Sidebar from './Sidebar';
import EditProductModal from './EditProductModal';
import AnalyticsTab from './tabs/AnalyticsTab';
import AddProductTab from './tabs/AddProductTab';
import ManageProductsTab from './tabs/ManageProductsTab';
import InventoryTab from './tabs/InventoryTab';
import CustomersTab from './tabs/CustomersTab';
import ReviewsTab from './tabs/ReviewsTab';
import ReturnsTab from './tabs/ReturnsTab';
import PaymentsTab from './tabs/PaymentsTab';
import OrdersTab from './tabs/OrdersTab';
import StaffTab from './tabs/StaffTab';
import SettingsTab from './tabs/SettingsTab';
import QueriesTab from './tabs/QueriesTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  // Core lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inventory States
  const [inventoryList, setInventoryList] = useState([]);
  const [inventoryHistory, setInventoryHistory] = useState([]);
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState('');
  const [inventoryAction, setInventoryAction] = useState('Add');
  const [inventoryQuantity, setInventoryQuantity] = useState('5');
  const [inventorySuccess, setInventorySuccess] = useState(false);

  // Customer States
  const [customers, setCustomers] = useState([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponTargetId, setCouponTargetId] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [passResetTargetId, setPassResetTargetId] = useState('');
  const [passResetValue, setPassResetValue] = useState('');
  const [passResetSuccess, setPassResetSuccess] = useState(false);

  // Review States
  const [reviewsList, setReviewsList] = useState([]);
  const [selectedReviewForReply, setSelectedReviewForReply] = useState(null);
  const [reviewReplyText, setReviewReplyText] = useState('');
  const [reviewActionSuccess, setReviewActionSuccess] = useState(false);
  const [reviewSearchQuery, setReviewSearchQuery] = useState("");

  // Returns & Refunds States
  const [returnsList, setReturnsList] = useState([]);
  const [returnActionSuccess, setReturnActionSuccess] = useState(false);
  const [returnRefundAmount, setReturnRefundAmount] = useState('');

  // Payment States
  const [paymentMetrics, setPaymentMetrics] = useState({
    Razorpay: { successful: 0, failed: 0, refunds: 0 },
    Stripe: { successful: 0, failed: 0, refunds: 0 },
    PayPal: { successful: 0, failed: 0, refunds: 0 },
    COD: { successful: 0, failed: 0, refunds: 0 }
  });

  // User & Staff RBAC States
  const [staffList, setStaffList] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('admin');

  // Store & GST Settings States
  const [businessName, setBusinessName] = useState('Al Özhan Parfums');
  const [gstNumber, setGstNumber] = useState('27AAAAA0000A1Z5');
  const [businessAddress, setBusinessAddress] = useState('Atelier House, Colaba, Mumbai, India');
  const [gstPercent, setGstPercent] = useState('18');
  const [stateTax, setStateTax] = useState('9');
  const [invoiceLogo, setInvoiceLogo] = useState('');
  const [invoiceFooter, setInvoiceFooter] = useState('Al Özhan Parfums - Artisanal Fragrances. All Rights Reserved.');
  const [invoiceTerms, setInvoiceTerms] = useState('Products purchased are subject to return guidelines within 7 business days.');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Add Product Form States
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

      const productRes = await api.get('/products?pageSize=100');
      setProducts(productRes.products || []);

      const loadedOrders = await api.get('/orders');
      setOrders(loadedOrders);

      try {
        const queryRes = await api.get('/contact');
        setQueries(queryRes || []);
      } catch (qErr) {}

      try {
        const inv = await api.get('/admin/inventory');
        setInventoryList(inv || []);
        const hist = await api.get('/admin/inventory/history');
        setInventoryHistory(hist || []);
      } catch (iErr) {}

      try {
        const custs = await api.get('/admin/customers');
        setCustomers(custs || []);
      } catch (cErr) {}

      try {
        const revs = await api.get('/admin/reviews');
        setReviewsList(revs || []);
      } catch (rErr) {}

      try {
        const rets = await api.get('/admin/returns');
        setReturnsList(rets || []);
      } catch (retErr) {}

      try {
        const payMetrics = await api.get('/admin/payments/analytics');
        setPaymentMetrics(payMetrics || paymentMetrics);
      } catch (pErr) {}

      try {
        const staff = await api.get('/admin/staff');
        setStaffList(staff || []);
      } catch (sErr) {}
      
      try {
        const analyticsData = await api.get("/admin/analytics");
        setAnalytics(analyticsData);
      } catch (err) {}

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
      } catch (setErr) {}

    } catch (err) {
      setError(err.message || 'Failed to synchronize administrative dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

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
      setFormError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);
    if (!newProductName || !newProductBrand || !newProductPrice || !newProductDescription || !newProductImage) {
      setFormError('Please fill in all mandatory fields.');
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
      syncData();
      setTimeout(() => setFormSuccess(false), 4000);
    } catch (err) {
      setFormError(err.message || 'Failed to publish new perfume catalogue entry.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this perfume?')) return;
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
      setEditFormError(err.message || 'Image upload failed.');
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
      setEditFormError('Please fill in all mandatory fields.');
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
      setEditFormError(err.message || 'Failed to update catalog entry.');
    }
  };

  const handleDeleteQuery = async (id) => {
    if (!window.confirm('Delete this user query?')) return;
    try {
      await api.delete(`/contact/${id}`);
      syncData();
    } catch (err) {
      alert(err.message || 'Failed to remove query.');
    }
  };

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
      await syncData();
      setInventorySuccess(true);
      setSelectedInventoryProduct('');
      setInventoryAction('Add');
      setInventoryQuantity('5');
      setTimeout(() => setInventorySuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Adjustment failed');
    }
  };
  
  const handleBlockCustomer = async (id, isBlocked) => {
    if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this customer?`)) return;
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

  const handleReviewStatusUpdate = async (reviewId, productId, status) => {
    try {
      setReviewActionSuccess(false);
      await api.put(`/admin/reviews/${reviewId}/status`, { productId, status });
      setReviewActionSuccess(true);
      setSelectedReviewForReply(null);
      setReviewReplyText("");
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

  const handleReturnAction = async (returnId, status) => {
    try {
      await api.put(`/admin/returns/${returnId}`, {
        status,
        refundAmount: status === "Approved" || status === "Refunded" ? Number(returnRefundAmount) : undefined,
      });
      await syncData();
      setReturnActionSuccess(true);
      setReturnRefundAmount("");
      setTimeout(() => setReturnActionSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to update return request");
    }
  };

  const handleUpdateStaffRole = async (staffId, newRole) => {
    try {
      await api.put(`/admin/staff/${staffId}/role`, { role: newRole });
      syncData();
      alert('Staff access privileges updated.');
    } catch (err) {
      alert(err.message || 'Failed to change staff credentials');
    }
  };

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
      alert(err.message || 'Failed to save configuration');
    }
  };

  const handleOccasionToggle = (occ) => {
    if (perfumeOccasions.includes(occ)) {
      setPerfumeOccasions(perfumeOccasions.filter(o => o !== occ));
    } else {
      setPerfumeOccasions([...perfumeOccasions, occ]);
    }
  };

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

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );
  
  const filteredReviews = reviewsList.filter((review) => {
    const search = reviewSearchQuery.toLowerCase();
    return (
      review.name?.toLowerCase().includes(search) ||
      review.productName?.toLowerCase().includes(search) ||
      review.comment?.toLowerCase().includes(search)
    );
  });

  const averageReviewRating = reviewsList.length > 0
    ? reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length
    : 0;

  return (
    <div className="w-full h-screen overflow-hidden flex bg-[#fdfcf9] font-sans antialiased text-[#362720]">
      
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUserRole={currentUserRole}
        syncData={syncData}
      />

      <div className="flex-grow h-full flex flex-col overflow-hidden">
        {/* 
          FIXED: Changed padding to `pt-28 pb-10 px-6 md:px-10` 
          This forces the dynamic chart blocks down past the floating glass navbar perfectly.
        */}
        <div className="flex-grow pt-28 pb-10 px-6 md:px-10 overflow-y-auto no-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-2 border-red-500 text-red-800 text-xs font-semibold rounded-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'analytics' && (
              <AnalyticsTab analytics={analytics} orders={orders} />
            )}

            {activeTab === 'add-product' && (
              <AddProductTab
                categories={categories} families={families} genders={genders} occasionList={occasionList}
                newProductName={newProductName} setNewProductName={setNewProductName}
                newProductBrand={newProductBrand} setNewProductBrand={setNewProductBrand}
                newProductCategory={newProductCategory} setNewProductCategory={setNewProductCategory}
                newProductPrice={newProductPrice} setNewProductPrice={setNewProductPrice}
                newProductStock={newProductStock} setNewProductStock={setNewProductStock}
                newProductDescription={newProductDescription} setNewProductDescription={setNewProductDescription}
                newProductImage={newProductImage}
                topNotesText={topNotesText} setTopNotesText={setTopNotesText}
                middleNotesText={middleNotesText} setMiddleNotesText={setMiddleNotesText}
                baseNotesText={baseNotesText} setBaseNotesText={setBaseNotesText}
                perfumeFamily={perfumeFamily} setPerfumeFamily={setPerfumeFamily}
                perfumeGender={perfumeGender} setPerfumeGender={setPerfumeGender}
                perfumeOccasions={perfumeOccasions} handleOccasionToggle={handleOccasionToggle}
                uploading={uploading} handleImageUpload={handleImageUpload}
                formError={formError} formSuccess={formSuccess} handleAddProduct={handleAddProduct}
              />
            )}

            {activeTab === 'manage-products' && (
              <ManageProductsTab
                products={products} loading={loading}
                handleEditProductClick={handleEditProductClick}
                handleDeleteProduct={handleDeleteProduct}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryTab
                inventoryList={inventoryList} inventoryHistory={inventoryHistory}
                selectedInventoryProduct={selectedInventoryProduct} setSelectedInventoryProduct={setSelectedInventoryProduct}
                inventoryAction={inventoryAction} setInventoryAction={setInventoryAction}
                inventoryQuantity={inventoryQuantity} setInventoryQuantity={setInventoryQuantity}
                inventorySuccess={inventorySuccess} handleAdjustInventorySubmit={handleAdjustInventorySubmit}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersTab
                filteredCustomers={filteredCustomers}
                customerSearchQuery={customerSearchQuery} setCustomerSearchQuery={setCustomerSearchQuery}
                selectedCustomerProfile={selectedCustomerProfile} setSelectedCustomerProfile={setSelectedCustomerProfile}
                handleBlockCustomer={handleBlockCustomer}
                passResetValue={passResetValue} setPassResetValue={setPassResetValue}
                setPassResetTargetId={setPassResetTargetId} passResetSuccess={passResetSuccess}
                handleResetPasswordSubmit={handleResetPasswordSubmit}
                couponCode={couponCode} setCouponCode={setCouponCode}
                setCouponTargetId={setCouponTargetId} couponSuccess={couponSuccess}
                handleIssueCouponSubmit={handleIssueCouponSubmit}
              />
            )}

            {activeTab === 'reviews' && (
              <ReviewsTab
                products={products}
                reviewsList={filteredReviews}
                reviewSearchQuery={reviewSearchQuery}
                setReviewSearchQuery={setReviewSearchQuery}
                averageReviewRating={averageReviewRating}
                reviewActionSuccess={reviewActionSuccess}
                selectedReviewForReply={selectedReviewForReply}
                setSelectedReviewForReply={setSelectedReviewForReply}
                reviewReplyText={reviewReplyText}
                setReviewReplyText={setReviewReplyText}
                handleReviewStatusUpdate={handleReviewStatusUpdate}
                handleReviewReplySubmit={handleReviewReplySubmit}
              />
            )}

            {activeTab === 'returns' && (
              <ReturnsTab
                returnsList={returnsList} returnActionSuccess={returnActionSuccess}
                returnRefundAmount={returnRefundAmount} setReturnRefundAmount={setReturnRefundAmount}
                handleReturnAction={handleReturnAction}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentsTab paymentMetrics={paymentMetrics} orders={orders} />
            )}

            {activeTab === 'manage-orders' && (
              <OrdersTab
                filteredOrders={filteredOrders}
                orderSearchQuery={orderSearchQuery} setOrderSearchQuery={setOrderSearchQuery}
                orderPaymentFilter={orderPaymentFilter} setOrderPaymentFilter={setOrderPaymentFilter}
                orderDeliveryFilter={orderDeliveryFilter} setOrderDeliveryFilter={setOrderDeliveryFilter}
                expandedOrderId={expandedOrderId} setExpandedOrderId={setExpandedOrderId}
                handleMarkAsPaid={handleMarkAsPaid} handleMarkAsDelivered={handleMarkAsDelivered}
              />
            )}

            {activeTab === 'staff' && (
              <StaffTab
                staffList={staffList} currentUserRole={currentUserRole}
                handleUpdateStaffRole={handleUpdateStaffRole}
              />
            )}

            {activeTab === 'settings-gst' && (
              <SettingsTab
                businessName={businessName} setBusinessName={setBusinessName}
                gstNumber={gstNumber} setGstNumber={setGstNumber}
                businessAddress={businessAddress} setBusinessAddress={setBusinessAddress}
                gstPercent={gstPercent} setGstPercent={setGstPercent}
                stateTax={stateTax} setStateTax={setStateTax}
                invoiceLogo={invoiceLogo} setInvoiceLogo={setInvoiceLogo}
                invoiceFooter={invoiceFooter} setInvoiceFooter={setInvoiceFooter}
                invoiceTerms={invoiceTerms} setInvoiceTerms={setInvoiceTerms}
                settingsSuccess={settingsSuccess} handleSaveStoreSettings={handleSaveStoreSettings}
              />
            )}

            {activeTab === 'customer-queries' && (
              <QueriesTab queries={queries} loading={loading} handleDeleteQuery={handleDeleteQuery} />
            )}
          </AnimatePresence>
        </div>
      </div>

      <EditProductModal
        editingProduct={editingProduct} setEditingProduct={setEditingProduct}
        categories={categories} families={families} genders={genders} occasionList={occasionList}
        editProductName={editProductName} setEditProductName={setEditProductName}
        editProductBrand={editProductBrand} setEditProductBrand={setEditProductBrand}
        editProductCategory={editProductCategory} setEditProductCategory={setEditProductCategory}
        editProductPrice={editProductPrice} setEditProductPrice={setEditProductPrice}
        editProductStock={editProductStock} setEditProductStock={setEditProductStock}
        editProductDescription={editProductDescription} setEditProductDescription={setEditProductDescription}
        editProductImage={editProductImage}
        editTopNotesText={editTopNotesText} setEditTopNotesText={setEditTopNotesText}
        editMiddleNotesText={editMiddleNotesText} setEditMiddleNotesText={setEditMiddleNotesText}
        editBaseNotesText={editBaseNotesText} setEditBaseNotesText={setEditBaseNotesText}
        editPerfumeFamily={editPerfumeFamily} setEditPerfumeFamily={setEditPerfumeFamily}
        editPerfumeGender={editPerfumeGender} setEditPerfumeGender={setEditPerfumeGender}
        editPerfumeOccasions={editPerfumeOccasions} handleEditOccasionToggle={handleEditOccasionToggle}
        editUploading={editUploading} handleEditImageUpload={handleEditImageUpload}
        editFormError={editFormError} handleUpdateProductSubmit={handleUpdateProductSubmit}
      />
    </div>
  );
};

export default AdminDashboard;