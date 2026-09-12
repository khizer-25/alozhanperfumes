import { useState } from "react";
import { Plus, X, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import useSettings from "../hooks/useSettings";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=919100085698&text=Hello%2C+I%27m+interested+in+Al+Ozhan+Perfumes.+Could+you+share+your+collection+and+prices%3F&type=phone_number&app_absent=0";

export default function FloatingContactButtons() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={20} />
          </a>
          <a
            href={`tel:${settings.supportPhone}`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-alabaster shadow-lift transition-transform hover:scale-105"
            aria-label="Call"
          >
            <Phone size={18} strokeWidth={1.6} />
          </a>
        </>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white shadow-lift transition-transform hover:scale-105"
        aria-label={open ? "Close contact options" : "Contact us"}
      >
        {open ? <X size={20} /> : <Plus size={20} />}
      </button>
    </div>
  );
}
