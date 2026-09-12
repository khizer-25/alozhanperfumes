import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { formatPrice, formatDate } from "../../../utils/format";
import { PanelHeader, StatCard, StatusPill, EmptyState } from "../ui";

function Sparkline({ data }) {
  const values = data.map((d) => d.revenue);
  const max = Math.max(...values, 1);
  const w = 560;
  const h = 120;
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map((d, i) => [i * step, h - (d.revenue / max) * (h - 12) - 6]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div className="border border-line bg-paper p-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
        Revenue · last {data.length} days
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" preserveAspectRatio="none">
        <path d={area} fill="rgba(154,123,79,0.12)" />
        <path d={line} fill="none" stroke="var(--gold)" strokeWidth="2" />
        {pts.length > 0 && (
          <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill="var(--gold)" />
        )}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.12em] text-muted">
        <span>{formatDate(data[0]?.date)}</span>
        <span>{formatDate(data[data.length - 1]?.date)}</span>
      </div>
    </div>
  );
}

export default function OverviewPanel() {
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    api
      .get("/analytics/overview?days=14")
      .then((res) => {
        setData(res.data);
        setState("done");
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "loading")
    return (
      <>
        <PanelHeader title="Overview" subtitle="Loading the latest numbers…" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse border border-line bg-paper" />
          ))}
        </div>
      </>
    );

  if (state === "error" || !data)
    return (
      <>
        <PanelHeader title="Overview" />
        <EmptyState>Couldn't load analytics.</EmptyState>
      </>
    );

  return (
    <>
      <PanelHeader
        title="Overview"
        subtitle="Store performance at a glance"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Net revenue"
          value={formatPrice(data.netRevenue ?? data.totalRevenue)}
          hint={
            data.totalRefunded
              ? `${formatPrice(data.totalRevenue)} paid − ${formatPrice(data.totalRefunded)} refunded`
              : `${data.paidOrders} paid orders`
          }
        />
        <StatCard label="Orders" value={data.totalOrders} hint={`${data.ordersByStatus.pending || 0} awaiting action`} />
        <StatCard label="Avg. order value" value={formatPrice(data.averageOrderValue)} />
        <StatCard
          label="Needs attention"
          value={(data.returnsPending || 0) + (data.pendingReviews || 0)}
          hint={`${data.returnsPending || 0} returns · ${data.pendingReviews || 0} reviews`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Sparkline data={data.revenueByDay} />

        <div className="border border-line bg-paper p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            Orders by status
          </p>
          <ul className="mt-4 space-y-2 text-sm font-light">
            {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
              <li key={s} className="flex items-center justify-between">
                <StatusPill status={s} />
                <span className="tabular-nums">{data.ordersByStatus[s] || 0}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-line bg-paper p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            Recent orders
          </p>
          {data.recentOrders.length === 0 ? (
            <p className="mt-4 text-sm font-light text-muted">No orders yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {data.recentOrders.map((o) => (
                <li key={o._id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p>{o.orderNumber}</p>
                    <p className="text-[11px] font-light text-muted">
                      {o.user?.name || o.shippingAddress?.fullName} · {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums">{formatPrice(o.totalPrice)}</p>
                    <StatusPill status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-line bg-paper p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            Low stock
          </p>
          {data.lowStock.length === 0 ? (
            <p className="mt-4 text-sm font-light text-muted">Everything's well stocked.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {data.lowStock.map((p, i) => (
                <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                  <span>
                    {p.name}{" "}
                    <span className="text-[11px] font-light text-muted">
                      {p.size}
                      {p.unit}
                    </span>
                  </span>
                  <span
                    className={`tabular-nums ${p.stock === 0 ? "text-[#7a3b34]" : "text-gold-deep"}`}
                  >
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {data.topProducts.length > 0 && (
        <div className="mt-6 border border-line bg-paper p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            Best sellers
          </p>
          <ul className="mt-3 divide-y divide-line">
            {data.topProducts.map((p) => (
              <li key={p._id} className="flex items-center justify-between py-2.5 text-sm">
                <span>{p.name}</span>
                <span className="text-[11px] font-light text-muted">
                  {p.units} sold · {formatPrice(p.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
