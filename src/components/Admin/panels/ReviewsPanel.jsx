import { useEffect, useState, useCallback } from "react";
import { Check, X, Trash2, CornerDownRight } from "lucide-react";
import { api } from "../../../utils/api";
import { formatDate } from "../../../utils/format";
import { PanelHeader, EmptyState, StatusPill } from "../ui";
import Stars from "../../common/Stars";

const FILTERS = ["", "pending", "approved", "rejected"];

export default function ReviewsPanel({ notify }) {
  const [reviews, setReviews] = useState([]);
  const [state, setState] = useState("loading");
  const [filter, setFilter] = useState("pending");
  const [replyFor, setReplyFor] = useState(null);
  const [replyText, setReplyText] = useState("");

  const load = useCallback(() => {
    setState("loading");
    const qs = filter ? `?status=${filter}` : "";
    api
      .get(`/reviews${qs}`)
      .then((res) => {
        setReviews(res.data);
        setState("done");
      })
      .catch(() => setState("error"));
  }, [filter]);

  useEffect(load, [load]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/reviews/${id}`, { status });
      notify(`Review ${status}`);
      load();
    } catch (e) {
      notify(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      notify("Review deleted");
      load();
    } catch (e) {
      notify(e.message);
    }
  };

  const sendReply = async (id) => {
    try {
      await api.patch(`/reviews/${id}`, { adminReply: replyText });
      notify("Reply posted");
      setReplyFor(null);
      setReplyText("");
      load();
    } catch (e) {
      notify(e.message);
    }
  };

  return (
    <>
      <PanelHeader title="Reviews" subtitle={`${reviews.length} shown`} />

      <div className="mb-5 flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f || "all"}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${
              filter === f ? "bg-ink text-alabaster" : "border border-line text-muted"
            }`}
          >
            {f || "All"}
          </button>
        ))}
      </div>

      {state === "loading" && <EmptyState>Loading reviews…</EmptyState>}
      {state === "error" && <EmptyState>Couldn't load reviews.</EmptyState>}
      {state === "done" && reviews.length === 0 && <EmptyState>Nothing here.</EmptyState>}

      {state === "done" && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <Stars value={r.rating} />
                    <StatusPill status={r.status} />
                  </div>
                  <p className="mt-2 text-sm">
                    {r.title && <span className="font-serif text-base">{r.title} · </span>}
                    <span className="font-light text-muted">
                      {r.name} on {r.product?.name || "a product"}
                    </span>
                  </p>
                  <p className="mt-2 text-sm font-light leading-relaxed text-ink">{r.comment}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                    {formatDate(r.createdAt)}
                  </p>
                  {r.adminReply && (
                    <p className="mt-2 flex items-start gap-1.5 border-l-2 border-gold pl-2 text-sm font-light text-muted">
                      <CornerDownRight size={13} className="mt-0.5" /> {r.adminReply}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  {r.status !== "approved" && (
                    <button
                      onClick={() => setStatus(r._id, "approved")}
                      className="p-2 text-muted hover:text-[#3c5a3c]"
                      aria-label="Approve"
                    >
                      <Check size={15} />
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      onClick={() => setStatus(r._id, "rejected")}
                      className="p-2 text-muted hover:text-[#7a3b34]"
                      aria-label="Reject"
                    >
                      <X size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => remove(r._id)}
                    className="p-2 text-muted hover:text-ink"
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {replyFor === r._id ? (
                <div className="mt-3 flex gap-2">
                  <input
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Public reply…"
                    className="field"
                  />
                  <button onClick={() => sendReply(r._id)} className="btn-primary px-4 py-2">
                    Post
                  </button>
                  <button onClick={() => setReplyFor(null)} className="btn-outline px-4 py-2">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setReplyFor(r._id);
                    setReplyText(r.adminReply || "");
                  }}
                  className="mt-3 text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
                >
                  {r.adminReply ? "Edit reply" : "Reply publicly"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
