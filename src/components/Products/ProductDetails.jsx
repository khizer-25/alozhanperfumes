import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus, Truck, RotateCcw, Sparkles } from "lucide-react";
import { api } from "../../utils/api";
import { normalizeProduct } from "../../utils/normalize";
import { formatPrice } from "../../utils/format";
import Stars from "../common/Stars";
import { useCart } from "../../context/CartContext";
import useSettings from "../../hooks/useSettings";
import ProductReviews from "./ProductReviews";

function NotePyramid({ notes }) {
  const rows = [
    { label: "Top", items: notes.top },
    { label: "Heart", items: notes.heart },
    { label: "Base", items: notes.base },
  ].filter((r) => r.items.length);
  if (!rows.length) return null;
  return (
    <div className="mt-8 border-t border-line pt-8">
      <p className="eyebrow">The composition</p>
      <div className="mt-4 space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[64px_1fr] gap-4">
            <span className="pt-1 text-[11px] uppercase tracking-[0.16em] text-muted">
              {r.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {r.items.map((n) => (
                <span
                  key={n}
                  className="border border-line px-3 py-1.5 text-xs font-light text-ink"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const settings = useSettings();

  const [product, setProduct] = useState(null);
  const [state, setState] = useState("loading");
  const [variantId, setVariantId] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let alive = true;
    setState("loading");
    api
      .get(`/products/slug/${slug}`)
      .then((res) => {
        if (!alive) return;
        const p = normalizeProduct(res.data);
        setProduct(p);
        const firstInStock = p.variants.find((v) => v.inStock) || p.variants[0];
        setVariantId(firstInStock?.id || null);
        setState("done");
      })
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (state === "loading") {
    return (
      <div className="container-lux py-20">
        <div className="grid animate-pulse gap-12 md:grid-cols-2">
          <div className="aspect-[4/5] bg-[#ece5d7]" />
          <div className="space-y-4">
            <div className="h-4 w-1/3 bg-[#ece5d7]" />
            <div className="h-10 w-2/3 bg-[#ece5d7]" />
            <div className="h-24 bg-[#ece5d7]" />
          </div>
        </div>
      </div>
    );
  }

  if (state === "error" || !product) {
    return (
      <div className="container-lux py-32 text-center">
        <p className="text-sm text-muted">We couldn't find that fragrance.</p>
        <Link to="/products" className="mt-6 inline-block btn-outline">
          Back to the collection
        </Link>
      </div>
    );
  }

  const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
  const canBuy = variant && variant.inStock;

  const handleAdd = () => {
    if (!canBuy) return;
    addItem(product, variant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="container-lux py-10 md:py-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="mt-8 grid gap-12 md:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] overflow-hidden bg-[#efe9dd]">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square w-20 overflow-hidden border ${
                    i === activeImg ? "border-ink" : "border-line"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div>
          <p className="eyebrow">
            {product.type === "attar" ? "Concentrated attar" : "Eau de Parfum"}
            {product.family ? ` · ${product.family}` : ""}
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl">{product.name}</h1>
          {product.tagline && (
            <p className="mt-2 font-serif text-lg italic text-muted">{product.tagline}</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <Stars value={product.rating} count={product.reviewCount} showValue />
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
              {product.gender}
            </span>
          </div>

          <p className="mt-6 text-sm font-light leading-[1.9] text-muted">
            {product.description}
          </p>

          {/* Variant selector */}
          <div className="mt-8">
            <p className="label">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariantId(v.id);
                    setQty(1);
                  }}
                  disabled={!v.inStock}
                  className={`min-w-[92px] border px-4 py-3 text-left transition-colors ${
                    v.id === variantId
                      ? "border-ink bg-ink text-alabaster"
                      : "border-line hover:border-ink disabled:opacity-40"
                  }`}
                >
                  <span className="block text-sm">{v.label}</span>
                  <span className="block text-[11px] opacity-80">
                    {v.inStock ? formatPrice(v.effectivePrice) : "Sold out"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price + qty + add */}
          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div>
              {variant?.onSale && (
                <span className="mr-2 text-sm text-muted line-through">
                  {formatPrice(variant.price)}
                </span>
              )}
              <span className="font-serif text-3xl">
                {formatPrice(variant?.effectivePrice)}
              </span>
            </div>
            <div className="flex items-center border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-3 hover:bg-alabaster"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(variant?.stock || 9, q + 1))}
                className="px-3 py-3 hover:bg-alabaster"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!canBuy}
            className="mt-6 w-full btn-primary py-4"
          >
            {added ? (
              <>
                <Check size={15} /> Added to bag
              </>
            ) : canBuy ? (
              "Add to bag"
            ) : (
              "Sold out"
            )}
          </button>

          {variant?.inStock && variant.stock <= 5 && (
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-gold-deep">
              Only {variant.stock} left in {variant.label}
            </p>
          )}

          {/* Assurances */}
          <div className="mt-8 grid gap-3 border-t border-line pt-6 text-xs font-light text-muted">
            <p className="flex items-center gap-2">
              <Sparkles size={14} className="text-gold" /> Ships with three sample vials
            </p>
            <p className="flex items-center gap-2">
              <Truck size={14} className="text-gold" />
              {product.startingPrice != null &&
              settings.freeShippingThreshold
                ? `Free shipping over ${formatPrice(settings.freeShippingThreshold)}`
                : "Tracked shipping across India"}
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw size={14} className="text-gold" /> 7-day returns on unopened bottles
            </p>
          </div>

          <NotePyramid notes={product.notes} />

          {product.occasions.length > 0 && (
            <div className="mt-8 border-t border-line pt-8">
              <p className="eyebrow">Best worn</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.occasions.map((o) => (
                  <span key={o} className="bg-[#efe9dd] px-3 py-1.5 text-xs font-light">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
