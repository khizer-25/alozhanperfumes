import { useEffect, useRef, useState } from "react";

/**
 * Official "Continue with Google" button (Google Identity Services).
 *
 * Google returns a signed ID token ("credential") to onCredential; the backend
 * verifies it (POST /auth/google). Only the public client id lives here — no
 * secret, no redirect. Renders nothing when VITE_GOOGLE_CLIENT_ID is unset.
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GSI_SRC = "https://accounts.google.com/gsi/client";

let gsiPromise = null;
function loadGsi() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => {
        gsiPromise = null; // allow a retry on next mount
        reject(new Error("Google sign-in could not load"));
      };
      document.head.appendChild(script);
    });
  }
  return gsiPromise;
}

export const googleSignInEnabled = Boolean(CLIENT_ID);

export default function GoogleButton({ onCredential, onError, text = "continue_with" }) {
  const ref = useRef(null);
  const handler = useRef(onCredential);
  handler.current = onCredential;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let alive = true;
    loadGsi()
      .then(() => {
        if (!alive || !ref.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (res) => handler.current?.(res.credential),
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true,
          use_fedcm_for_prompt: true,
        });
        window.google.accounts.id.renderButton(ref.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text,
          logo_alignment: "center",
          width: Math.min(400, ref.current.offsetWidth || 320),
        });
      })
      .catch((err) => {
        if (!alive) return;
        setFailed(true);
        onError?.(err);
      });
    return () => {
      alive = false;
    };
    // text changes between sign-in / sign-up modes → re-render the button
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!CLIENT_ID) return null;
  if (failed) {
    return (
      <p className="text-center text-[11px] font-light text-muted">
        Google sign-in is unavailable right now.
      </p>
    );
  }
  return <div ref={ref} className="flex min-h-[44px] w-full justify-center" />;
}
