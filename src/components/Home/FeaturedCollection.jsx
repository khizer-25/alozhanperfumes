import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import { normalizeProducts } from "../../utils/normalize";
import ProductCard from "../Products/ProductCard";
import Reveal from "../common/Reveal";

export default function FeaturedCollection() {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let alive = true;
    api
      .get("/products?featured=true&limit=4")
      .then((res) => {
        if (!alive) return;
        const list = normalizeProducts(res.data);
        setProducts(list);
        setState(list.length ? "done" : "empty");
      })
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="container-lux py-20 md:py-28" id="collection">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow">The Signature Edit</p>
        <h2 className="mt-3 text-3xl md:text-4xl">Fragrances the house is known for</h2>
        <div className="rule mx-auto mt-5" />
        <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-muted">
          A rotating selection of our most-worn compositions — each blended in small
          batches and rested before it reaches you.
        </p>
      </Reveal>

      {state === "loading" && (
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-[#ece5d7]" />
              <div className="mx-auto mt-4 h-3 w-2/3 bg-[#ece5d7]" />
              <div className="mx-auto mt-2 h-3 w-1/3 bg-[#ece5d7]" />
            </div>
          ))}
        </div>
      )}

      {state === "error" && (
        <p className="mt-14 text-center text-sm text-muted">
          We couldn't load the collection just now. Please refresh.
        </p>
      )}

      {(state === "done" || state === "empty") && (
        <>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {state === "empty" && (
            <p className="mt-14 text-center text-sm text-muted">
              New compositions are being bottled. Check back soon.
            </p>
          )}
          <div className="mt-14 text-center">
            <Link to="/products" className="btn-outline">
              Explore all fragrances
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
