import { Phone, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

function FloatingContactButtons() {
  const whatsappMessage =
    "Hello, I'm interested in Al Ozhan Perfumes. Could you share your collection and prices?";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 animate-pulse">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/919100085698?text=${encodeURIComponent(
          whatsappMessage
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl"
      >
        <FaWhatsapp
          size={28}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
      </a>

      {/* Call */}
      <a
        href="tel:+919100085698"
        aria-label="Call"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl"
      >
        <Phone
          size={24}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com/al_ozhan_perfumes"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl"
      >
        <Instagram
          size={24}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
      </a>
    </div>
  );
}

export default FloatingContactButtons;