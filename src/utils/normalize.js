/**
 * Maps a raw backend product document to the shape the storefront renders.
 * The API model uses images[], variants[], type, gender, ratings — this
 * flattens the parts the UI needs while keeping the variants intact.
 */

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1000&q=80";

export const normalizeVariant = (v) => ({
  id: v._id,
  size: v.size,
  unit: v.unit || "ml",
  label: `${v.size} ${v.unit || "ml"}`,
  price: v.price,
  discountPrice: v.discountPrice ?? null,
  effectivePrice: v.discountPrice ?? v.price,
  onSale: v.discountPrice != null && v.discountPrice < v.price,
  stock: v.stock ?? 0,
  inStock: (v.stock ?? 0) > 0 && v.isActive !== false,
  isActive: v.isActive !== false,
});

export const normalizeProduct = (p) => {
  if (!p) return null;
  const images =
    Array.isArray(p.images) && p.images.length
      ? p.images.map((i) => i.url).filter(Boolean)
      : [PLACEHOLDER];

  const variants = (p.variants || [])
    .map(normalizeVariant)
    .filter((v) => v.isActive);

  const activePrices = variants.map((v) => v.effectivePrice);
  const startingPrice =
    p.startingPrice ?? (activePrices.length ? Math.min(...activePrices) : null);

  const totalStock =
    p.totalStock ?? variants.reduce((s, v) => s + v.stock, 0);

  return {
    id: p._id,
    slug: p.slug,
    name: p.name,
    brand: p.brand || "Al Özhan",
    tagline: p.tagline || "",
    description: p.description || "",
    type: p.type, // "perfume" | "attar"
    gender: p.gender || "unisex",
    family: p.family || "",
    occasions: p.occasions || [],
    notes: {
      top: p.notes?.top || [],
      heart: p.notes?.heart || [],
      base: p.notes?.base || [],
    },
    image: images[0],
    images,
    variants,
    startingPrice,
    totalStock,
    inStock: totalStock > 0,
    rating: p.ratings?.average || 0,
    reviewCount: p.ratings?.count || 0,
    featured: !!p.featured,
    createdAt: p.createdAt,
  };
};

export const normalizeProducts = (list = []) => list.map(normalizeProduct);

export { PLACEHOLDER };
