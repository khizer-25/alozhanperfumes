import { useEffect, useRef, useState } from "react";
import { MailCheck, ArrowRight } from "lucide-react";
import { api } from "../../utils/api";

const LENGTH = 6;
const RESEND_SECONDS = 60;

/**
 * "Verify your email" step shown after sign-up (or an unverified sign-in).
 * The email carries both a link and a 6-digit code; this screen takes the code.
 */
export default function VerifyOtp({ email, sendFailed = false, onVerified, onBack }) {
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [error, setError] = useState(
    sendFailed ? "Your account is created, but we couldn't send the verification email. Tap “Resend code” to try again." : ""
  );
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  // If the first email failed there's nothing to wait for — allow a resend at once.
  const [cooldown, setCooldown] = useState(sendFailed ? 0 : RESEND_SECONDS);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const code = digits.join("");

  const fill = (start, value) => {
    const chars = value.replace(/\D/g, "").slice(0, LENGTH - start).split("");
    if (!chars.length) return;
    setDigits((d) => {
      const next = [...d];
      chars.forEach((c, i) => (next[start + i] = c));
      return next;
    });
    inputs.current[Math.min(start + chars.length, LENGTH - 1)]?.focus();
  };

  const onKeyDown = (i) => (e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      setDigits((d) => d.map((v, j) => (j === i - 1 ? "" : v)));
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < LENGTH - 1) {
      inputs.current[i + 1]?.focus();
    }
  };

  const onChange = (i) => (e) => {
    const value = e.target.value;
    if (!value) {
      setDigits((d) => d.map((v, j) => (j === i ? "" : v)));
      return;
    }
    fill(i, value);
  };

  const onPaste = (i) => (e) => {
    e.preventDefault();
    fill(i, e.clipboardData.getData("text"));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (code.length !== LENGTH) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, code });
      onVerified(res.message || "Email verified. You can now sign in.", res.data);
    } catch (err) {
      setError(err.message || "That code didn't work. Please try again.");
      setDigits(Array(LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError("");
    setNotice("");
    try {
      await api.post("/auth/resend-verification", { email });
      setNotice("A new code is on its way — check your inbox and spam folder.");
      setDigits(Array(LENGTH).fill(""));
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err.message || "Couldn't resend the code. Please try again.");
      if (err?.status === 429) setCooldown(RESEND_SECONDS);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold text-gold-deep">
          <MailCheck size={20} />
        </div>
        <p className="mt-5 text-sm font-light leading-relaxed text-muted">
          We've emailed a 6-digit code to{" "}
          <span className="font-normal text-ink break-all">{email}</span>. Enter it below to
          create your account.
        </p>
        <p className="mt-4 w-full border-l-2 border-gold bg-[#f4efe4] px-4 py-3 text-left text-xs text-gold-deep">
          Check your Inbox or Spam folder.
        </p>
      </div>

      {error && (
        <p className="mt-5 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-5 border-l-2 border-gold bg-[#f4efe4] px-4 py-3 text-xs text-gold-deep">
          {notice}
        </p>
      )}

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div>
          <label className="label text-center">Verification code</label>
          <div className="mt-1 flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                value={d}
                onChange={onChange(i)}
                onKeyDown={onKeyDown(i)}
                onPaste={onPaste(i)}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={LENGTH}
                aria-label={`Digit ${i + 1}`}
                className="field h-12 w-11 px-0 text-center text-lg tracking-normal"
              />
            ))}
          </div>
        </div>

        <button disabled={busy || code.length !== LENGTH} className="w-full btn-primary py-4">
          {busy ? "Verifying…" : "Verify email"}
          {!busy && <ArrowRight size={14} />}
        </button>
      </form>

      <div className="mt-6 border-t border-line pt-5 text-center text-xs font-light text-muted">
        Didn't get it?{" "}
        {cooldown > 0 ? (
          <span>Resend in {cooldown}s</span>
        ) : (
          <button type="button" onClick={resend} className="link-underline text-ink">
            Resend code
          </button>
        )}
        <span className="mx-2">·</span>
        <button type="button" onClick={onBack} className="link-underline text-ink">
          Back to sign in
        </button>
      </div>
    </div>
  );
}
