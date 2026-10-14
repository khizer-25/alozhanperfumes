import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { WishlistIcon } from "./common/Icons";
import { api } from "../utils/api";
import { normalizeProduct } from "../utils/normalize";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "./Products/ProductCard";
import Seo from "./common/Seo";

/** Saved products as a grid. Works signed in (account) and signed out (this browser). */
export function WishlistGrid() {
  const { isAuthed } = useAuth();
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch once per sign-in state; un-saving just filters the list below.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    const load = isAuthed
      ? api.get("/auth/me/wishlist").then((r) => r.data || [])
      : Promise.all(ids.map((id) => api.get(`/products/${id}`).then((r) => r.data).catch(() => null))).then((list) =>
          list.filter((p) => p && p.isActive !== false)
        );
    load
      .then((list) => alive && setProducts(list.map(normalizeProduct)))
      .catch(() => alive && setProducts([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [isAuthed]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => products.filter((p) => ids.includes(String(p.id))), [products, ids]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-[#ece5d7]" />
        ))}
      </div>
    );
  }

  if (!visible.length) {
    return (
      <div className="py-16 text-center">
        <WishlistIcon width={30} height={30} className="mx-auto text-gold" />
        <p className="mt-4 text-sm text-muted">Nothing saved yet. Tap the bookmark on any fragrance to keep it here.</p>
        <Link to="/products" className="mt-6 inline-block btn-outline">
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
      {visible.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

/** /wishlist — also reachable when signed out. */
export default function WishlistPage() {
  const { isAuthed } = useAuth();
  return (
    <div className="container-lux py-14 md:py-20">
      <Seo title="Wishlist" noindex />
      <header className="text-center">
        <p className="eyebrow">Saved for later</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Your wishlist</h1>
        <div className="rule mx-auto mt-4" />
        {!isAuthed && (
          <p className="mx-auto mt-5 max-w-md text-sm font-light text-muted">
            Saved on this device.{" "}
            <Link to="/login" className="text-gold-deep underline">
              Sign in
            </Link>{" "}
            to keep your wishlist on every device.
          </p>
        )}
      </header>
      <div className="mt-12">
        <WishlistGrid />
      </div>
    </div>
  );
}
