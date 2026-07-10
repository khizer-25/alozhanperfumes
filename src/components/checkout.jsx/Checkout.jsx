import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

import useCheckoutSettings from "./useCheckoutSettings";
import { parsePrice, formatINR } from "./pricingUtils";
import CheckoutHeader from "./CheckoutHeader";
import StepProgress from "./StepProgress";
import AddressStep from "./AddressStep";
import PaymentStep from "./PaymentStep";
import OrderSuccessStep from "./OrderSuccessStep";
import PaymentLoadingModal from "./PaymentLoadingModal";
import PriceDetailsModal from "./PriceDetailsModal";

const Checkout = ({ cartItems, clearCart, onUpdateQuantity, onRemoveItem, user }) => {
  const navigate = useNavigate();

  const [settings] = useCheckoutSettings();

  // Step state: Cart = 1, Address = 2, Payment = 3, Summary = 4
  const [step, setStep] = useState(() => settings.defaultCheckoutStep || 2);
  const [copiedId, setCopiedId] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online'); // 'Online' or 'COD'

  // Address details state
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  // Payment simulated state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Controls price details modal/drawer toggle on mobile bottom bar
  const [showPriceDetailsModal, setShowPriceDetailsModal] = useState(false);

  // Calculate pricing structures dynamically using Admin-configured thresholds
  // Cart item prices are already in Indian Rupees (INR) — no currency conversion applied
  const subtotalINR = cartItems.reduce(
    (acc, item) => acc + parsePrice(item.price) * item.quantity,
    0
  );

  const isFreeDelivery = subtotalINR >= (settings.freeDeliveryThresholdINR || 10000) || subtotalINR === 0;
  const deliveryChargesINR = isFreeDelivery ? 0 : 250;
  const totalAmountINR = subtotalINR + deliveryChargesINR;

  // Determine if COD is unlocked based on toggle AND minimum order thresholds
  const isCodUnlocked = settings.isCodAvailable && (totalAmountINR >= (settings.minCodAmountINR || 500));

  // Auto-fill form details with user details if available, but let them customize
  useEffect(() => {
    if (user) {
      setAddressForm(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: prev.phone || '9876543210'
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street ||
        !addressForm.city || !addressForm.state || !addressForm.postalCode) {
      setPaymentError('Please fill in all the required delivery details.');
      return;
    }
    setPaymentError('');
    setStep(3); // Proceed to Step 3 (Payment)
  };

  // Triggers mock Cashfree payment gateway flow or COD booking flow
  const handlePaymentSubmit = async () => {
    setPaymentLoading(true);
    setPaymentError('');

    if (paymentMethod === 'Online') {
      // Step 1: Initializing tunnel
      setPaymentPhase('Preparing your secure Cashfree checkout...');
      await new Promise(r => setTimeout(r, 1200));

      // Step 2: Authenticating credentials
      setPaymentPhase('Securing transaction with 256-bit encryption...');
      await new Promise(r => setTimeout(r, 1000));

      // Step 3: Verifying funds & submitting backend order
      setPaymentPhase('Verifying payment authorization with Cashfree...');
    } else {
      // COD Flow
      setPaymentPhase('Validating Cash on Delivery availability...');
      await new Promise(r => setTimeout(r, 1000));

      setPaymentPhase('Registering COD delivery coordinates...');
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      // Create backend model orderItems matching database expectations
      const orderItemsMapped = cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: parsePrice(item.price), // backend expects base price
        product: item._id
      }));

      // Submit order creation to backend
      const orderData = {
        orderItems: orderItemsMapped,
        shippingAddress: {
          address: addressForm.street,
          city: addressForm.city,
          postalCode: addressForm.postalCode,
          country: addressForm.country,
        },
        paymentMethod: paymentMethod === 'Online' ? 'Pay Online (Cashfree)' : 'cod',
        itemsPrice: subtotalINR,
        taxPrice: 0,
        shippingPrice: deliveryChargesINR,
        totalPrice: totalAmountINR
      };

      const createdOrder = await api.post('/orders', orderData);

      let finalOrder = createdOrder;

      if (paymentMethod === 'Online') {
        // Step 4: Finalizing database paid status for Online
        setPaymentPhase('Registering payment clearance in database...');
        finalOrder = await api.put(`/orders/${createdOrder._id}/pay`, {
          id: `CASHFREE-PAY-${Date.now()}`,
          status: 'COMPLETED'
        });
      } else {
        // Finalizing COD booking
        setPaymentPhase('Booking Cash on Delivery checkout...');
        await new Promise(r => setTimeout(r, 600));
      }

      // Clear local cart states
      clearCart();
      setPlacedOrder(finalOrder);

      // Complete transaction and go to Step 4: Summary
      await new Promise(r => setTimeout(r, 600));
      setStep(4);
    } catch (err) {
      setPaymentError(
        err.response?.data?.message ||
        err.message ||
        "Checkout failed"
      );
    } finally {
      setPaymentLoading(false);
      setPaymentPhase('');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Back button helper
  const handleBack = () => {
    if (step === 2) {
      navigate(-1); // Back to products/home
    } else if (step === 3) {
      setStep(2); // Back to Address
    }
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#362720] font-sans antialiased pb-24 relative">
      <CheckoutHeader step={step} cartItemCount={cartItemCount} onBack={handleBack} />

      <StepProgress step={step} />

      {/* --- MAIN INTERFACE CONTENT --- */}
      <div className="max-w-xl mx-auto px-4 py-6">

        {paymentError && (
          <div className="mb-4 p-4 bg-red-50/80 border-l-4 border-red-500 rounded-sm flex items-start gap-3 text-red-800 text-xs shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div className="font-medium">{paymentError}</div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 2 && (
            <AddressStep
              addressForm={addressForm}
              onInputChange={handleInputChange}
              onSubmit={handleAddressSubmit}
            />
          )}

          {step === 3 && (
            <PaymentStep
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              isCodUnlocked={isCodUnlocked}
              settings={settings}
              totalAmountINR={totalAmountINR}
              subtotalINR={subtotalINR}
              deliveryChargesINR={deliveryChargesINR}
              addressForm={addressForm}
              onEditAddress={() => setStep(2)}
              paymentLoading={paymentLoading}
              cartItemsLength={cartItems.length}
              onPaymentSubmit={handlePaymentSubmit}
              onShowPriceDetails={() => setShowPriceDetailsModal(true)}
            />
          )}

          {step === 4 && placedOrder && (
            <OrderSuccessStep
              placedOrder={placedOrder}
              copiedId={copiedId}
              onCopy={copyToClipboard}
              onTrackOrder={() => navigate('/profile')}
              onContinueShopping={() => navigate('/')}
            />
          )}
        </AnimatePresence>
      </div>

      <PriceDetailsModal
        show={showPriceDetailsModal}
        onClose={() => setShowPriceDetailsModal(false)}
        subtotalINR={subtotalINR}
        deliveryChargesINR={deliveryChargesINR}
        totalAmountINR={totalAmountINR}
      />

      <PaymentLoadingModal show={paymentLoading} paymentPhase={paymentPhase} />
    </div>
  );
};

export default Checkout;
