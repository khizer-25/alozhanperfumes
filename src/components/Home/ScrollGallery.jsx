import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import p1 from "../../../public/p1.jpg"
import p2 from "../../../public/p2.jpg"
import p3 from "../../../public/p3.jpg"
import p4 from "../../../public/p4.jpg"
import p5 from "../../../public/p5.jpg"
import p6 from "../../../public/p6.jpg"
import p7 from "../../../public/p7.jpg"
import p8 from "../../../public/p8.jpg"
import p9 from "../../../public/p9.jpg"
import p10 from "../../../public/p10.jpg"
import p11 from "../../../public/p11.jpg"
import p12 from "../../../public/p12.jpg"
import p13 from "../../../public/p13.jpg"
import p14 from "../../../public/p14.png"
import p15 from "../../../public/p15.jpg"
import p16 from "../../../public/p16.jpg"
import p18 from "../../../public/p18.jpg"

gsap.registerPlugin(ScrollTrigger);

const PERFUMES = [
  { id: 1, name: "Boutique Workspace", category: "RETAIL", desc: "A workspace that doubles as a showroom. Curated material samples line the walls like a gallery—every surface a demonstration of the studio's craft.", src: p1 },
  { id: 2, name: "Modern Conference", category: "COMMERCIAL", desc: "A boardroom built for decisions that matter. Integrated AV technology disappears into the architecture—only the clean lines remain.", src: p2 },
  { id: 3, name: "Minimalist Lounge", category: "HOSPITALITY", desc: "Silence as luxury. This hospitality lounge strips back every non-essential until only the pure geometry and texture remain.", src: p3 },
  { id: 4, name: "Startup Atmosphere", category: "CO-WORKING", desc: "Energy bottled in architecture. Exposed structures, bold color zoning, and modular furniture systems that reconfigure instantly.", src: p4 },
  { id: 5, name: "Industrial Office", category: "CORPORATE", desc: "Raw concrete slabs meet precision polished steel frameworks to build a productive, textured minimalist modern work hub.", src: p5 },
  { id: 6, name: "High-Tech Station", category: "CORPORATE", desc: "The command center of a technology firm, built with integrated sensor lighting, seamless wireless arrays, and ergonomic design lines.", src: p6 },
  { id: 7, name: "Executive Suite", category: "EXECUTIVE", desc: "Panoramic views framed by dark walnut paneling and custom matte black metal architectural features.", src: p7 },
  { id: 8, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p8 },
  { id: 9, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p9 },
  { id: 10, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p10 },
  { id: 11, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p11 },
  { id: 12, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p12 },
  { id: 13, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p13 },
  { id: 14, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p14 },
  { id: 15, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p15 },
  { id: 16, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p16 },
  { id: 18, name: "Creative Studio", category: "STUDIO", desc: "An open concept floorplan maximizing northern daylight conditions with tall industrial multi-pane windows.", src: p18 },
];

export default function ScrollGallery() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const centralTextRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);

  useGSAP(() => {
    const items = gsap.utils.toArray('.gallery-item');
    const totalItems = items.length;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=4000', 
        scrub: 2, 
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Reset baselines cleanly
    gsap.set(items, { x: 0, y: 0, rotateZ: 0, scale: 1 });
    gsap.set(centralTextRef.current, { opacity: 0, scale: 0.8 });

    // STAGE 1: Spread out horizontally 
    tl.to(items, {
      x: (i) => (i - (totalItems - 1) / 2) * 140,
      y: 120,
      rotateZ: 0,
      scale: 0.9,
      duration: 2,
      ease: 'power3.inOut'
    });

    // STAGE 2: Circular Wheel configuration (Enhanced layout spacing)
    tl.to(items, {
      x: (i) => {
        const angle = (i / totalItems) * Math.PI * 2 - Math.PI / 2;
        return Math.cos(angle) * 310;
      },
      y: (i) => {
        const angle = (i / totalItems) * Math.PI * 2 - Math.PI / 2;
        return Math.sin(angle) * 310;
      },
      rotateZ: (i) => (i / totalItems) * 360,
      scale: 0.8,
      duration: 3,
      immediateRender: false,
      ease: 'power3.inOut'
    }, '+=0.2');

    tl.to(centralTextRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power3.out'
    }, '<+=0.5');

    tl.to(centralTextRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'power3.in'
    }, '+=0.5');

    // STAGE 3: Final Downward Portfolio Arc Row
    tl.to(items, {
      x: (i) => (i - (totalItems - 1) / 2) * 160, 
      y: (i) => {
        const distanceFromCenter = i - (totalItems - 1) / 2;
        return -40 + (distanceFromCenter * distanceFromCenter) * 10; 
      },
      rotateZ: (i) => (i - (totalItems - 1) / 2) * 5,
      scale: 1,
      duration: 3,
      immediateRender: false,
      ease: 'power3.out'
    }, '+=0.1');

  }, { scope: containerRef });

  const navigateModal = (direction, e) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    if (direction === 'prev') {
      setActiveIdx((prev) => (prev === 0 ? PERFUMES.length - 1 : prev - 1));
    } else {
      setActiveIdx((prev) => (prev === PERFUMES.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    // Fixed: Standard full workflow document tracking without bleed properties
    <div ref={containerRef} className="w-full bg-white text-neutral-900 relative">
      
      {/* Intro Header Section */}
      <div className="h-screen w-full flex flex-col justify-center items-center bg-white relative z-10">
        <h1 className="text-6xl font-light tracking-tight text-neutral-900 mb-2">Defined by</h1>
        <h2 className="text-6xl font-medium tracking-tight text-rose-600 mb-8">Precision.</h2>
        <p className="text-xs uppercase tracking-widest text-neutral-400 animate-bounce">Scroll Down</p>
      </div>

      {/* Main Interactive Screen Canvas - Managed Pinning Container Track */}
      <div ref={triggerRef} className="h-screen w-full relative overflow-hidden flex items-center justify-center bg-white z-20">
        
        <div ref={centralTextRef} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-0 select-none">
          <h2 className="text-5xl font-bold tracking-tight text-neutral-800">Office Zone</h2>
          <p className="text-xs font-medium text-neutral-400 mt-2 uppercase tracking-widest">Click on images</p>
        </div>

        {/* Global perspective container setup */}
        <div className="relative w-full h-full flex items-center justify-center [perspective:1800px] [transform-style:preserve-3d] z-10">
          {PERFUMES.map((perfume, index) => (
            <div
              key={perfume.id}
              onClick={() => setActiveIdx(index)}
              className="gallery-item absolute w-36 h-48 cursor-pointer select-none origin-center group [transform-style:preserve-3d] z-10 hover:!z-50 will-change-transform transition-all duration-500 ease-out hover:[transform:scale(1.1)_translateZ(60px)]"
            >
              <div className="relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                
                {/* CARD FRONT SIDE */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] overflow-hidden rounded-none shadow-md [transform:translateZ(1px)]">
                  <img 
                    src={perfume.src} 
                    alt={perfume.name} 
                    className="w-full h-full object-cover pointer-events-none" 
                  />
                </div>

                {/* CARD BACK SIDE */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] bg-white text-neutral-900 flex flex-col justify-center items-center text-center p-3 rounded-none shadow-lg border border-neutral-100">
                  <span className="text-[9px] tracking-widest uppercase text-neutral-400 mb-1">Project</span>
                  <h3 className="text-xs font-semibold tracking-wide text-neutral-800 uppercase px-1 line-clamp-2">{perfume.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-2">Tap to open</p>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none z-20 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-light tracking-wide text-neutral-800">Our Works</h2>
          <p className="text-[10px] tracking-widest text-neutral-400 max-w-md uppercase mt-3 px-6 leading-relaxed">
            A curated collection of high-performance environments and sculptural spaces.
          </p>
        </div>
      </div>

      {/* Sub-Gallery Continuation Context Section */}
      {/* <div className="h-screen w-full bg-neutral-50 flex flex-col justify-center items-center text-neutral-800 relative z-10">
        <div className="max-w-4xl w-full px-8 flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-400">SINCE 2008</span>
            <h2 className="text-4xl font-light tracking-tight mt-1 text-neutral-900">Interior Mastery</h2>
          </div>
          <p className="text-sm font-light text-neutral-500 max-w-sm leading-relaxed">
            Creating <span className="font-normal text-neutral-800">timeless environments</span> through architectural precision and material innovation.
          </p>
        </div>
      </div> */}

      {/* MODAL POPUP COMPONENT */}
      {activeIdx !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setActiveIdx(null)}>
          <div 
            className="bg-white/95 text-neutral-900 max-w-5xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl relative min-h-[500px] rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setActiveIdx(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-700 bg-neutral-100/80 p-2.5 transition-all duration-500 transform hover:rotate-180 hover:scale-90 z-20 rounded-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* LEFT MEDIA PORTION */}
            <div className="relative w-full md:w-1/2 bg-neutral-100 flex items-center justify-center select-none overflow-hidden">
              <img 
                src={PERFUMES[activeIdx].src} 
                alt={PERFUMES[activeIdx].name} 
                className="w-full h-full object-cover aspect-[4/3] md:aspect-auto"
              />
              
              {/* Overlay Navigation Buttons */}
              <button 
                onClick={(e) => navigateModal('prev', e)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-neutral-800 p-3 shadow-md hover:scale-105 transition-all z-10 rounded-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={(e) => navigateModal('next', e)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-neutral-800 p-3 shadow-md hover:scale-105 transition-all z-10 rounded-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Dynamic Image Counter Display Box */}
              <div className="absolute bottom-6 left-6 bg-black/50 text-white text-[11px] px-3 py-1.5 rounded-none font-mono tracking-widest">
                {String(activeIdx + 1).padStart(2, '0')} — {String(PERFUMES.length).padStart(2, '0')}
              </div>
            </div>

            {/* RIGHT DESCRIPTION MATERIAL LAYER */}
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
              <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-2 block">
                {PERFUMES[activeIdx].category}
              </span>
              <h2 className="text-4xl font-normal tracking-tight text-neutral-800 mb-4">
                {PERFUMES[activeIdx].name}
              </h2>
              <div className="w-14 h-[2px] bg-neutral-900 mb-8"></div>
              <p className="text-sm leading-relaxed text-neutral-400 font-light mb-10 max-w-md">
                {PERFUMES[activeIdx].desc}
              </p>
              
              <div className="flex gap-3 flex-wrap">
                <span className="text-[10px] uppercase tracking-widest bg-neutral-50 text-neutral-400 px-4 py-2 rounded-none border border-neutral-100 font-medium">Workspace</span>
                <span className="text-[10px] uppercase tracking-widest bg-neutral-50 text-neutral-400 px-4 py-2 rounded-none border border-neutral-100 font-medium">Gallery</span>
                <span className="text-[10px] uppercase tracking-widest bg-neutral-50 text-neutral-400 px-4 py-2 rounded-none border border-neutral-100 font-medium">Material Study</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}