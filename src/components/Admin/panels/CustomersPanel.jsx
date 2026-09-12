import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { api } from "../../../utils/api";
import { formatPrice, formatDate } from "../../../utils/format";
import { PanelHeader, EmptyState, StatusPill } from "../ui";

export default function CustomersPanel({ notify }) {
  const [customers, setCustomers] = useState([]);
  const [state, setState] = useState("loading");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setState("loading");
    const qs = new URLSearchParams({ role: "customer", withStats: "true", limit: "100" });
    if (search) qs.set("search", search);
    api
      .get(`/users?${qs.toString()}`)
      .then((res) => {
        setCustomers(res.data);
        setState("done");
      })
      .catch(() => setState("error"));
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const toggleActive = async (u) => {
    try {
      await api.patch(`/users/${u._id}/status`, { isActive: !u.isActive });
      notify(u.isActive ? "Customer disabled" : "Customer enabled");
      load();
    } catch (e) {
      notify(e.message);
    }
  };

  return (
    <>
      <PanelHeader title="Customers" subtitle={`${customers.length} shown`} />

      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email"
          className="w-full border border-line bg-paper py-2 pl-9 pr-3 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {state === "loading" && <EmptyState>Loading customers…</EmptyState>}
      {state === "error" && <EmptyState>Couldn't load customers.</EmptyState>}
      {state === "done" && customers.length === 0 && <EmptyState>No customers yet.</EmptyState>}

      {state === "done" && customers.length > 0 && (
        <div className="overflow-x-auto border border-line bg-paper">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[10px] uppercase tracking-[0.14em] text-muted">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium tabular-nums">Orders</th>
                <th className="px-4 py-3 font-medium tabular-nums">Spent</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3">
                    <p>{u.name}</p>
                    <p className="text-[11px] font-light text-muted">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 font-light text-muted">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 tabular-nums">{u.stats?.orders ?? 0}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(u.stats?.spent ?? 0)}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={u.isActive ? "live" : "hidden"} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleActive(u)}
                      className="text-[11px] uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
