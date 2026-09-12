import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { api } from "../../utils/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState(token ? "verifying" : "missing");
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    api
      .get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => {
        setState("done");
        setMessage(res.message || "Your email address is confirmed.");
      })
      .catch((err) => {
        setState("error");
        setMessage(err.message || "This verification link is invalid or has expired.");
      });
  }, [token]);

  return (
    <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {state === "verifying" && (
        <>
          <p className="eyebrow animate-pulse">Al Özhan</p>
          <p className="mt-4 text-sm font-light text-muted">Confirming your email…</p>
        </>
      )}

      {state === "done" && (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white">
            <Check size={24} />
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl">Email confirmed</h1>
          <div className="rule mx-auto mt-4" />
          <p className="mt-5 max-w-sm text-sm font-light text-muted">{message}</p>
          <Link to="/account" className="mt-8 btn-primary">
            Go to my account
          </Link>
        </>
      )}

      {(state === "error" || state === "missing") && (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-muted">
            <X size={24} />
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl">Couldn't confirm your email</h1>
          <div className="rule mx-auto mt-4" />
          <p className="mt-5 max-w-sm text-sm font-light text-muted">
            {state === "missing"
              ? "This link is missing its token."
              : message}{" "}
            You can request a fresh link from your account.
          </p>
          <Link to="/account" className="mt-8 btn-outline">
            My account
          </Link>
        </>
      )}
    </div>
  );
}
