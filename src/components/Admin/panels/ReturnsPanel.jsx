import { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "../../../utils/api";
import { formatPrice, formatDate, titleCase } from "../../../utils/format";
import { PanelHeader, StatusPill, EmptyState } from "../ui";

const FILTERS = ["requested", "approved", "received", "refunded", "rejected"];
const REFUND_METHODS = [
  { value: "original_payment", label: "Original payment method" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "store_credit", label: "Store credit" },
];

const REASON_LABELS = {
  changed_mind: "Changed mind",
  not_as_described: "Not as described",
  arrived_damaged: "Arrived damaged",
  wrong_item: "Wrong item",
  allergic_reaction: "Reaction / didn't suit",
  other: "Other",
};

function RefundForm({ ret, saving, onRefund }) {
  const [amount, setAmount] = useState(ret.refundAmount ?? ret.requestedRefund ?? "");
  const [method, setMethod] = useState("original_payment");
  const [reference, setReference] = useState("");
  const [restock, setRestock] = useState(true);
  return (
    <div className="space-y-2 border border-line bg-alabaster p-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] uppercase tracking-[0.14em] text-muted">
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full border border-line bg-paper px-2 py-1.5 text-sm text-ink"
          />
        </label>
        <label className="text-[10px] uppercase tracking-[0.14em] text-muted">
          Method
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 w-full border border-line bg-paper px-2 py-1.5 text-sm text-ink"
          >
            {REFUND_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <input
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder="Refund reference / UTR (optional)"
        className="w-full border border-line bg-paper px-2 py-1.5 text-sm"
      />
      <label className="flex items-center gap-2 text-xs font-light text-muted">
        <input
          type="checkbox"
          checked={restock}
          onChange={(e) => setRestock(e.target.checked)}
          className="accent-[color:var(--gold)]"
        />
        Return items to stock
      </label>
      <button
        disabled={saving || !amount}
        onClick={() =>
          onRefund({
            status: "refunded",
            refundAmount: Number(amount),
            refundMethod: method,
            refundReference: reference,
            restock,
          })
        }
        className="btn-primary px-5 py-2.5"
      >
        {saving ? "Processing…" : "Mark refunded & notify"}
      </button>
    </div>
  );
}

export default function ReturnsPanel({ notify }) {
  const [returns, setReturns] = useState([]);
  const [state, setState] = useState("loading");
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(() => {
    setState("loading");
    const qs = new URLSearchParams({ limit: "100" });
    if (filter) qs.set("status", filter);
    api
      .get(`/returns?${qs}`)
      .then((res) => {
        setReturns(res.data);
        setState("done");
      })
      .catch(() => setState("error"));
  }, [filter]);

  useEffect(load, [load]);

  const act = async (id, body) => {
    setSavingId(id);
    try {
      await api.patch(`/returns/${id}`, body);
      notify(body.status ? `Return marked ${body.status}` : "Return updated");
      load();
    } catch (e) {
      notify(e.message);
    } finally {
      setSavingId(null);
    }
  };

  const pending = returns.filter((r) =>
    ["requested", "approved", "received"].includes(r.status)
  ).length;

  return (
    <>
      <PanelHeader
        title="Returns"
        subtitle={`${returns.length} shown · ${pending} needing action`}
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${
            !filter ? "bg-ink text-alabaster" : "border border-line text-muted"
          }`}
        >
          All
        </button>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${
              filter === f ? "bg-ink text-alabaster" : "border border-line text-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {state === "loading" && <EmptyState>Loading returns…</EmptyState>}
      {state === "error" && <EmptyState>Couldn't load returns.</EmptyState>}
      {state === "done" && returns.length === 0 && <EmptyState>No returns here.</EmptyState>}

      {state === "done" && returns.length > 0 && (
        <div className="divide-y divide-line border border-line bg-paper">
          {returns.map((r) => (
            <div key={r._id}>
              <button
                onClick={() => setExpanded(expanded === r._id ? null : r._id)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 py-3.5 text-left hover:bg-alabaster md:grid-cols-[150px_1fr_130px_110px_90px_20px]"
              >
                <span className="text-sm">{r.reference}</span>
                <span className="hidden text-sm font-light text-muted md:block">
                  {r.user?.name} · {r.orderNumber}
                </span>
                <span className="hidden text-[11px] font-light text-muted md:block">
                  {REASON_LABELS[r.reason] || r.reason}
                </span>
                <span className="hidden md:block">
                  <StatusPill status={r.status} />
                </span>
                <span className="text-right text-sm tabular-nums">
                  {formatPrice(r.refundAmount ?? r.requestedRefund ?? 0)}
                </span>
                <ChevronDown
                  size={15}
                  className={`hidden justify-self-end text-muted transition-transform md:block ${
                    expanded === r._id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded === r._id && (
                <div className="border-t border-line bg-alabaster px-4 py-5">
                  <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                    <div className="text-sm font-light">
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                        Items to return
                      </p>
                      <ul className="mt-2 divide-y divide-line">
                        {r.items.map((it) => (
                          <li key={it._id} className="flex justify-between py-2">
                            <span>
                              {it.name}{" "}
                              <span className="text-[11px] text-muted">
                                {it.size}
                                {it.unit} · ×{it.qty}
                              </span>
                            </span>
                            <span className="tabular-nums">
                              {formatPrice(it.price * it.qty)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3">
                        <span className="text-muted">Reason: </span>
                        {REASON_LABELS[r.reason] || r.reason}
                      </p>
                      {r.comment && (
                        <p className="mt-1 text-muted">"{r.comment}"</p>
                      )}
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                        Opened {formatDate(r.createdAt)}
                      </p>

                      <div className="mt-4">
                        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                          Timeline
                        </p>
                        <ul className="mt-1 space-y-1 text-xs text-muted">
                          {r.timeline?.map((t, i) => (
                            <li key={i}>
                              {formatDate(t.at)} — {titleCase(t.status)}
                              {t.note ? ` · ${t.note}` : ""} ({t.by})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {r.status === "requested" && (
                        <div className="flex gap-2">
                          <button
                            disabled={savingId === r._id}
                            onClick={() => act(r._id, { status: "approved" })}
                            className="btn-primary px-5 py-2.5"
                          >
                            Approve
                          </button>
                          <button
                            disabled={savingId === r._id}
                            onClick={() =>
                              act(r._id, {
                                status: "rejected",
                                adminNote:
                                  window.prompt("Reason for rejecting (emailed to customer):") ||
                                  "",
                              })
                            }
                            className="btn-outline px-5 py-2.5"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {r.status === "approved" && (
                        <button
                          disabled={savingId === r._id}
                          onClick={() => act(r._id, { status: "received" })}
                          className="btn-primary px-5 py-2.5"
                        >
                          Mark items received
                        </button>
                      )}

                      {r.status === "received" && (
                        <RefundForm
                          ret={r}
                          saving={savingId === r._id}
                          onRefund={(body) => act(r._id, body)}
                        />
                      )}

                      {r.status === "refunded" && (
                        <div className="border border-line bg-paper p-3 text-sm font-light">
                          <p className="text-gold-deep">
                            {formatPrice(r.refundAmount)} refunded
                          </p>
                          <p className="text-muted">
                            {r.refundMethod} · {formatDate(r.refundedAt)}
                          </p>
                          {r.refundReference && (
                            <p className="text-muted">Ref: {r.refundReference}</p>
                          )}
                        </div>
                      )}

                      {r.status === "rejected" && r.adminNote && (
                        <p className="text-sm font-light text-muted">
                          Rejected: {r.adminNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
