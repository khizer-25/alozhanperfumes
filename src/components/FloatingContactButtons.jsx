import { useState } from "react";
import {
  MessageSquareMore,
  Phone,
  Instagram,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

function FloatingContactButtons() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappMessage =
    "Hello, I'm interested in Al Ozhan Perfumes. Could you share your collection and prices?";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Contact Options */}
      <div
        className={`flex flex-col gap-3 transition-all duration-500 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-5 opacity-0"
        }`}
      >
        {/* WhatsApp */}
        <div className="group relative">
          <a
            href={`https://wa.me/919100085698?text=${encodeURIComponent(
              whatsappMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-xl transition-all duration-300 hover:scale-110"
          >
            <FaWhatsapp size={28} />
          </a>

          <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100">
            WhatsApp
          </span>
        </div>

        {/* Call */}
        <div className="group relative">
          <a
            href="tel:+919100085698"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Phone size={24} />
          </a>

          <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100">
            Call Us
          </span>
        </div>

        {/* Instagram */}
        <div className="group relative">
          <a
            href="https://instagram.com/al_ozhan_perfumes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Instagram size={24} />
          </a>

          <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100">
            Instagram
          </span>
        </div>
      </div>

      {/* Main Chat Button */}
     <div className="group relative">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className={`flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-2xl transition-all duration-500 hover:scale-110 ${
      isOpen ? "rotate-[360deg]" : "rotate-0"
    }`}
  >
    {isOpen ? (
      <X size={32} />
    ) : (
      <MessageSquareMore size={32} />
    )}
  </button>

  <span className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100">
    Contact Us
  </span>
</div>
    </div>
  );
}

export default FloatingContactButtons;