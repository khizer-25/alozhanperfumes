import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Droplets, FlaskConical, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const mapSectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Intro Reveal on Scroll
      gsap.fromTo(
        headerRef.current.querySelectorAll('.reveal-text'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo(
        headerRef.current.querySelector('.gold-bar'),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      );

      // 2. 3D Card Stack Entry & Smooth Scroll Parallax
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Entry fade and slight lift sequence
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, rotationX: 10 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Continuous parallax effect on card images during scrolling
        const img = card.querySelector('.parallax-img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -10, scale: 1.15 },
            {
              yPercent: 10,
              scale: 1.02,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        }
      });

      // 3. Flagship Map Section Premium Presentation Reveal
      const mapElements = mapSectionRef.current.querySelectorAll('.map-reveal');
      gsap.fromTo(
        mapElements,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.4,
          stagger: 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: mapSectionRef.current,
            start: 'top 80%',
          },
        }
      );

      const mapRight = mapSectionRef.current.querySelector('.map-right');
      gsap.fromTo(
        mapRight,
        { opacity: 0, scale: 0.95, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mapSectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const perfumeCategories = [
    {
      title: 'Artisan Ouds',
      description: 'Hand-distilled agarwood sourced from ancient forests for a deep, mystical trail.',
      icon: <Sparkles className="w-5 h-5 text-[#d4af37]" />,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Noble Essences',
      description: 'Rare floral extractions and velvet musks designed for the sophisticated palate.',
      icon: <Droplets className="w-5 h-5 text-[#d4af37]" />,
      image: 'https://images.unsplash.com/photo-1458538977777-0549b2370168?w=600&auto=format&fit=crop&q=60',
    },
    {
      title: 'Custom Blends',
      description: 'Your olfactory signature, crafted molecule by molecule in our private atelier.',
      icon: <FlaskConical className="w-5 h-5 text-[#d4af37]" />,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div ref={sectionRef} className="bg-[#110f0e] py-32 px-6 font-sans antialiased overflow-hidden text-white [perspective:1200px]">
      
      {/* --- WHY CHOOSE US HEADER --- */}
      <div ref={headerRef} className="max-w-6xl mx-auto text-center mb-24">
        <span className="reveal-text block text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-medium mb-3">
          The Art of Olfaction
        </span>
        <h2 className="reveal-text text-4xl md:text-5xl font-extralight tracking-tight text-stone-100 mb-6">
          Why Choose Us?
        </h2>
        <div className="gold-bar w-20 h-[1px] bg-[#d4af37] mx-auto mb-8 origin-center" />
        <p className="reveal-text max-w-xl mx-auto text-stone-400 text-sm md:text-base leading-relaxed font-light">
          Discovering the art of scent. Sourcing rare ingredients from around the world to bring you an unparalleled sensory experience.
        </p>
      </div>

      {/* --- PARALLAX CARDS GRID --- */}
      <div ref={cardsContainerRef} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-40">
        {perfumeCategories.map((item, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="group relative bg-[#1c1816] rounded-none overflow-hidden shadow-2xl border border-white/[0.03] transition-all duration-700 ease-out hover:shadow-[#d4af37]/5 hover:border-[#d4af37]/20 hover:-translate-y-3"
          >
            {/* Image Container with strict Overflow Crop for Parallax Isolation */}
            <div className="h-80 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 z-10" />
              <img 
                src={item.image} 
                alt={item.title} 
                className="parallax-img w-full h-[120%] object-cover will-change-transform"
              />
            </div>
            
            <div className="p-8 text-center relative z-20">
              <div className="flex justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
                <div className="p-3 rounded-full bg-white/[0.02] border border-white/5 shadow-inner">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg font-light text-stone-100 mb-3 tracking-[0.2em] uppercase">{item.title}</h3>
              <p className="text-stone-400 text-xs mb-8 leading-relaxed font-light max-w-[240px] mx-auto min-h-[48px]">
                {item.description}
              </p>
              
              <button className="relative w-full py-3.5 bg-transparent border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold tracking-[0.25em] uppercase overflow-hidden transition-all duration-500 hover:text-black hover:border-[#d4af37] before:absolute before:inset-0 before:bg-[#d4af37] before:scale-x-0 before:origin-right hover:before:scale-x-100 hover:before:origin-left before:transition-transform before:duration-500 before:ease-out before:-z-10 z-10">
                DISCOVER
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- FLAGSHIP MAP SHOWCASE SECTION --- */}
      <div ref={mapSectionRef} className="max-w-6xl mx-auto bg-gradient-to-br from-[#181513] to-[#0f0d0c] p-8 md:p-20 border border-white/[0.03] shadow-2xl relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/[0.02] blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Detail Array */}
          <div className="lg:col-span-5 flex flex-col justify-center h-full">
            <span className="map-reveal text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-medium mb-3 block">
              Experience Atelier
            </span>
            <h2 className="map-reveal text-4xl md:text-5xl font-extralight leading-none tracking-tight">
              <span className="text-stone-100">Find Your</span>
              <br />
              <span className="italic text-[#d4af37] font-serif block mt-2">Signature Scent.</span>
            </h2>

            <div className="map-reveal w-16 h-[1px] bg-[#d4af37]/60 my-8" />

            <p className="map-reveal text-xl md:text-2xl font-serif italic text-stone-300 leading-relaxed font-light mb-10">
              “Every fragrance tells a story. Find the one that becomes yours.”
            </p>

            <div className="map-reveal border-l border-[#d4af37]/40 pl-6 space-y-4">
              <h3 className="uppercase tracking-[0.25em] text-xs text-[#d4af37] font-semibold">
                Visit Our Flagship Store
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed max-w-sm font-light">
                Experience our complete collection, receive personalized fragrance guidance, and discover your signature scent.
              </p>
              <div className="flex items-center gap-3 text-stone-200 text-sm font-light pt-1">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>Hyderabad, Telangana</span>
              </div>
              <p className="text-stone-500 text-[11px] tracking-wide font-mono">
                Mon – Sat • 10:00 AM – 8:00 PM
              </p>
            </div>

            <button
              onClick={() => window.open("https://maps.google.com/?q=17.385044,78.486671", "_blank")}
              className="map-reveal mt-10 w-fit flex items-center gap-3 px-8 py-4 bg-[#d4af37] text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#b8922b] transition-all duration-300 shadow-xl shadow-black/20"
            >
              <MapPin className="w-4 h-4" />
              FIND OUR LOCATION
            </button>
          </div> 

          {/* Right Map Embedded Frame Section */}
          <div className="map-right lg:col-span-7 h-[500px] w-full bg-[#110f0e] border border-[#d4af37]/20 shadow-2xl relative group overflow-hidden">
            {/* Premium contextual frame accent highlights */}
            <div className="absolute top-0 left-0 w-4 h-[1px] bg-[#d4af37] z-10" />
            <div className="absolute top-0 left-0 w-[1px] h-4 bg-[#d4af37] z-10" />
            <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-[#d4af37] z-10" />
            <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-[#d4af37] z-10" />
            
            <iframe
              title="Our Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.414263694377!2d78.486671!3d17.385044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c9b0d6d3d9%3A0x8b5a6d9f4c9d9b3!2sHyderabad!5e0!3m2!1sen!2sin!4v1719999999999!5m2!1sen!2sin"
              className="w-full h-full border-0 grayscale opacity-85 contrast-125 invert-[0.9] sepia-[0.1] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out"
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