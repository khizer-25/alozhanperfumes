import { useEffect, useState, useCallback } from "react";
import { Check, Trash2, Mail } from "lucide-react";
import { api } from "../../../utils/api";
import { formatDate } from "../../../utils/format";
import { PanelHeader, EmptyState, StatusPill } from "../ui";

export default function MessagesPanel({ notify }) {
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState("loading");
  const [filter, setFilter] = useState("open");

  const load = useCallback(() => {
    setState("loading");
    const qs = filter ? `?status=${filter}` : "";
    api
      .get(`/queries${qs}`)
      .then((res) => {
        setMessages(res.data);
        setState("done");
      })
      .catch(() => setState("error"));
  }, [filter]);

  useEffect(load, [load]);

  const resolve = async (id) => {
    try {
      await api.patch(`/queries/${id}`, { status: "resolved" });
      notify("Marked resolved");
      load();
    } catch (e) {
      notify(e.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/queries/${id}`);
      notify("Message deleted");
      load();
    } catch (e) {
      notify(e.message);
    }
  };

  return (
    <>
      <PanelHeader title="Messages" subtitle={`${messages.length} shown`} />

      <div className="mb-5 flex gap-1.5">
        {["open", "resolved", ""].map((f) => (
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

      {state === "loading" && <EmptyState>Loading messages…</EmptyState>}
      {state === "error" && <EmptyState>Couldn't load messages.</EmptyState>}
      {state === "done" && messages.length === 0 && <EmptyState>No messages.</EmptyState>}

      {state === "done" && messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m._id} className="border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm">{m.subject || "General enquiry"}</p>
                    <StatusPill status={m.status} />
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                    {m.name} · {m.email}
                    {m.phone ? ` · ${m.phone}` : ""} · {formatDate(m.createdAt)}
                  </p>
                  <p className="mt-3 text-sm font-light leading-relaxed text-ink">{m.message}</p>
                </div>
                <div className="flex gap-1">
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your enquiry")}`}
                    className="p-2 text-muted hover:text-ink"
                    aria-label="Reply by email"
                  >
                    <Mail size={15} />
                  </a>
                  {m.status === "open" && (
                    <button
                      onClick={() => resolve(m._id)}
                      className="p-2 text-muted hover:text-[#3c5a3c]"
                      aria-label="Resolve"
                    >
                      <Check size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => remove(m._id)}
                    className="p-2 text-muted hover:text-ink"
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
