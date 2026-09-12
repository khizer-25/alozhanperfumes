/** Small shared building blocks for the admin studio. */
import { titleCase } from "../../utils/format";

export function PanelHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
      <div>
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm font-light text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <div className="border border-line bg-paper p-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-[11px] font-light text-muted">{hint}</p>}
    </div>
  );
}

const STATUS_TONE = {
  pending: "bg-[#efe9dd] text-muted",
  processing: "bg-[#e4edf0] text-[#3d5a63]",
  shipped: "bg-[#e9e4f2] text-[#4b3f66]",
  delivered: "bg-[#e4efe4] text-[#3c5a3c]",
  cancelled: "bg-[#f3e2e0] text-[#7a3b34]",
  refunded: "bg-[#e4efe4] text-[#3c5a3c]",
  requested: "bg-[#efe9dd] text-muted",
  received: "bg-[#e9e4f2] text-[#4b3f66]",
  open: "bg-[#e4edf0] text-[#3d5a63]",
  resolved: "bg-[#e4efe4] text-[#3c5a3c]",
  approved: "bg-[#e4efe4] text-[#3c5a3c]",
  rejected: "bg-[#f3e2e0] text-[#7a3b34]",
  paid: "bg-[#e4efe4] text-[#3c5a3c]",
  unpaid: "bg-[#efe9dd] text-muted",
  live: "bg-[#e4efe4] text-[#3c5a3c]",
  hidden: "bg-[#efe9dd] text-muted",
};

export function StatusPill({ status }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
        STATUS_TONE[status] || "bg-[#efe9dd] text-muted"
      }`}
    >
      {titleCase(status || "—")}
    </span>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="border border-line bg-paper py-16 text-center text-sm font-light text-muted">
      {children}
    </div>
  );
}

export function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 border border-ink bg-ink px-5 py-3 text-xs uppercase tracking-[0.16em] text-alabaster shadow-lift">
      {message}
    </div>
  );
}
