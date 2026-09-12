import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "alozhan_cart_v2";

/**
 * A cart line is keyed by productId + variantId so the same perfume in two
 * sizes are separate lines.
 */
const lineKey = (productId, variantId) => `${productId}::${variantId}`;

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addItem = useCallback((product, variant, qty = 1) => {
    setItems((prev) => {
      const key = lineKey(product.id, variant.id);
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, qty: Math.min(i.qty + qty, variant.stock || 99) }
            : i
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          image: product.image,
          size: variant.size,
          unit: variant.unit,
          sizeLabel: variant.label,
          price: variant.effectivePrice,
          listPrice: variant.price,
          stock: variant.stock,
          qty: Math.min(qty, variant.stock || 99),
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) =>
            i.key === key ? { ...i, qty: Math.min(qty, i.stock || 99) } : i
          )
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.qty, 0),
    }),
    [items]
  );

  const value = {
    items,
    count,
    subtotal,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQty,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
