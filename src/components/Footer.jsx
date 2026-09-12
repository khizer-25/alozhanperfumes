import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import useSettings from "../hooks/useSettings";

export default function Footer() {
  const settings = useSettings();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Shop",
      links: [
        { label: "All Fragrances", to: "/products" },
        { label: "Perfumes", to: "/products?type=perfume" },
        { label: "Attars", to: "/products?type=attar" },
        { label: "For Him", to: "/products?gender=men" },
        { label: "For Her", to: "/products?gender=women" },
      ],
    },
    {
      title: "Maison",
      links: [
        { label: "Our Story", to: "/#story" },
        { label: "The Atelier", to: "/#atelier" },
        { label: "Contact", to: "/contact" },
      ],
    },
    {
      title: "Care",
      links: [
        { label: "Contact", to: "/contact" },
        { label: "Shipping", to: "/legal/shipping" },
        { label: "Returns & Refunds", to: "/legal/returns" },
        { label: "My Account", to: "/account" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "/legal/privacy" },
        { label: "Terms of Service", to: "/legal/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-alabaster">
      <div className="container-lux grid gap-x-8 gap-y-12 py-16 sm:grid-cols-2 md:grid-cols-[1.5fr_repeat(4,1fr)] md:py-20">
        <div>
          <p className="font-serif text-2xl tracking-[0.24em]">AL ÖZHAN</p>
          <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-muted">
            {settings.tagline}
          </p>
          <div className="mt-6 flex gap-4 text-muted">
            {settings.social?.instagram && (
              <a href={settings.social.instagram} aria-label="Instagram" className="hover:text-ink">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
            )}
            {settings.social?.facebook && (
              <a href={settings.social.facebook} aria-label="Facebook" className="hover:text-ink">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
            )}
            {settings.social?.twitter && (
              <a href={settings.social.twitter} aria-label="Twitter" className="hover:text-ink">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
            )}
            {!settings.social?.instagram && (
              <span className="text-xs font-light">{settings.supportEmail}</span>
            )}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">
              {col.title}
            </h4>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm font-light text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-[10.5px] uppercase tracking-[0.18em] text-muted md:flex-row">
          <span>© {year} {settings.storeName}</span>
          <span>{settings.address}</span>
        </div>
      </div>
    </footer>
  );
}
