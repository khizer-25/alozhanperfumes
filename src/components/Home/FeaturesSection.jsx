import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, FlaskConical, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const perfumeCategories = [
    {
      title: 'Artisan Ouds',
      description: 'Hand-distilled agarwood sourced from ancient forests for a deep, mystical trail.',
      icon: <Sparkles className="w-6 h-6 mb-2 text-[#d4af37]" />,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Noble Essences',
      description: 'Rare floral extractions and velvet musks designed for the sophisticated palate.',
      icon: <Droplets className="w-6 h-6 mb-2 text-[#d4af37]" />,
      image: 'https://images.unsplash.com/photo-1458538977777-0549b2370168?w=600&auto=format&fit=crop&q=60',
    },
    {
      title: 'Custom Blends',
      description: 'Your olfactory signature, crafted molecule by molecule in our private atelier.',
      icon: <FlaskConical className="w-6 h-6 mb-2 text-[#d4af37]" />,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    // Background updated to a deep charcoal/brown to match the image shadows #c7a693C
    <div ref={sectionRef} className="bg-[#78532f] py-20 px-6 font-sans antialiased">
      
      {/* --- WHY CHOOSE US SECTION --- */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-light text-[#362720] mb-4 tracking-tight leading-tight">
          Why Choose Us?
        </h2>
        {/* Bright gold accent bar */}
        <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mb-8" />
        <p className="max-w-2xl mx-auto text-[#382820] text-sm md:text-lg leading-relaxed font-light">
          Discovering the art of scent. Sourcing rare ingredients from around the world to bring you an unparalleled sensory experience.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
        {perfumeCategories.map((item, index) => (
          <motion.div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            whileHover={{ y: -10 }}
            className="bg-[#26201c] rounded-sm overflow-hidden shadow-2xl border border-white/5"
          >
            <div className="h-72 overflow-hidden relative group">
                {/* Overlay to mimic the smoky, dark atmosphere of the image */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-100"
              />
            </div>
            <div className="p-8 text-center">
              <div className="flex justify-center opacity-80">{item.icon}</div>
              <h3 className="text-xl font-medium text-white mb-3 tracking-wide uppercase">{item.title}</h3>
              <p className="text-stone-400 text-sm mb-8 leading-relaxed font-light">
                {item.description}
              </p>
              <button className="w-full py-3 bg-transparent border border-[#d4af37] text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-black transition-all duration-300">
                DISCOVER
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- VISIT US TODAY SECTION --- */}
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#2a2420] to-[#1a1512] rounded-sm p-8 md:p-16 border border-white/5 relative overflow-hidden">
        {/* Subtle radial glow to mimic the lighting on the Mabkhara */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 blur-[100px] rounded-full -mr-20 -mt-20" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-left">
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6 leading-[1.1]">
              Artisanal fragrances <br />
              <span className="italic font-extralight text-stone-400">engineered with precision.</span>
            </h2>
            <p className="text-[#d4af37] text-xs tracking-[0.3em] mb-8 uppercase font-bold">
              The Flagship Atelier
            </p> 
            <p className="text-stone-300 mb-10 leading-relaxed font-light text-lg">
              Step into a world of liquid gold. Our fragrance advisors are ready to guide you through a private consultation. Experience the textures and notes in person.
            </p>
           <button
  onClick={() =>
    window.open(
      "https://maps.google.com/?q=17.385044,78.486671",
      "_blank"
    )
  }
  className="flex items-center gap-4 px-10 py-4 bg-[#d4af37] text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#a1811a] transition-colors group"
>
  <MapPin className="w-4 h-4 group-hover:animate-bounce" />
  FIND OUR LOCATION
</button>
          </div>

          <div className="h-[550px] w-full rounded-sm overflow-hidden border border-[#d4af37]/30 shadow-2xl">
  <iframe
    title="Our Store Location"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.414263694377!2d78.486671!3d17.385044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c9b0d6d3d9%3A0x8b5a6d9f4c9d9b3!2sHyderabad!5e0!3m2!1sen!2sin!4v1719999999999!5m2!1sen!2sin"
    className="w-full h-full border-0"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
  />

          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;