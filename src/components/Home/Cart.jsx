import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, clearCart, user }) => {
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'shipping', 'success'
  
  // Shipping details form state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const navigate = useNavigate();

  // Helper to safely strip '$' and convert to floating number
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
    }
    return 0;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0
  );

  const tax = subtotal * 0.18; // 18% Tax / Custom duties
  const shipping = subtotal > 150 ? 0 : 15; // Free shipping over $150
  const grandTotal = subtotal + tax + shipping;

  const handleCheckoutClick = () => {
    setError('');
    onClose();
    if (!user) {
      // Redirect to login if not authenticated, keeping path history
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      // Proceed to checkout page
      navigate('/checkout');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping details.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create order items array matching database expectations
      const orderItemsMapped = cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: parsePrice(item.price),
        product: item._id // Use _id, fallback to mock objectID for security
      }));

      // 2. Submit order creation
      const orderData = {
        orderItems: orderItemsMapped,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: grandTotal
      };

      const createdOrder = await api.post('/orders', orderData);

      // 3. Mock payment gateway integration (mark as Paid immediately)
      const paidOrder = await api.put(`/orders/${createdOrder._id}/pay`, {
        id: `MOCK-PAY-${Date.now()}`,
        status: 'COMPLETED'
      });

      // 4. Save success status, clear global cart, go to Success Screen
      setPlacedOrder(paidOrder);
      setCheckoutStep('success');
      clearCart();

    } catch (err) {
      setError(err.message || 'Checkout failed. Verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  const cartVariants = {
    closed: { x: '100%', transition: { type: 'spring', stiffness: 400, damping: 40 } },
    opened: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Right Drawer Panel */}
          <motion.div
            variants={cartVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="fixed top-0 right-0 z-[110] h-screen w-full bg-[#26201c] border-l border-white/5 p-6 shadow-2xl sm:max-w-md flex flex-col justify-between font-sans antialiased text-white"
          >
            {/* Header section */}
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                  <h2 className="text-xl font-light tracking-widest uppercase">
                    {checkoutStep === 'cart' && 'Your Atelier Cart'}
                    {checkoutStep === 'shipping' && 'Atelier Checkout'}
                    {checkoutStep === 'success' && 'Purchase Completed'}
                  </h2>
                </div>
               <button 
  type="button"
  onClick={() => {
    onClose();
    setTimeout(() => setCheckoutStep('cart'), 300);
  }} 
  className="text-stone-400 hover:text-white hover:rotate-90 transition-transform duration-200"
>
  <X size={24} strokeWidth={1.5} />
</button>
              </div>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border-l-2 border-red-500 text-stone-200 text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Content Switcher */}
            <div className="flex-grow overflow-y-auto my-4 pr-1 custom-scrollbar">
              
              {/* STEP 1: CART DISPLAY */}
              {checkoutStep === 'cart' && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                      <ShoppingBag size={48} strokeWidth={1} className="mb-4 text-[#d4af37]" />
                      <p className="text-sm tracking-wider font-light uppercase">Your shopping bag is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex gap-4 p-3 bg-white/5 border border-white/5 rounded-sm relative"
                        >
                          <div className="w-20 h-24 overflow-hidden rounded-sm flex-shrink-0 bg-stone-900 border border-white/5">
                            {item.image.startsWith('http') ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          
                          <div className="flex flex-col justify-between flex-grow">
                            <div>
                              <h4 className="text-sm font-medium tracking-wide text-white pr-6">{item.name}</h4>
                              <p className="text-[10px] tracking-widest text-[#d4af37] uppercase">{item.category}</p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-white/10 rounded-sm bg-black/20">
                                <button 
  type="button"
  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
  className="p-1 px-2 hover:text-[#d4af37] text-stone-400 transition-colors"
>
  <Minus size={12} />
</button>
                                <span className="text-xs font-medium px-2 min-w-[20px] text-center">{item.quantity}</span>
                              <button 
  type="button"
  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
  className="p-1 px-2 hover:text-[#d4af37] text-stone-400 transition-colors"
>
  <Plus size={12} />
</button>
                              </div>

                              <p className="text-sm font-light text-stone-300 tracking-wider">
                                ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <button 
  type="button"
  onClick={() => onRemoveItem(item.id)}
  className="absolute top-3 right-3 text-stone-500 hover:text-red-400 transition-colors"
>
  <Trash2 size={14} />
</button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: SHIPPING DETAILS & PAYMENT FORM */}
              {checkoutStep === 'shipping' && (
                <form onSubmit={handlePlaceOrder} className="space-y-5 text-xs text-stone-300">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-[#d4af37] uppercase font-bold text-[10px] tracking-widest">
                    <MapPin className="w-3.5 h-3.5" />
                    Shipping Destination
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Delivery Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, apartment, suite..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-sm py-2.5 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">City</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-sm py-2.5 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Postal Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 400001"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-sm py-2.5 px-3 text-white focus:outline-none focus:border-[#d4af37] font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Country</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. India"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-sm py-2.5 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="flex items-center gap-2 border-b border-white/5 pb-2 pt-2 text-[#d4af37] uppercase font-bold text-[10px] tracking-widest">
                    <CreditCard className="w-3.5 h-3.5" />
                    Payment Configuration
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Gateway method</label>
                    <div className="grid grid-cols-2 gap-3 text-stone-300">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('PayPal')}
                        className={`py-3 px-4 border rounded-sm text-center font-bold tracking-wider transition-all uppercase ${
                          paymentMethod === 'PayPal'
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-white shadow-md'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        PayPal
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`py-3 px-4 border rounded-sm text-center font-bold tracking-wider transition-all uppercase ${
                          paymentMethod === 'Card'
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-white shadow-md'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        Card Gate
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 3: SUCCESS CONGRATULATIONS PANEL */}
              {checkoutStep === 'success' && placedOrder && (
                <div className="text-center py-10 space-y-6 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="w-16 h-16 text-[#d4af37]" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white tracking-wider uppercase">Order Placed Successfully!</h3>
                    <p className="text-xs text-stone-400 font-light max-w-xs mx-auto leading-relaxed">
                      Thank you for choosing Orvélia. Your transaction was processed, paid, and registered under reference ID:
                    </p>
                    <span className="inline-block bg-white/5 border border-white/10 rounded-sm py-1.5 px-3 font-mono text-[10px] text-[#d4af37] select-all mt-2">
                      {placedOrder._id}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-400 font-light italic max-w-xs mx-auto">
                    You can monitor delivery logistics, view pricing breakdowns, and trace your courier packages at any time under your Profile Account.
                  </p>

                 <button
  type="button"
  onClick={() => {
    onClose();
    setCheckoutStep('cart');
    navigate('/profile');
  }}
>
  Track In My Account
</button>
                </div>
              )}

            </div>

            {/* Bottom calculation blocks & actions */}
            {checkoutStep !== 'success' && (
              <div className="border-t border-white/10 pt-4 space-y-4 bg-[#26201c]">
                
                {/* Pricing Summaries (Calculated dynamically) */}
                <div className="space-y-1.5 text-xs text-stone-400">
                  <div className="flex justify-between items-center">
                    <span>Items Subtotal</span>
                    <span className="font-mono text-stone-200">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {checkoutStep === 'shipping' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span>GST & Packaging duties (18%)</span>
                        <span className="font-mono text-stone-200">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Courier Shipping fee</span>
                        <span className="font-mono text-stone-200">
                          {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between items-center border-t border-white/5 pt-2 text-sm">
                    <span className="text-stone-300 font-medium">Grand Est. Total</span>
                    <span className="text-xl font-light text-[#d4af37] tracking-widest font-mono">
                      ${checkoutStep === 'shipping' ? grandTotal.toFixed(2) : subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submissions button handles switcher */}
                {checkoutStep === 'cart' ? (
                <button 
  onClick={handleCheckoutClick}
  disabled={cartItems.length === 0}
>
  PROCEED TO CHECKOUT
</button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full py-4 bg-[#d4af37] text-black font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#a1811a] disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed transition-all duration-300 rounded-sm shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? 'Processing payment...' : `PAY & PLACE ORDER ($${grandTotal.toFixed(2)})`}
                  </button>
                )}
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;