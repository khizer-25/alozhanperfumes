import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, MessageSquare, ShoppingBag, ArrowRight } from "lucide-react";
import { api } from "../utils/api";

function Chatbot({ isOpen, onClose, onAddToCart }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Welcome to Al Özhan Parfums. I am your personal Atelier AI Scent Assistant. How can I help you find your signature fragrance today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const starterQuestions = [
    "Suggest a woody fragrance for winter",
    "Do you have fresh unisex perfumes?",
    "Recommend something for a wedding",
    "What are your best floral scents?",
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend.trim();
    if (!query) return;

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: query },
    ]);
    setInputText("");
    setIsLoading(true);

    try {
      // Fetch answer from RAG endpoint
      const response = await api.get(`/rag/chat?query=${encodeURIComponent(query)}`);
      
      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: response.answer || "I could not find a specific recommendation. Please try asking in a different way.",
          products: response.products || [],
        },
      ]);
    } catch (error) {
      console.error("Chatbot query failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "I am having trouble connecting to the Atelier archives. Please ensure the server is online and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      handleSendMessage(inputText);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] z-[95] bg-[#16110e]/95 backdrop-blur-lg border border-[#d4af37]/30 text-[#f7f5f2] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),_0_0_30px_rgba(212,175,55,0.05)] flex flex-col overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="p-4 bg-[#1f1814] border-b border-[#d4af37]/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-sm tracking-wide text-white leading-tight">
                  Atelier AI Assistant
                </h3>
                <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold">
                  Online Scent Curator
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#d4af37] text-black font-semibold rounded-tr-none"
                      : "bg-[#211a15] border border-stone-850 text-stone-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Recommended Products (if any) */}
                {msg.sender === "bot" && msg.products && msg.products.length > 0 && (
                  <div className="w-full mt-3 pl-3 border-l border-[#d4af37]/30 space-y-2.5">
                    <span className="text-[9px] uppercase tracking-wider text-[#d4af37] font-bold block mb-1">
                      Curated Recommendations:
                    </span>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800">
                      {msg.products.map((prod) => (
                        <div
                          key={prod._id}
                          className="min-w-[200px] max-w-[200px] bg-[#1e1713] border border-[#d4af37]/15 rounded-md p-2.5 flex flex-col justify-between space-y-2 shrink-0 group hover:border-[#d4af37]/45 transition-colors"
                        >
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold block">
                              {prod.brand}
                            </span>
                            <h4 className="font-serif text-xs font-semibold text-white truncate mt-0.5">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[9px] text-amber-700 font-bold">
                                {prod.family}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-stone-600" />
                              <span className="text-[9px] text-stone-400">
                                {prod.gender}
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-400 line-clamp-2 font-light mt-1.5">
                              {prod.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-1 border-t border-stone-850">
                            <span className="font-mono text-xs font-bold text-[#d4af37]">
                              ${prod.price}
                            </span>
                            <button
                              onClick={() => onAddToCart(prod)}
                              className="flex items-center gap-1 bg-[#d4af37]/10 hover:bg-[#d4af37] text-[#d4af37] hover:text-black border border-[#d4af37]/20 hover:border-[#d4af37] text-[9px] font-bold uppercase py-1 px-2 rounded-xs transition-all cursor-pointer"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-[#211a15] border border-stone-850 rounded-2xl rounded-tl-none p-3 text-xs flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" />
                </div>
              </div>
            )}

            {/* Starter Questions (shown initially or when messages has only welcome message) */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 pt-2">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block mb-1">
                  Suggested Enquiries:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {starterQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-left bg-[#1f1814] hover:bg-[#d4af37]/10 text-stone-300 hover:text-[#d4af37] border border-[#d4af37]/10 hover:border-[#d4af37]/35 rounded-lg py-2 px-3 text-[11px] font-medium transition-all duration-300 flex items-center justify-between group cursor-pointer"
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#1a1512] border-t border-[#d4af37]/20 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about notes, brands, categories..."
              disabled={isLoading}
              className="flex-grow bg-[#211a15] border border-[#d4af37]/20 focus:border-[#d4af37] focus:bg-[#26201c] rounded-md px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-9 h-9 rounded-md bg-[#d4af37] hover:bg-[#c39e2e] disabled:bg-stone-800 text-black disabled:text-stone-500 flex items-center justify-center transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Chatbot;
