import { useState } from 'react';

// Dynamic checkout configurations (loaded from localStorage with standard fallbacks)
const DEFAULT_RULES = {
  isCodAvailable: false,
  minCodAmountINR: 500,
  freeDeliveryThresholdINR: 10000,
  defaultCheckoutStep: 2
};

export default function useCheckoutSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('checkoutSettings');
    if (saved) {
      try {
        return { ...DEFAULT_RULES, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Error loading checkout configurations:', e);
      }
    }
    return DEFAULT_RULES;
  });

  return [settings, setSettings];
}
