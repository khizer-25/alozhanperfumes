import { Star } from "lucide-react";

export default function Stars({ value = 0, size = 12, showValue = false, count }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={i < full ? "fill-gold text-gold" : "text-line"}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-[11px] font-light text-muted">
          {value ? value.toFixed(1) : "New"}
          {count != null && count > 0 ? ` · ${count}` : ""}
        </span>
      )}
    </span>
  );
}
