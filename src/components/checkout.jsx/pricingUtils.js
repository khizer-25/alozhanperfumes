// Shared pricing helpers used across the checkout flow
// All prices are treated as being in Indian Rupees (INR) already —
// no currency conversion is applied anywhere in the checkout flow.

// Helper to parse price string or number
export const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    return parseFloat(price.replace(/[^0-9.-]+/g, '')) || 0;
  }
  return 0;
};

export const formatINR = (amountINR) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amountINR);
};
