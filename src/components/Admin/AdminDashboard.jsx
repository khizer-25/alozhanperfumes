import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  RotateCcw,
  Package,
  Star,
  Users,
  MailOpen,
  Settings as SettingsIcon,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "./ui";

import OverviewPanel from "./panels/OverviewPanel";
import OrdersPanel from "./panels/OrdersPanel";
import ReturnsPanel from "./panels/ReturnsPanel";
import ProductsPanel from "./panels/ProductsPanel";
import ReviewsPanel from "./panels/ReviewsPanel";
import CustomersPanel from "./panels/CustomersPanel";
import MessagesPanel from "./panels/MessagesPanel";
import SettingsPanel from "./panels/SettingsPanel";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, Panel: OverviewPanel },
  { key: "orders", label: "Orders", icon: ShoppingBag, Panel: OrdersPanel },
  { key: "returns", label: "Returns", icon: RotateCcw, Panel: ReturnsPanel },
  { key: "products", label: "Catalogue", icon: Package, Panel: ProductsPanel },
  { key: "reviews", label: "Reviews", icon: Star, Panel: ReviewsPanel },
  { key: "customers", label: "Customers", icon: Users, Panel: CustomersPanel },
  { key: "messages", label: "Messages", icon: MailOpen, Panel: MessagesPanel },
  { key: "settings", label: "Settings", icon: SettingsIcon, Panel: SettingsPanel },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("overview");
  const [toast, setToast] = useState("");

  const notify = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2600);
  }, []);

  const ActivePanel = NAV.find((n) => n.key === active)?.Panel || OverviewPanel;

  return (
    <div className="flex min-h-screen bg-alabaster text-ink">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-paper md:flex">
        <div className="border-b border-line px-6 py-6">
          <p className="font-serif text-lg tracking-[0.24em]">AL ÖZHAN</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-gold">Studio</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const on = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-[12px] uppercase tracking-[0.14em] transition-colors ${
                  on ? "bg-ink text-alabaster" : "text-muted hover:bg-alabaster hover:text-ink"
                }`}
              >
                <Icon size={15} strokeWidth={1.6} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-line px-4 py-4 text-[11px]">
          <p className="truncate font-light text-muted">{user?.email}</p>
          <div className="mt-2 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1 uppercase tracking-[0.14em] text-muted hover:text-ink">
              Storefront <ArrowUpRight size={12} />
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1 uppercase tracking-[0.14em] text-gold-deep hover:text-ink"
            >
              <LogOut size={12} /> Exit
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="fixed inset-x-0 top-0 z-30 flex gap-1 overflow-x-auto border-b border-line bg-paper px-3 py-2 no-scrollbar md:hidden">
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`whitespace-nowrap px-3 py-2 text-[11px] uppercase tracking-[0.12em] ${
              active === item.key ? "bg-ink text-alabaster" : "text-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <main className="min-w-0 flex-1 px-5 pb-16 pt-20 md:px-10 md:pt-10">
        <ActivePanel notify={notify} />
      </main>

      <Toast message={toast} />
    </div>
  );
}
