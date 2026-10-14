import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

/**
 * "Find your scent" quiz: config from /api/quiz (edited in the admin), the
 * shopper's answers kept in this browser, and whether the dialog is open.
 *
 * stored = null                                   → never seen it (auto-open on the homepage)
 *        | { status: "skipped", at }               → don't ask again (they can still start it)
 *        | { status: "done", answers, at }         → show "Picked for you"
 */
const QuizContext = createContext(null);
const KEY = "alozhan_scent_quiz_v1";
const CONFIG_KEY = "alozhan_quiz_config_v1";

// Last quiz we saw, so repeat visitors get it instantly (refreshed in the background).
const readConfig = () => {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY) || "null");
  } catch {
    return null;
  }
};
const writeConfig = (v) => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(v));
  } catch {
    /* storage blocked */
  }
};

// Start downloading the quiz the moment this module loads — before React has
// rendered anything — so a first-time visitor isn't kept waiting for it.
const fetchQuiz = () => api.get("/quiz").then((res) => res.data);
let firstRequest = fetchQuiz().catch(() => null);

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
};
const write = (v) => {
  try {
    if (v) localStorage.setItem(KEY, JSON.stringify(v));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked — the quiz still works for this visit */
  }
};

export function QuizProvider({ children }) {
  const [quiz, setQuiz] = useState(readConfig);
  const [stored, setStored] = useState(read);
  const [isOpen, setOpen] = useState(false);

  const apply = (data) => {
    if (!data) return;
    setQuiz(data);
    writeConfig(data);
  };

  const reload = useCallback(() => {
    fetchQuiz().then(apply).catch(() => {});
  }, []);

  useEffect(() => {
    const req = firstRequest;
    firstRequest = null; // later mounts / saves fetch fresh
    (req || fetchQuiz().catch(() => null)).then((data) => {
      if (data) apply(data);
      else setQuiz((q) => q || { enabled: false, questions: [] });
    });
  }, []);

  const persist = (v) => {
    write(v);
    setStored(v);
  };

  const available = !!(quiz?.enabled && quiz.questions?.length);

  const openQuiz = useCallback(() => setOpen(true), []);
  const closeQuiz = useCallback(() => setOpen(false), []);
  const skip = useCallback(() => {
    if (!read()) persist({ status: "skipped", at: Date.now() });
    setOpen(false);
  }, []);
  const saveAnswers = useCallback((answers) => {
    persist({ status: "done", answers, at: Date.now() });
    setOpen(false);
  }, []);
  const clear = useCallback(() => persist({ status: "skipped", at: Date.now() }), []);

  return (
    <QuizContext.Provider value={{ quiz, available, stored, isOpen, openQuiz, closeQuiz, skip, saveAnswers, clear, reload }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
};
