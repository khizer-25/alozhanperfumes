import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { api } from "../../utils/api";
// import FilterBar from "../components/FilterBar";
// import { layoutClasses, textClasses } from "../styles/uiClasses";

function HomePage({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
  const tl = gsap.timeline();

  tl.fromTo(
    heroRef.current,
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: "power2.inOut" }
  ).fromTo(
    textRef.current,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    "-=0.6"
  );
},[]);
  
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await api.get("/products?pageSize=100");

      const normalized = (data.products || []).map((p) => ({
        ...p,
        id: p._id,
      }));

      setProducts(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

 const categories = useMemo(
  () => ["All", ...new Set(products.map((product) => product.category))],
  [products]
);


  

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortOrder]);

  return (
    <>
      {/* HERO SECTION - REFRESHED WITH MOISTURE/DROPLETS AESTHETIC */}
      <section
        id="home"
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-screen min-h-[700px] overflow-hidden bg-[#1a1a1a]"
        ref={heroRef}
      >
        <img
          src="https://phool.co/cdn/shop/articles/1715183038921Shhudh_20_62.jpg?v=1726044171"
          alt="Luxury perfume bottle with fresh water droplets and moisture"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        
        {/* Dark Gradient Overlay for better text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
        
        {/* Content Overlay */}
        <div className="relative z-10 grid h-full w-full grid-cols-1 md:grid-cols-2 px-10">
          <div /> {/* Left empty space to mimic layout */}
          
          <div className="flex flex-col justify-center text-white md:pr-20" ref={textRef}>
            {/* Circular CTA */}
            {/* <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer">
              <span className="text-[10px] font-bold tracking-widest">START TODAY</span>
            </div> */}

            <h1 className="max-w-md text-2xl font-light leading-relaxed md:text-3xl lg:text-4xl">
              Artisanal fragrances engineered with precision. Soft enough for daily wear, powerful enough for lasting impressions.
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;