import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Flower2, TreeDeciduous, ArrowUpRight } from 'lucide-react';

const luxuryEase = [0.22, 1, 0.36, 1];

const scentNotes = [
  { 
    id: 'top',
    title: 'Top Note', 
    scent: 'Bergamot & Pink Pepper', 
    description: 'A radiant opening burst that instantly energizes the senses.',
    color: 'from-amber-100/90 via-amber-50/60 to-white/80',
    borderColor: 'border-amber-200',
    accentColor: 'text-amber-600',
    icon: Sparkles 
  },
  { 
    id: 'heart',
    title: 'Heart Note', 
    scent: 'Damask Rose & Jasmine', 
    description: 'A velvety floral core that unfolds with romantic elegance.',
    color: 'from-rose-100/90 via-pink-50/60 to-white/80',
    borderColor: 'border-rose-200',
    accentColor: 'text-rose-600',
    icon: Flower2 
  },
  { 
    id: 'base',
    title: 'Base Note', 
    scent: 'White Musk & Sandalwood', 
    description: 'A lingering warm foundation that leaves an indelible trail.',
    color: 'from-orange-100/90 via-amber-50/60 to-white/80',
    borderColor: 'border-orange-200',
    accentColor: 'text-orange-600',
    icon: TreeDeciduous 
  }
];

const SignatureScentSection = () => {
  const containerRef = useRef(null);
  const [activeNote, setActiveNote] = useState(0);

  // Scroll animations scoped strictly to this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  const bottleY = useTransform(smoothProgress, [0, 1], [60, -60]);
  const bottleRotate = useTransform(smoothProgress, [0, 1], [-4, 4]);
  const glowScale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.25, 0.85]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        ease: luxuryEase,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: luxuryEase }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-rose-50/60 via-amber-50/30 to-white py-28 px-6 md:px-16"
    >
      {/* Background Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute top-12 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-12 right-1/4 w-[28rem] h-[28rem] bg-amber-200/25 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p 
            variants={itemVariants}
            className="text-rose-500 font-semibold tracking-[0.25em] uppercase text-xs md:text-sm mb-3"
          >
            The Signature Edition
          </motion.p>
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-7xl font-serif text-slate-800 tracking-tight mb-6"
          >
            Discover Your <span className="italic font-light text-rose-600">Essence</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-light"
          >
            A luminous harmony of rare florals and warm woods, crafted to capture the radiant energy of a sunlit morning.
          </motion.p>
        </motion.div>

        {/* Main Grid: Bottle Display & Olfactory Pyramid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Bottle Stage */}
          <motion.div 
            className="lg:col-span-6 relative flex justify-center items-center h-[480px] md:h-[580px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: luxuryEase }}
          >
            {/* Dynamic Glow Aura */}
            <motion.div 
              className={`absolute w-80 h-80 rounded-full blur-3xl transition-colors duration-700 ${
                activeNote === 0 ? 'bg-amber-300/40' : activeNote === 1 ? 'bg-rose-300/40' : 'bg-orange-300/40'
              }`}
              style={{ scale: glowScale }}
            />
            
            {/* Bottle Image Container */}
            <motion.div
              className="relative z-10 w-64 md:w-80 cursor-pointer"
              style={{ y: bottleY, rotate: bottleRotate }}
              whileHover={{ scale: 1.04, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80" 
                alt="Signature Perfume Bottle" 
                className="w-full h-auto object-contain filter drop-shadow-[0_25px_35px_rgba(244,63,94,0.18)]"
              />
            </motion.div>
          </motion.div>

          {/* Right Column: Olfactory Accordion */}
          <div className="lg:col-span-6 space-y-5">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: luxuryEase }}
            >
              <h3 className="text-2xl md:text-3xl font-serif text-slate-800 mb-2">
                The Olfactory Structure
              </h3>
              <p className="text-slate-500 text-sm md:text-base font-light">
                Select a note to reveal its underlying scent profile.
              </p>
            </motion.div>

            {scentNotes.map((note, index) => {
              const Icon = note.icon;
              const isActive = activeNote === index;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8, ease: luxuryEase }}
                  onClick={() => setActiveNote(index)}
                  className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-500 border overflow-hidden ${
                    isActive 
                      ? `bg-gradient-to-br ${note.color} ${note.borderColor} shadow-xl scale-[1.02]` 
                      : 'bg-white/60 border-white/80 hover:bg-white/80 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="relative z-10 flex items-start gap-5">
                    {/* Icon Shield */}
                    <div className={`p-3.5 rounded-2xl transition-colors duration-300 ${
                      isActive ? 'bg-white shadow-sm' : 'bg-slate-100/80'
                    }`}>
                      <Icon className={`w-6 h-6 ${note.accentColor}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold uppercase tracking-widest ${note.accentColor}`}>
                          {note.title}
                        </span>
                        {isActive && (
                          <motion.span 
                            layoutId="activeDot"
                            className="w-2 h-2 rounded-full bg-rose-500"
                          />
                        )}
                      </div>
                      
                      <h4 className="text-xl font-serif text-slate-800 font-medium mb-1">
                        {note.scent}
                      </h4>
                      
                      <p className="text-slate-500 text-sm leading-relaxed font-light">
                        {note.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* CTA Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8, ease: luxuryEase }}
              className="pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 px-9 py-4 bg-slate-900 text-white rounded-full font-medium text-sm tracking-wider uppercase shadow-xl hover:bg-slate-800 transition-colors"
              >
                <span>Experience Scent</span>
                <ArrowUpRight className="w-4 h-4 text-rose-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default SignatureScentSection;