import { WishlistIcon } from "./Icons";
import { useWishlist } from "../../context/WishlistContext";

/**
 * Wishlist (bookmark) toggle. `variant="icon"` floats on product images; `variant="button"`
 * sits beside "Add to bag" on the product page.
 */
export default function WishlistButton({ productId, productName = "this fragrance", variant = "icon", className = "" }) {
  const { has, toggle } = useWishlist();
  const saved = has(productId);

  const onClick = (e) => {
    e.preventDefault(); // cards are links
    e.stopPropagation();
    toggle(productId);
  };

  const label = saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={label}
        className={`flex items-center justify-center gap-2 border px-4 py-4 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
          saved ? "border-gold bg-gold/10 text-gold-deep" : "border-line text-ink hover:border-ink"
        } ${className}`}
      >
        <WishlistIcon width={16} height={16} filled={saved} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? "Saved to wishlist" : "Save to wishlist"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 shadow-sm backdrop-blur transition hover:scale-105 ${
        saved ? "text-gold-deep" : "text-ink"
      } ${className}`}
    >
      <WishlistIcon width={18} height={18} filled={saved} />
    </button>
  );
}
