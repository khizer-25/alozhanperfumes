import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { api } from "../../utils/api";
import { normalizeProducts } from "../../utils/normalize";
import { useQuiz } from "../../context/QuizContext";
import ProductCard from "../Products/ProductCard";
import Reveal from "../common/Reveal";

/**
 * Homepage block driven by the scent quiz:
 *  - answered → personal picks, with "Retake" and "Clear"
 *  - not answered → a slim invitation to take the quiz
 *  - quiz turned off in the admin → nothing
 */
export default function PickedForYou() {
  const { quiz, available, stored, openQuiz, clear } = useQuiz();
  const [products, setProducts] = useState([]);
  const [fallback, setFallback] = useState(null); // "no-match" | "no-preference" | null
  const [state, setState] = useState("idle");
  const ref = useRef(null);
  const answers = stored?.status === "done" ? stored.answers : null;

  useEffect(() => {
    if (!available || !answers) return;
    let alive = true;
    setState("loading");
    api
      .post("/quiz/recommend", { answers, limit: 8 })
      .then((res) => {
        if (!alive) return;
        setProducts(normalizeProducts(res.data));
        setFallback(res.fallback || null);
        setState("done");
        // Bring the picks into view right after finishing the quiz.
        if (stored?.at && Date.now() - stored.at < 4000) {
          ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      })
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, [available, JSON.stringify(answers)]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!available) return null;

  if (!answers) {
    return (
      <section className="border-b border-line bg-[#f1ece0]">
        <div className="container-lux flex flex-col items-center justify-between gap-4 py-8 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-4">
            <Sparkles size={20} strokeWidth={1.4} className="hidden shrink-0 text-gold md:block" />
            <div>
              <p className="font-serif text-xl md:text-2xl">Not sure where to begin?</p>
              <p className="mt-1 text-sm font-light text-muted">{quiz.subtitle}</p>
            </div>
          </div>
          <button onClick={openQuiz} className="btn-primary shrink-0 px-8 py-3.5">
            Take the scent quiz
          </button>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="picked-for-you" className="container-lux scroll-mt-28 py-20 md:py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your scent profile</p>
          <h2 className="mt-3 text-3xl md:text-4xl">
            {fallback ? "Our most-loved fragrances" : quiz.resultsTitle || "Picked for you"}
          </h2>
          <div className="rule mt-5" />
          {fallback === "no-match" && (
            <p className="mt-4 max-w-md text-sm font-light text-muted">
              We don't have an exact match for your answers yet, so here are the fragrances our customers love most.
            </p>
          )}
        </div>
        <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.16em]">
          <button onClick={openQuiz} className="link-underline">
            Retake the quiz
          </button>
          <button onClick={clear} className="text-muted hover:text-ink">
            Clear
          </button>
        </div>
      </Reveal>

      {state === "loading" && (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse bg-[#ece5d7]" />
          ))}
        </div>
      )}
      {state === "error" && <p className="mt-12 text-center text-sm text-muted">We couldn't load your picks just now.</p>}
      {state === "done" && products.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
