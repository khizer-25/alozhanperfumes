import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Flame, Shield, Droplets, Award } from 'lucide-react';

const SEPARATOR_ITEMS = [
  { text: 'ARTISANAL ESSENCES', icon: Sparkles },
  { text: '100% PURE AGED OUD', icon: Compass },
  { text: '12+ HOURS PROJECTION', icon: Droplets },
  { text: 'SUSTAINABLY HARVESTED', icon: Shield },
  { text: 'SCULPTURAL BAKHOOR SMOKE', icon: Flame },
  { text: 'HANDCRAFTED ATELIER QUALITY', icon: Award },
];

export default function TickerSeparator() {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#fefcf7] via-[#faf5e8] to-[#fefcf7] text-[#1a120c] border-y border-[#d4af37]/30 py-5 select-none font-sans antialiased">
      
      {/* SOFT GLOW OVERLAYS AT EDGES FOR SMOOTH FADE IN/OUT */}
      <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#faf8f2] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#faf8f2] to-transparent z-10 pointer-events-none" />

      {/* INFINITE RIGHT-TO-LEFT MARQUEE ANIMATION */}
      <div className="flex w-full overflow-hidden">
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 35, // Ultra-smooth slow scroll
          }}
        >
          {/* Duplicated array x4 to ensure seamless infinite loop without gaps */}
          {[...SEPARATOR_ITEMS, ...SEPARATOR_ITEMS, ...SEPARATOR_ITEMS, ...SEPARATOR_ITEMS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-6 md:gap-10 mx-6 md:mx-10">
                
                {/* ICON BADGE */}
                <div className="p-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#b8860b] flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* TEXT CONTENT */}
                <span className="text-xs md:text-sm tracking-[0.3em] font-light uppercase text-[#2d2118]">
                  {item.text}
                </span>

                {/* GOLD DIAMOND DIVIDER */}
                <div className="w-1.5 h-1.5 rotate-45 bg-[#d4af37] opacity-60 flex-shrink-0" />
              </div>
            );
          })}
        </motion.div>
      </div>

    </div>
  );
}