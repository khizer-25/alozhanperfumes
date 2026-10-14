import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { useQuiz } from "../context/QuizContext";

/**
 * The quiz dialog. Opens by itself once, on a shopper's first visit to the
 * homepage (if enabled in the admin), and any time from "Take the quiz".
 * Every step can be skipped — the quiz is always optional.
 */
export default function ScentQuiz() {
  const { quiz, available, stored, isOpen, openQuiz, skip, saveAnswers } = useQuiz();
  const { pathname } = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const firstOption = useRef(null);

  // First visit to the homepage → ask once, as soon as the quiz is known.
  useEffect(() => {
    if (pathname === "/" && available && !stored && !isOpen) openQuiz();
  }, [pathname, available, stored, isOpen, openQuiz]);

  // Fresh start each time it opens (pre-filled with any earlier answers).
  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setAnswers(stored?.status === "done" ? stored.answers || {} : {});
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, skip]);

  useEffect(() => {
    firstOption.current?.focus();
  }, [step, isOpen]);

  if (!available) return null;

  const questions = quiz.questions;
  const q = questions[step];
  const qid = q ? String(q._id) : "";
  const chosen = answers[qid] || [];
  const last = step === questions.length - 1;

  const next = (nextAnswers = answers) => {
    if (last) saveAnswers(nextAnswers);
    else setStep((s) => s + 1);
  };

  const pick = (oid) => {
    if (q.multiple) {
      setAnswers((a) => {
        const cur = a[qid] || [];
        return { ...a, [qid]: cur.includes(oid) ? cur.filter((x) => x !== oid) : [...cur, oid] };
      });
    } else {
      // Single choice: select and move on.
      const updated = { ...answers, [qid]: [oid] };
      setAnswers(updated);
      setTimeout(() => next(updated), 180);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && q && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={skip}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-title"
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto bg-alabaster px-6 pb-7 pt-8 shadow-lift sm:px-10 sm:pb-9"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button onClick={skip} aria-label="Close the quiz" className="absolute right-4 top-4 p-1 text-muted hover:text-ink">
              <X size={18} strokeWidth={1.5} />
            </button>

            {step === 0 && (
              <div className="mb-6 pr-6">
                <p className="eyebrow">{quiz.title}</p>
                {quiz.subtitle && <p className="mt-2 text-sm font-light text-muted">{quiz.subtitle}</p>}
              </div>
            )}

            {/* progress */}
            <div className="flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 bg-line">
                <div className="h-px bg-gold transition-all duration-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted tabular-nums">
                {step + 1} / {questions.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={qid}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <h2 id="quiz-title" className="mt-6 font-serif text-3xl leading-tight sm:text-[34px]">
                  {q.text}
                </h2>
                {q.help && <p className="mt-2 text-sm font-light text-muted">{q.help}</p>}

                <div
                  role={q.multiple ? "group" : "radiogroup"}
                  aria-labelledby="quiz-title"
                  className={`mt-6 grid gap-2.5 ${q.options.length > 4 ? "sm:grid-cols-2" : ""}`}
                >
                  {q.options.map((o, i) => {
                    const oid = String(o._id);
                    const on = chosen.includes(oid);
                    return (
                      <button
                        key={oid}
                        ref={i === 0 ? firstOption : undefined}
                        type="button"
                        role={q.multiple ? "checkbox" : "radio"}
                        aria-checked={on}
                        onClick={() => pick(oid)}
                        className={`flex items-center justify-between gap-3 border px-5 py-4 text-left text-sm transition-colors ${
                          on ? "border-ink bg-ink text-alabaster" : "border-line bg-paper hover:border-ink"
                        }`}
                      >
                        <span>{o.label}</span>
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center border ${q.multiple ? "" : "rounded-full"} ${
                            on ? "border-alabaster" : "border-line"
                          }`}
                        >
                          {on && <Check size={11} strokeWidth={2.5} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
                >
                  <ArrowLeft size={13} /> Back
                </button>
              ) : (
                <button onClick={skip} className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink">
                  Skip for now
                </button>
              )}
              {(q.multiple || chosen.length > 0 || last) && (
                <button onClick={() => next()} className="btn-primary px-8 py-3">
                  {last ? "Show my picks" : chosen.length ? "Next" : "Skip question"}
                </button>
              )}
              {!q.multiple && !chosen.length && !last && (
                <button onClick={() => next()} className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink">
                  Skip question
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
