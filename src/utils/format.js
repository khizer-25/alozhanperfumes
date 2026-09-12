const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Format a rupee amount, e.g. 4680 -> "₹4,680". */
export const formatPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return inr.format(n);
};

/** "12 Mar 2026" */
export const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const titleCase = (s = "") =>
  s.replace(/\b\w/g, (c) => c.toUpperCase());
