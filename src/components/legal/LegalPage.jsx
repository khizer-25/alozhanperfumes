import { useParams, Navigate, Link } from "react-router-dom";
import useSettings from "../../hooks/useSettings";
import { formatPrice } from "../../utils/format";
import { LEGAL_PAGES } from "../../content/legal";

const LAST_UPDATED = "10 September 2026";

const RELATED = [
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "terms", label: "Terms of Service" },
  { slug: "returns", label: "Returns & Refunds" },
  { slug: "shipping", label: "Shipping Policy" },
];

export default function LegalPage() {
  const { slug } = useParams();
  const settings = useSettings();
  const page = LEGAL_PAGES[slug];

  if (!page) return <Navigate to="/" replace />;

  // Interpolate {tokens} in copy with real store values.
  const fill = (text) =>
    text
      .replaceAll("{storeName}", settings.storeName)
      .replaceAll("{supportEmail}", settings.supportEmail)
      .replaceAll("{supportPhone}", settings.supportPhone)
      .replaceAll("{address}", settings.address)
      .replaceAll("{returnWindowDays}", String(settings.returnWindowDays ?? 7))
      .replaceAll("{shippingFee}", formatPrice(settings.shippingFee ?? 0))
      .replaceAll(
        "{freeShippingThreshold}",
        formatPrice(settings.freeShippingThreshold ?? 0)
      );

  return (
    <div className="container-lux py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-4xl md:text-5xl">{page.title}</h1>
        <div className="rule mt-5" />
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-muted">
          Last updated {LAST_UPDATED}
        </p>

        <p className="mt-8 text-sm font-light leading-[1.9] text-muted">
          {fill(page.intro(settings))}
        </p>

        <div className="mt-10 space-y-10">
          {page.sections.map((section, i) => (
            <section key={section.heading}>
              <h2 className="text-xl md:text-2xl">
                <span className="mr-3 font-sans text-xs tracking-[0.16em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.body.map((line, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-sm font-light leading-[1.85] text-muted"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                    <span>{fill(line)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <p className="eyebrow">More policies</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {RELATED.filter((r) => r.slug !== slug).map((r) => (
              <Link
                key={r.slug}
                to={`/legal/${r.slug}`}
                className="text-sm font-light text-ink link-underline"
              >
                {r.label}
              </Link>
            ))}
            <Link to="/contact" className="text-sm font-light text-ink link-underline">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
