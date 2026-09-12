/**
 * Lightweight scroll-in wrapper. Content is fully visible at rest — the
 * animation only adds a gentle rise on first mount, so nothing is ever
 * parked invisible waiting on an observer.
 */
export default function Reveal({ children, delay = 0, className = "" }) {
  return (
    <div
      className={`animate-fade-up ${className}`}
      style={{ animationDelay: `${delay * 1000}ms` }}
    >
      {children}
    </div>
  );
}
