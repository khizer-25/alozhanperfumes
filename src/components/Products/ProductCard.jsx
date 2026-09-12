import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/format";
import Stars from "../common/Stars";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const cheapest =
    product.variants.find((v) => v.effectivePrice === product.startingPrice) ||
    product.variants[0];
  const onSale = cheapest?.onSale;

  const quickAdd = (e) => {
    e.preventDefault();
    if (!cheapest || !cheapest.inStock) {
      navigate(`/products/${product.slug}`);
      return;
    }
    addItem(product, cheapest, 1);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#efe9dd]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-0 top-4 flex flex-col gap-1.5">
          {onSale && (
            <span className="bg-ink px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-alabaster">
              Offer
            </span>
          )}
          {!product.inStock && (
            <span className="bg-alabaster px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-muted">
              Sold out
            </span>
          )}
        </div>
        <button
          onClick={quickAdd}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/95 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.2em] text-alabaster transition-transform duration-300 group-hover:translate-y-0"
        >
          {product.inStock ? "Add to bag" : "View"}
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col items-center text-center">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
          {product.type === "attar" ? "Attar" : product.family || "Eau de Parfum"}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-tight text-ink">{product.name}</h3>
        {product.tagline && (
          <p className="mt-1 text-xs font-light text-muted line-clamp-1">{product.tagline}</p>
        )}
        <div className="mt-2">
          <Stars value={product.rating} count={product.reviewCount} showValue />
        </div>
        <p className="mt-2 text-sm text-ink">
          {onSale && (
            <span className="mr-2 text-muted line-through">
              {formatPrice(cheapest.price)}
            </span>
          )}
          <span>From {formatPrice(product.startingPrice)}</span>
        </p>
      </div>
    </Link>
  );
}
