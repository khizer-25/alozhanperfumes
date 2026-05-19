// import React from 'react';
// import { motion } from 'framer-motion';
// import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   const footerLinks = {
//     Shop: ['All Perfumes', 'Oud Collection', 'Gift Sets', 'Samples'],
//     Company: ['Our Story', 'Sustainability', 'Ateliers', 'Careers'],
//     Support: ['Shipping', 'Returns', 'FAQ', 'Contact Us'],
//   };

//   return (
//     <footer className="bg-[#fdfcf9] border-t border-stone-200 pt-20 pb-10 px-6 font-serif">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
//           {/* Brand & Newsletter Section */}
//           <div className="lg:col-span-2 space-y-8">
//             <Link to="/" className="no-underline">
//               <h2 className="text-3xl font-black tracking-tighter text-stone-900">ORVÉLIA</h2>
//             </Link>
//             <p className="text-stone-500 max-w-sm leading-relaxed italic">
//               Subscribe to receive updates on new launches, private sales, and olfactory stories.
//             </p>
//             <form className="relative max-w-sm group">
//               <input 
//                 type="email" 
//                 placeholder="EMAIL ADDRESS" 
//                 className="w-full bg-transparent border-b border-stone-300 py-3 pr-10 text-xs tracking-widest focus:outline-none focus:border-stone-900 transition-colors uppercase"
//               />
//               <button className="absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform">
//                 <ArrowRight size={18} className="text-stone-400" />
//               </button>
//             </form>
//           </div>

//           {/* Navigation Links */}
//           {Object.entries(footerLinks).map(([title, links]) => (
//             <div key={title} className="space-y-6">
//               <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-stone-900">{title}</h4>
//               <ul className="space-y-4 list-none p-0">
//                 {links.map((link) => (
//                   <li key={link}>
//                     <motion.a 
//                       href="#" 
//                       whileHover={{ x: 5 }}
//                       className="text-stone-500 text-sm hover:text-stone-900 transition-colors cursor-pointer block no-underline"
//                     >
//                       {link}
//                     </motion.a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Bar */}
//         <div className="pt-10 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="flex gap-6 text-stone-400">
//             <Instagram size={20} className="hover:text-stone-900 cursor-pointer transition-colors" />
//             <Twitter size={20} className="hover:text-stone-900 cursor-pointer transition-colors" />
//             <Facebook size={20} className="hover:text-stone-900 cursor-pointer transition-colors" />
//           </div>
          
//           <div className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">
//             © {currentYear} ORVÉLIA PARFUMS. ALL RIGHTS RESERVED.
//           </div>
          
//           <div className="flex gap-8 text-[10px] tracking-widest text-stone-400 uppercase">
//             <span className="hover:text-stone-900 cursor-pointer">Privacy Policy</span>
//             <span className="hover:text-stone-900 cursor-pointer">Terms of Service</span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


















import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: ['All Perfumes', 'Oud Collection', 'Gift Sets', 'Samples'],
    Company: ['Our Story', 'Sustainability', 'Ateliers', 'Careers'],
    Support: ['Shipping', 'Returns', 'FAQ', 'Contact Us'],
  };

  return (
    // Updated to match the dark features background and modern sans font
    <footer className="bg-[#1a1512] border-t border-white/5 pt-20 pb-10 px-6 font-sans antialiased text-stone-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="no-underline">
              {/* Refined font weight to match "Artisanal Fragrances" style */}
              <h2 className="text-3xl font-light tracking-[0.15em] text-white">ORVÉLIA</h2>
            </Link>
            <p className="text-stone-400 max-w-sm leading-relaxed font-light text-sm">
              Subscribe to receive updates on new launches, private sales, and <span className="text-[#d4af37]">olfactory stories.</span>
            </p>
            <form className="relative max-w-sm group">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-stone-700 py-3 pr-10 text-[10px] tracking-[0.3em] focus:outline-none focus:border-[#d4af37] transition-colors uppercase font-bold text-white placeholder:text-stone-600"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} className="text-[#d4af37]" />
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white">{title}</h4>
              <ul className="space-y-4 list-none p-0">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a 
                      href="#" 
                      whileHover={{ x: 5, color: "#d4af37" }}
                      className="text-stone-500 text-xs font-light tracking-wide transition-colors cursor-pointer block no-underline"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 text-stone-500">
            <Instagram size={18} className="hover:text-[#d4af37] cursor-pointer transition-colors" />
            <Twitter size={18} className="hover:text-[#d4af37] cursor-pointer transition-colors" />
            <Facebook size={18} className="hover:text-[#d4af37] cursor-pointer transition-colors" />
          </div>
          
          <div className="text-[9px] tracking-[0.4em] text-stone-600 uppercase font-light">
            © {currentYear} <span className="text-stone-500">ORVÉLIA PARFUMS</span>. ALL RIGHTS RESERVED.
          </div>
          
          <div className="flex gap-8 text-[9px] tracking-widest text-stone-600 uppercase font-bold">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;