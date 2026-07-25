import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import p19 from "../assets/p19.jpg";
import p20 from "../assets/p20.jpg";

const notes = [
  {
    title: "Top Notes",
    description: "The initial impression. A burst of Sicilian Lemon and Bergamot that awakens the senses.",
    position: { top: "20%", left: "10%" },
    color: "text-amber-600",
  },
  {
    title: "Heart Notes",
    description: "The soul of the fragrance. Rare Damask Rose and Jasmine Sambac for a floral heart.",
    position: { top: "45%", right: "10%" },
    color: "text-slate-900",
  },
  {
    title: "Base Notes",
    description: "The lasting memory. Warm Madagascar Vanilla and Creamy Sandalwood that lingers.",
    position: { top: "70%", left: "10%" },
    color: "text-amber-700",
  },
];

export const ScentJourney = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Balanced spring physics for fluid inertia
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.0001
  });

  // Bottle transformations
  const bottleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.15, 0.9]);
  const bottleRotate = useTransform(smoothProgress, [0, 1], [0, 12]);
  const bottleOpacity = useTransform(smoothProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

  // Decorative ring scaling
  const innerRingScale = useTransform(smoothProgress, [0, 1], [1, 1.4]);
  const innerRingOpacity = useTransform(smoothProgress, [0, 1], [0.1, 0.25]);
  const outerRingScale = useTransform(smoothProgress, [0, 1], [1, 1.8]);
  const outerRingOpacity = useTransform(smoothProgress, [0, 1], [0.05, 0.15]);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-white">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Decorative Rings */}
        <motion.div 
          style={{ scale: innerRingScale, opacity: innerRingOpacity }}
          className="absolute w-[600px] h-[600px] border border-amber-200 rounded-full pointer-events-none will-change-transform"
        />
        <motion.div 
          style={{ scale: outerRingScale, opacity: outerRingOpacity }}
          className="absolute w-[800px] h-[800px] border border-amber-100 rounded-full pointer-events-none will-change-transform"
        />

        {/* Central Perfume Bottle */}
        <motion.div 
          style={{ 
            scale: bottleScale, 
            rotate: bottleRotate, 
            opacity: bottleOpacity 
          }}
          className="relative z-10 w-64 md:w-96 will-change-transform"
        >
          <img 
            src={p20}
            alt="Perfume Bottle" 
            className="w-full h-auto drop-shadow-[0_35px_35px_rgba(212,175,55,0.25)]"
          />
          <div className="absolute inset-0 bg-amber-400 blur-[100px] opacity-20 -z-10 rounded-full" />
        </motion.div>

        {/* Floating Notes */}
        {notes.map((note, index) => (
          <NoteItem 
            key={index} 
            note={note} 
            progress={smoothProgress} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
};

// Sub-component with refined keyframe intervals for text transitions
const NoteItem = ({ note, progress, index }) => {
  const start = index * 0.3 + 0.05;
  const end = (index + 1) * 0.3;

  // Staggered opacity and translation windows
  const opacity = useTransform(progress, [start, start + 0.08, end - 0.08, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.08, end - 0.08, end], [20, 0, 0, -20]);
  const scale = useTransform(progress, [start, start + 0.08], [0.92, 1]);

  return (
    <motion.div 
      style={{ 
        opacity, 
        y, 
        scale, 
        top: note.position.top, 
        left: note.position.left, 
        right: note.position.right 
      }}
      className="absolute z-20 w-64 md:w-80 pointer-events-none will-change-transform"
    >
      <h3 className={`text-2xl md:text-4xl font-serif font-medium ${note.color} mb-2 tracking-tight`}>
        {note.title}
      </h3>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light">
        {note.description}
      </p>
      <div className="w-12 h-[2px] bg-amber-400/80 mt-4" />
    </motion.div>
  );
};

export default ScentJourney;