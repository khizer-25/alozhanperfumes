/**
 * Header icon set — drawn on one 24px grid with the same hairline stroke so the
 * wishlist, account and bag icons read as a matched family.
 */
const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

export function BagIcon({ className = "", ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      {/* tapered shopping bag with rope handles */}
      <path d="M5.2 8.25h13.6l-1.05 11.6a1.5 1.5 0 0 1-1.5 1.37H7.75a1.5 1.5 0 0 1-1.5-1.37L5.2 8.25Z" />
      <path d="M8.75 10.5V6.75a3.25 3.25 0 0 1 6.5 0v3.75" />
    </svg>
  );
}

/** Wishlist: a bookmark ribbon ("saved for later"). Filled when saved. */
export function WishlistIcon({ filled = false, className = "", ...props }) {
  return (
    <svg {...base} className={className} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M6.75 4.75A1.5 1.5 0 0 1 8.25 3.25h7.5a1.5 1.5 0 0 1 1.5 1.5v15.5L12 16.6l-5.25 3.65V4.75Z" />
    </svg>
  );
}

export function UserIcon({ className = "", ...props }) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="12" cy="8.25" r="3.75" />
      <path d="M4.75 20.25c.85-3.75 3.75-5.75 7.25-5.75s6.4 2 7.25 5.75" />
    </svg>
  );
}

/** Small count bubble for header icons. `light` = over the dark hero (inverted colours). */
export function CountBadge({ count, light = false }) {
  if (!count) return null;
  return (
    <span
      className={`pointer-events-none absolute -right-1.5 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-1 text-[9.5px] font-medium leading-none ring-2 ${
        light ? "bg-gold text-white ring-transparent" : "bg-ink text-alabaster ring-alabaster"
      }`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
