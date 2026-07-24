import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import p19 from "../assets/p19.jpg";

const MoodCollectionGallery = () => {
  const containerRef = useRef(null);

  // 1. Core Scroll Progress Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 2. Ultra-smooth inertia spring for scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.0001
  });

  // FIXED: Shift by 2 screen widths (-200vw) so the 3rd card sits exactly full-bleed with no trailing gap.
  const x = useTransform(smoothProgress, [0, 1], ["0vw", "-200vw"]);
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  
  // Parallax background floating particles
  const bgParticleY = useTransform(smoothProgress, [0, 1], [0, -150]);
  const bgParticleRotate = useTransform(smoothProgress, [0, 1], [0, 90]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-gradient-to-b from-white via-amber-50/20 to-white">
      
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        
        {/* Decorative Floating Ambient Elements */}
        <motion.div 
          style={{ y: bgParticleY, rotate: bgParticleRotate }}
          className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-amber-200/20 blur-3xl pointer-events-none z-0"
        />
        <motion.div 
          style={{ y: bgParticleY, rotate: -bgParticleRotate }}
          className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl pointer-events-none z-0"
        />

        {/* Section Header */}
        <motion.header 
          className="absolute top-10 left-0 right-0 z-20 px-6 md:px-16 flex justify-between items-center pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-serif text-slate-800 tracking-tight pointer-events-auto">
            Curated <span className="italic font-light text-rose-500">Moods</span>
          </h2>
          <div className="hidden md:flex items-center gap-3 text-slate-400 text-xs tracking-widest uppercase font-medium">
            <span>Scroll to Explore</span>
            <span className="animate-bounce text-slate-600">→</span>
          </div>
        </motion.header>

        {/* Horizontal Scrolling Track */}
        <motion.div 
          style={{ x }}
          className="flex h-full w-[300vw] will-change-transform z-10"
        >
          <MoodCard 
            title="Sunlit Citrus"
            subtitle="Energizing & Fresh"
            description="A vibrant burst of Sicilian lemon, bergamot, and crushed mint leaves. Perfect for the radiant morning."
            image="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
            bgColor="from-amber-50/80 via-yellow-50/50 to-white"
            accentColor="text-amber-600"
            price="$120"
            index={0}
            total={3}
          />
          <MoodCard 
            title="Velvet Rose"
            subtitle="Romantic & Intense"
            description="A lush bouquet of Damask rose, peony, and a whisper of raspberry. An unforgettable evening signature."
            image={p19}
            bgColor="from-rose-50/80 via-pink-50/50 to-white"
            accentColor="text-rose-600"
            price="$145"
            index={1}
            total={3}
          />
          <MoodCard 
            title="Warm Amber"
            subtitle="Cozy & Grounding"
            description="Rich notes of Madagascar vanilla, sandalwood, and golden amber. A comforting embrace in a bottle."
            image="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
            bgColor="from-orange-50/80 via-amber-50/50 to-white"
            accentColor="text-orange-600"
            price="$135"
            index={2}
            total={3}
          />
        </motion.div>

        {/* Scroll Progress Indicator Bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-[3px] bg-slate-200/60 rounded-full overflow-hidden backdrop-blur-sm z-20">
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-amber-500 rounded-full"
            style={{ width: progressWidth }}
          />
        </div>

      </div>
    </section>
  );
};

// --- Individual Card Component with Enhanced Dynamic 3D Tilt & Interactive Lighting ---

const MoodCard = ({ title, subtitle, description, image, bgColor, accentColor, price, index, total }) => {
  const cardRef = useRef(null);
  
  // Mouse coordinates (-0.5 to 0.5 relative to card center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics springs for interactive response
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 22 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 22 });

  // 3D Rotations
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  // Image Parallax Translation
  const imgX = useTransform(smoothMouseX, [-0.5, 0.5], [-18, 18]);
  const imgY = useTransform(smoothMouseY, [-0.5, 0.5], [-18, 18]);

  // Dynamic Glass Reflection Spotlight Tracking (0% to 100%)
  const spotlightX = useTransform(smoothMouseX, [-0.5, 0.5], ["20%", "80%"]);
  const spotlightY = useTransform(smoothMouseY, [-0.5, 0.5], ["20%", "80%"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="w-[100vw] h-full flex items-center justify-center px-6 md:px-16 flex-shrink-0">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className={`relative w-full max-w-6xl h-[72vh] md:h-[75vh] rounded-[3rem] bg-gradient-to-br ${bgColor} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-white/90 will-change-transform`}
      >
        
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between z-10">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <motion.p 
                className={`text-xs md:text-sm font-semibold tracking-[0.25em] uppercase ${accentColor}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {subtitle}
              </motion.p>
              
              <span className="text-xs font-serif text-slate-400">
                0{index + 1} / 0{total}
              </span>
            </div>
            
            <motion.h3 
              className="text-4xl md:text-7xl font-serif text-slate-800 mb-6 leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {title}
            </motion.h3>
            
            <motion.p 
              className="text-slate-600 text-base md:text-lg leading-relaxed max-w-md font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {description}
            </motion.p>
          </div>

          <div className="flex items-center gap-6 mt-6 md:mt-0">
            {/* Magnetic Button Wrapper */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium text-sm tracking-widest uppercase shadow-xl hover:bg-slate-800 transition-colors"
            >
              Discover
            </motion.button>
            <span className="text-2xl md:text-3xl font-serif text-slate-800 font-light">{price}</span>
          </div>

        </div>

        {/* Right Side: Image with Dynamic Parallax */}
        <div className="w-full md:w-1/2 h-full relative flex items-center justify-center p-6 md:p-12 overflow-hidden">
          
          {/* Subtle Backlight Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full bg-white/60 blur-3xl" />
          </div>

          <motion.div
            style={{ x: imgX, y: imgY }}
            className="relative w-full h-full flex items-center justify-center will-change-transform"
          >
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl"
              initial={{ scale: 1.1, filter: 'blur(8px)', opacity: 0 }}
              whileInView={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            
            {/* Dynamic Glass Badge */}
            <motion.div
              className="absolute -bottom-2 -left-2 md:bottom-6 md:-left-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/80 pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            >
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Eau de Parfum</p>
              <p className="text-base font-semibold text-slate-800">50ml / 1.7 fl.oz</p>
            </motion.div>
          </motion.div>

        </div>

        {/* Dynamic Light Spotlight Overlay on Card Mouse Hover */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([xVal, yVal]) => `radial-gradient(600px circle at ${xVal} ${yVal}, rgba(255,255,255,0.25), transparent 80%)`
            )
          }}
        />

      </motion.div>
    </div>
  );
};

export default MoodCollectionGallery;