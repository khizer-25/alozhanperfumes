import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Flame, ShieldCheck } from 'lucide-react';

const CATEGORY_DATA = [
  {
    id: 'perfumes',
    title: 'PERFUMES',
    tagline: 'Artisanal Liquid Scent Signature',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1800&q=80',
    icon: Sparkles,
    benefits: [
      'High oil concentration delivering 12+ hours of continuous projection.',
      'Complex multi-layered note evolution from fresh top to deep base.',
      'Sustainably sourced botanical extracts & rare floral essences.'
    ],
    useCase: 'Daily Signature Wear, Evening Galas & Personal Distinction'
  },
  {
    id: 'oud',
    title: 'OUD',
    tagline: 'Pure Liquid Gold & Ancient Resin',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1800&q=80',
    icon: Compass,
    benefits: [
      'Authentic aged Aquilaria wood oil distilled in traditional copper stills.',
      'Rich, woodsy, smoky, and balsamic scent profile that lingers for days.',
      'Natural grounding aromatherapy properties that promote serene focus.'
    ],
    useCase: 'Special Occasions, Spiritual Rituals & Regal Layering'
  },
  {
    id: 'bakhoor',
    title: 'BAKHOOR',
    tagline: 'Sculptural Fragrant Smoke & Incense',
    image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1800&q=80',
    icon: Flame,
    benefits: [
      'Wood chips soaked in luxury perfume oils, amber, and natural resins.',
      'Instantly purifies living spaces and neutralizes lingering odors.',
      'Infuses garments and textiles with a warm, welcoming aura.'
    ],
    useCase: 'Home Environment Elevating, Hospitality & Ceremonial Welcome'
  },
  {
    id: 'accessories',
    title: 'ACCESSORIES',
    tagline: 'Crafted Vessels & Mabkhara Utensils',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=80',
    icon: ShieldCheck,
    benefits: [
      'Precision-engineered heat distribution for optimal incense burning.',
      'Artisanal brass, marble, and hand-carved ceramic finishes.',
      'Designed to safely contain charcoal embers while maximizing scent.'
    ],
    useCase: 'Incense Burning Setup, Olfactory Gifts & Atelier Display'
  }
];

export default function InfiniteTickerCategories() {
  const [activeId, setActiveId] = useState(null);
  const [hoverDirection, setHoverDirection] = useState('top');

  const handleMouseEnter = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    setHoverDirection(mouseY < rect.height / 2 ? 'top' : 'bottom');
    setActiveId(id);
  };

  const handleMouseLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    setHoverDirection(mouseY < rect.height / 2 ? 'top' : 'bottom');
    setActiveId(null);
  };

  return (
    <section className="w-full bg-white text-black font-sans antialiased py-12 selection:bg-black selection:text-white">
      {/* 100% FULL-WIDTH CONTAINER */}
      <div className="w-full border-t border-b border-black/15">
        {CATEGORY_DATA.map((cat, idx) => {
          const isActive = activeId === cat.id;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={cat.id}
              onMouseEnter={(e) => handleMouseEnter(e, cat.id)}
              onMouseLeave={handleMouseLeave}
              className={`w-full relative select-none cursor-pointer overflow-hidden ${
                idx !== CATEGORY_DATA.length - 1 ? 'border-b border-black/15' : ''
              }`}
            >
              {/* MAIN ROW HEADER */}
              <div className="w-full h-24 md:h-28 relative overflow-hidden bg-white flex items-center justify-center">
                
                {/* DEFAULT CENTERED TEXT (NON-BOLD) */}
                <motion.div
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="z-10 flex items-center justify-center pointer-events-none"
                >
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-widest uppercase text-black text-center">
                    {cat.title}
                  </h3>
                </motion.div>

                {/* HOVER TICKER BANNER (SLIDES IN DIRECTIONALLY) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ y: hoverDirection === 'top' ? '-100%' : '100%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: hoverDirection === 'top' ? '-100%' : '100%' }}
                      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                      className="absolute inset-0 bg-[#0d0d0d] z-20 flex items-center overflow-hidden"
                    >
                      {/* INFINITE TICKER MARQUEE (NON-BOLD) */}
                      <motion.div
                        className="flex items-center whitespace-nowrap"
                        animate={{
                          x: isEven ? ['0%', '-50%'] : ['-50%', '0%']
                        }}
                        transition={{
                          repeat: Infinity,
                          ease: 'linear',
                          duration: 25
                        }}
                      >
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="flex items-center gap-8 md:gap-14 mx-4 md:mx-7">
                            <span className="text-2xl md:text-4xl lg:text-5xl font-normal tracking-widest text-white uppercase">
                              {cat.title}
                            </span>
                            <div className="w-24 md:w-36 h-10 md:h-14 rounded-full overflow-hidden border border-white/20 flex-shrink-0 shadow-lg">
                              <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AUTOMATIC HOVER DROPDOWN PANEL */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { type: 'spring', mass: 0.8, stiffness: 180, damping: 24 },
                      opacity: { duration: 0.25, ease: 'easeOut' }
                    }}
                    className="w-full bg-[#faf8f5] text-black border-t border-black/10 relative overflow-hidden"
                  >
                    {/* BACKGROUND COVER IMAGE */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-15 filter brightness-110 contrast-125 pointer-events-none"
                      style={{ backgroundImage: `url(${cat.image})` }}
                    />

                    {/* CONTENT DETAILS */}
                    <div className="relative z-10 w-full px-8 md:px-16 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Tagline & Benefits */}
                      <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <cat.icon className="w-5 h-5 text-black" />
                          <span className="text-xs uppercase tracking-[0.3em] font-normal text-black/80">
                            {cat.tagline}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-[10px] uppercase tracking-[0.3em] text-black/60 font-normal">
                            Key Characteristics
                          </h4>
                          <ul className="space-y-2.5">
                            {cat.benefits.map((benefit, bIdx) => (
                              <li key={bIdx} className="flex items-center gap-3 text-sm md:text-base font-light text-black/90">
                                <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right: Usage */}
                      <div className="lg:col-span-4 space-y-2 lg:border-l lg:border-black/15 lg:pl-8">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-black/60 font-normal block">
                          Optimal Application
                        </span>
                        <p className="text-base md:text-lg font-light text-black/90 leading-relaxed">
                          {cat.useCase}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </section>
  );
}