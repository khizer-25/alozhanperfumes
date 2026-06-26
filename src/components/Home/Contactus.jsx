import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch("https://alozhan-backend.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Transmission route failed.");
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: "Could not send message. Please verify setup configuration parameters." 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] px-4 pt-32 pb-16 flex flex-col items-center justify-center font-sans text-[#261c16]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mx-auto"
      >
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b38f44] mb-2 font-semibold">Direct Pipeline</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#261c16] mb-4">
            Contact House
          </h2>
          <div className="w-12 h-[1px] bg-[#b38f44] mx-auto mb-4" />
        </div>

        <AnimatePresence mode="wait">
          {status.success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#261c16] rounded-2xl p-8 text-center text-white shadow-xl"
            >
              <CheckCircle2 className="mx-auto text-[#d4af37] mb-4" size={48} strokeWidth={1} />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Sent Successfully</h3>
              <p className="text-stone-400 text-sm">Your mail has been sent directly to your inbox backend.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/60 border border-stone-200/60 rounded-3xl p-6 md:p-10 backdrop-blur-xl space-y-6">
              {status.error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{status.error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-600">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Alexander Mercer" className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none text-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-600">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="alexander@example.com" className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none text-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-600">Your Message</label>
                <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Write your thoughts here..." className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none text-sm resize-none" />
              </div>

              <button type="submit" disabled={status.loading} className="w-full flex items-center justify-center gap-2 bg-[#261c16] text-white py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#362720] transition-colors disabled:opacity-50">
                {status.loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Send Message</span><Send size={12} /></>}
              </button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ContactUs;