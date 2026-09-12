import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { api } from "../../utils/api";
import { formatDate } from "../../utils/format";
import Stars from "../common/Stars";
import { useAuth } from "../../context/AuthContext";

function ReviewForm({ productId, onDone }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!rating) return setErr("Please choose a rating.");
    if (comment.trim().length < 10) return setErr("Tell us a little more (10+ characters).");
    setBusy(true);
    try {
      const res = await api.post("/reviews", { product: productId, rating, title, comment });
      setMsg(res.message);
      setComment("");
      setTitle("");
      setRating(0);
      onDone?.();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  if (msg) return <p className="text-sm text-gold-deep">{msg}</p>;

  return (
    <form onSubmit={submit} className="space-y-4 border border-line bg-paper p-6">
      <p className="label mb-0">Write a review</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} stars`}
          >
            <Star
              size={20}
              className={n <= (hover || rating) ? "fill-gold text-gold" : "text-line"}
            />
          </button>
        ))}
      </div>
      <input
        className="field"
        placeholder="Headline (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="field min-h-[110px] resize-y"
        placeholder="How does it wear? When do you reach for it?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {err && <p className="text-xs text-red-700">{err}</p>}
      <button disabled={busy} className="btn-primary">
        {busy ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}

export default function ProductReviews({ productId }) {
  const { isAuthed } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = () => {
    api
      .get(`/reviews/product/${productId}`)
      .then((res) => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoaded(true));
  };

  useEffect(load, [productId]);

  return (
    <section className="border-t border-line pt-14">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">Worn & reviewed</p>
          <h2 className="mt-3 text-2xl">
            {reviews.length
              ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`
              : "No reviews yet"}
          </h2>
          {isAuthed ? (
            <div className="mt-6">
              <ReviewForm productId={productId} onDone={load} />
            </div>
          ) : (
            <p className="mt-4 text-sm font-light text-muted">
              <Link to="/login" className="link-underline text-ink">
                Sign in
              </Link>{" "}
              to leave a review.
            </p>
          )}
        </div>

        <div className="space-y-6">
          {loaded && reviews.length === 0 && (
            <p className="text-sm font-light text-muted">
              Be the first to describe how this one wears.
            </p>
          )}
          {reviews.map((r) => (
            <article key={r._id} className="border-b border-line pb-6">
              <div className="flex items-center justify-between">
                <Stars value={r.rating} />
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
                  {formatDate(r.createdAt)}
                </span>
              </div>
              {r.title && <h3 className="mt-3 text-lg">{r.title}</h3>}
              <p className="mt-2 text-sm font-light leading-relaxed text-muted">{r.comment}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted">
                — {r.name}
              </p>
              {r.adminReply && (
                <p className="mt-3 border-l-2 border-gold pl-3 text-sm font-light text-muted">
                  <span className="font-medium text-ink">Al Özhan:</span> {r.adminReply}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
