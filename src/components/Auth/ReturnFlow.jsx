import { useState } from "react";
import { api } from "../../utils/api";
import { formatPrice, formatDate, titleCase } from "../../utils/format";

const REASONS = [
  { value: "changed_mind", label: "Changed my mind" },
  { value: "not_as_described", label: "Not as described" },
  { value: "arrived_damaged", label: "Arrived damaged" },
  { value: "wrong_item", label: "Wrong item sent" },
  { value: "allergic_reaction", label: "Reaction / didn't suit me" },
  { value: "other", label: "Other" },
];

const RETURN_STATUS_STYLES = {
  requested: "bg-[#efe9dd] text-muted",
  approved: "bg-[#e8eef0] text-[#3d5a63]",
  received: "bg-[#eae6f0] text-[#4b3f66]",
  refunded: "bg-[#e6efe6] text-[#3c5a3c]",
  rejected: "bg-[#f2e4e2] text-[#7a3b34]",
  cancelled: "bg-[#efe9dd] text-muted",
};

export default function ReturnFlow({ order, existingReturn, returnWindowDays = 7, onDone }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(() =>
    order.items.map((it) => ({ orderItemId: it._id, name: it.name, max: it.qty, selected: false, qty: it.qty }))
  );
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (existingReturn) {
    return (
      <div className="border-t border-line px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.14em]">
          <span className="text-muted">
            Return {existingReturn.reference}
          </span>
          <span
            className={`px-2 py-0.5 font-medium ${
              RETURN_STATUS_STYLES[existingReturn.status] || "bg-[#efe9dd] text-muted"
            }`}
          >
            {titleCase(existingReturn.status)}
          </span>
        </div>
        {existingReturn.status === "refunded" && existingReturn.refundAmount != null && (
          <p className="mt-1 text-xs font-light text-muted">
            {formatPrice(existingReturn.refundAmount)} refunded
            {existingReturn.refundedAt ? ` on ${formatDate(existingReturn.refundedAt)}` : ""}
            {existingReturn.refundReference ? ` · ref ${existingReturn.refundReference}` : ""}
          </p>
        )}
        {existingReturn.adminNote && (
          <p className="mt-1 text-xs font-light text-muted">{existingReturn.adminNote}</p>
        )}
        {existingReturn.status === "requested" && (
          <button
            onClick={async () => {
              await api.patch(`/returns/${existingReturn._id}/cancel`);
              onDone?.();
            }}
            className="mt-2 text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
          >
            Withdraw request
          </button>
        )}
      </div>
    );
  }

  const deliveredAt = order.deliveredAt ? new Date(order.deliveredAt) : null;
  const withinWindow =
    deliveredAt &&
    Date.now() - deliveredAt.getTime() <= returnWindowDays * 864e5;

  if (order.status !== "delivered") return null;
  if (!withinWindow) {
    return (
      <div className="border-t border-line px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-muted">
        Return window closed
      </div>
    );
  }

  const submit = async () => {
    setError("");
    const chosen = lines.filter((l) => l.selected);
    if (chosen.length === 0) return setError("Select at least one item.");
    if (!reason) return setError("Choose a reason.");
    setBusy(true);
    try {
      await api.post("/returns", {
        orderId: order._id,
        reason,
        comment,
        items: chosen.map((l) => ({ orderItemId: l.orderItemId, qty: l.qty })),
      });
      setOpen(false);
      onDone?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-t border-line px-4 py-3">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
        >
          Request a return
        </button>
      ) : (
        <div className="space-y-3">
          <p className="label mb-0">Which items?</p>
          <div className="space-y-2">
            {lines.map((l, i) => (
              <label key={l.orderItemId} className="flex items-center gap-3 text-sm font-light">
                <input
                  type="checkbox"
                  checked={l.selected}
                  onChange={(e) =>
                    setLines((prev) =>
                      prev.map((x, j) => (j === i ? { ...x, selected: e.target.checked } : x))
                    )
                  }
                  className="accent-[color:var(--gold)]"
                />
                <span className="flex-1">{l.name}</span>
                {l.selected && l.max > 1 && (
                  <select
                    value={l.qty}
                    onChange={(e) =>
                      setLines((prev) =>
                        prev.map((x, j) => (j === i ? { ...x, qty: Number(e.target.value) } : x))
                      )
                    }
                    className="border border-line bg-paper px-2 py-1 text-xs"
                  >
                    {Array.from({ length: l.max }, (_, n) => n + 1).map((n) => (
                      <option key={n} value={n}>
                        Qty {n}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            ))}
          </div>

          <div>
            <p className="label">Reason</p>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="field"
            >
              <option value="">Select a reason…</option>
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything else we should know? (optional)"
            className="field min-h-[70px] resize-y text-sm"
          />

          {error && <p className="text-xs text-red-700">{error}</p>}

          <div className="flex gap-2">
            <button disabled={busy} onClick={submit} className="btn-primary px-6 py-3">
              {busy ? "Submitting…" : "Submit request"}
            </button>
            <button onClick={() => setOpen(false)} className="btn-outline px-6 py-3">
              Cancel
            </button>
          </div>
          <p className="text-[11px] font-light text-muted">
            Opened items can only be returned if faulty. We'll email you the next steps.
          </p>
        </div>
      )}
    </div>
  );
}
