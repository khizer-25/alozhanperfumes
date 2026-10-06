import { Link } from "react-router-dom";
import Seo from "./Seo";

export default function NotFound() {
  return (
    <div className="container-lux py-32 text-center">
      <Seo title="Page not found" noindex />
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl md:text-5xl">This page has evaporated</h1>
      <div className="rule mx-auto mt-5" />
      <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-muted">
        The link may be old, or the fragrance may no longer be in our library.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/products" className="btn-primary">
          Browse the collection
        </Link>
        <Link to="/" className="btn-outline">
          Home
        </Link>
      </div>
    </div>
  );
}
