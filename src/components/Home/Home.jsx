import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, FlaskConical, Package, Sparkles } from "lucide-react";
import FeaturedCollection from "./FeaturedCollection";
import Contact from "./Contactus";
import Reveal from "../common/Reveal";
import useSettings from "../../hooks/useSettings";

/**
 * Background video for the hero.
 *
 * React doesn't reliably reflect the `muted` prop to the DOM attribute (which
 * some browsers require before they'll autoplay), so we force it via a ref and
 * start playback ourselves. If the browser still refuses (strict autoplay
 * policy, data saver), we retry on the first user interaction. A still poster
 * frame covers every case where the video can't run.
 */
function HeroVideo() {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;

    let done = false;
    const kick = () => {
      if (done) return;
      const p = v.play();
      if (p && p.then) {
        p.then(() => {
          done = true;
          removeInteraction();
        }).catch(() => {});
      }
    };

    const events = ["pointerdown", "touchstart", "keydown", "scroll"];
    const removeInteraction = () =>
      events.forEach((e) => window.removeEventListener(e, kick));

    kick();
    v.addEventListener("loadeddata", kick);
    v.addEventListener("canplay", kick);
    events.forEach((e) =>
      window.addEventListener(e, kick, { passive: true })
    );

    return () => {
      v.removeEventListener("loadeddata", kick);
      v.removeEventListener("canplay", kick);
      removeInteraction();
    };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-[80%_center] md:object-center"
      src="/media/hero-perfume.mp4"
      poster="/media/hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}

/**
 * Phones get their own portrait films instead of the cropped landscape one:
 * a perfume film, then an attar film, looping. Each clip dips through black at
 * both ends, so the hand-over between them (and the loop) is seamless. The
 * idle clip is preloaded and faded in while the other fades out.
 */
const MOBILE_CLIPS = [
  { src: "/media/hero-m-perfume.mp4", poster: "/media/hero-m-perfume.jpg", label: "Perfumes" },
  { src: "/media/hero-m-attar.mp4", poster: "/media/hero-m-attar.jpg", label: "Attars" },
];

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function MobileHeroVideos({ onFail }) {
  const refs = useRef([]);
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);

  // Data-saver users get the poster frame only. (Reduced-motion is deliberately not
  // used: it is on by default on many phones/PCs with animations turned off, and
  // would stop the film for them; these are slow, muted ambient clips.)
  useEffect(() => {
    if (navigator.connection && navigator.connection.saveData) setStill(true);
  }, []);

  useEffect(() => {
    if (still) return undefined;
    const cur = refs.current[active];
    const other = refs.current[1 - active];
    if (!cur) return undefined;
    cur.muted = true;
    cur.defaultMuted = true;
    try {
      cur.currentTime = 0;
    } catch {
      /* not seekable yet */
    }

    let done = false;
    const events = ["pointerdown", "touchstart", "scroll"];
    const removeInteraction = () => events.forEach((e) => window.removeEventListener(e, kick));
    function kick() {
      if (done) return;
      const p = cur.play();
      if (p && p.then) {
        p.then(() => {
          done = true;
          removeInteraction();
        }).catch(() => {});
      }
    }
    kick();
    cur.addEventListener("canplay", kick);
    document.addEventListener("visibilitychange", kick);
    events.forEach((e) => window.addEventListener(e, kick, { passive: true }));

    // once the fade has finished, park the clip that just left the stage
    const park = setTimeout(() => {
      if (other) other.pause();
    }, 800);

    return () => {
      clearTimeout(park);
      cur.removeEventListener("canplay", kick);
      document.removeEventListener("visibilitychange", kick);
      removeInteraction();
    };
  }, [active, still]);

  if (still) {
    return (
      <img
        src={MOBILE_CLIPS[0].poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      {MOBILE_CLIPS.map((clip, i) => (
        <video
          key={clip.src}
          ref={(el) => (refs.current[i] = el)}
          className={`absolute inset-0 h-full w-full object-cover object-[50%_18%] transition-opacity duration-700 ${
            active === i ? "opacity-100" : "opacity-0"
          }`}
          src={clip.src}
          poster={clip.poster}
          autoPlay={i === 0}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onEnded={() => active === i && setActive(1 - i)}
          onError={onFail}
        />
      ))}
      {/* which film is playing */}
      <div className="absolute right-5 top-28 z-10 flex flex-col items-end gap-2" aria-hidden="true">
        <span
          key={active}
          className="animate-fade-up text-[10px] uppercase tracking-[0.28em] text-gold-soft"
        >
          {MOBILE_CLIPS[active].label}
        </span>
        <span className="flex gap-1.5">
          {MOBILE_CLIPS.map((c, i) => (
            <span
              key={c.label}
              className={`h-[2px] w-6 transition-colors duration-500 ${
                active === i ? "bg-gold-soft" : "bg-alabaster/25"
              }`}
            />
          ))}
        </span>
      </div>
    </>
  );
}

/** Picks the right film for the screen: portrait playlist on phones, landscape film elsewhere. */
function HeroBackdrop() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mobileFailed, setMobileFailed] = useState(false);
  if (isMobile && !mobileFailed) return <MobileHeroVideos onFail={() => setMobileFailed(true)} />;
  return <HeroVideo />;
}

function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-ink md:min-h-[88vh]">
      {/* Fallback backdrop — shows if the video and poster both fail. */}
      <div className="absolute inset-x-0 top-0 h-[58vh] bg-[radial-gradient(120%_90%_at_78%_18%,#4a3f36_0%,#2a2521_45%,#191612_100%)] md:inset-0 md:h-auto" />

      {/* Phones: the film gets its own clear area at the top; desktop: full-bleed behind the copy */}
      <div className="absolute inset-x-0 top-0 h-[58vh] md:inset-0 md:h-auto">
        <HeroBackdrop />
      </div>

      {/* Desktop: darken toward the bottom-left where the copy sits */}
      <div className="absolute inset-0 hidden bg-gradient-to-tr from-ink via-ink/70 to-ink/25 md:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-t from-ink via-transparent to-ink/40 md:block" />
      {/* Phones: soft fade from the film into the ink panel behind the copy, plus a header scrim */}
      <div className="absolute inset-x-0 top-0 h-[58vh] bg-gradient-to-t from-ink via-ink/25 via-[28%] to-transparent md:hidden" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/55 to-transparent md:hidden" />
      <div className="absolute -right-24 top-10 hidden h-[520px] w-[520px] rounded-full bg-gold/15 blur-[120px] md:block" />

      <div className="container-lux relative flex flex-col justify-end pb-16 pt-[50vh] text-alabaster md:min-h-[88vh] md:pb-20 md:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-[11px] uppercase tracking-eyebrow text-gold-soft"
        >
          Est. in the tradition of the parfumeur
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="mt-4 max-w-2xl text-4xl leading-[1.06] md:text-6xl"
        >
          Fragrance, composed slowly and worn close to the skin.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
          className="mt-6 max-w-md text-sm font-light leading-relaxed text-alabaster/85"
        >
          Small-batch perfumes and pure attars built from rare naturals —
          agarwood, Ta'if rose, Haitian vetiver — and rested until they bloom.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link
            to="/products"
            className="btn bg-alabaster px-9 py-4 text-ink hover:bg-gold hover:text-white"
          >
            Shop the collection
          </Link>
          <Link
            to="/products?type=attar"
            className="btn border border-alabaster/40 px-9 py-4 text-alabaster hover:bg-alabaster hover:text-ink"
          >
            Discover attars
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Agarwood", "Ta'if Rose", "Haitian Vetiver", "Ambergris", "Frankincense", "Sambac Jasmine"];
  return (
    <div className="overflow-hidden border-y border-line bg-alabaster py-4">
      <div className="flex whitespace-nowrap [animation:marquee_28s_linear_infinite]">
        {[...words, ...words, ...words].map((w, i) => (
          <span
            key={i}
            className="mx-6 font-serif text-lg italic text-muted/80"
          >
            {w} <span className="mx-3 text-gold">·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}`}</style>
    </div>
  );
}

function CategorySplit() {
  const cards = [
    {
      to: "/products?type=perfume",
      kicker: "Eau de Parfum",
      title: "Perfumes",
      copy: "20–100 ml sprays with 18–24% concentration. Built to project, then settle.",
      img: "https://images.pexels.com/photos/15096784/pexels-photo-15096784.jpeg?auto=compress&cs=tinysrgb&w=1200",
      position: "object-[38%_50%]",
    },
    {
      to: "/products?type=attar",
      kicker: "Concentrated oil",
      title: "Attars",
      copy: "Alcohol-free oils in 3–25 ml. A single dab lasts the day and warms with your skin.",
      img: "https://images.pexels.com/photos/5790458/pexels-photo-5790458.jpeg?auto=compress&cs=tinysrgb&w=1200",
      position: "object-center",
    },
  ];
  return (
    <section className="container-lux grid gap-6 py-20 md:grid-cols-2 md:py-28">
      {cards.map((c, i) => (
        <Reveal key={c.title} delay={i * 0.08}>
          <Link to={c.to} className="group relative block overflow-hidden">
            <div className="aspect-[3/2] bg-[#241f1c]">
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                className={`h-full w-full object-cover ${c.position} transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]`}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10 p-8 text-alabaster">
              <p className="text-[10px] uppercase tracking-eyebrow text-gold-soft">{c.kicker}</p>
              <h3 className="mt-1 text-3xl">{c.title}</h3>
              <p className="mt-2 max-w-xs text-xs font-light leading-relaxed text-alabaster/85">
                {c.copy}
              </p>
              <span className="mt-4 text-[11px] uppercase tracking-[0.18em] link-underline w-fit">
                Browse {c.title}
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}

function Story() {
  return (
    <section id="story" className="border-y border-line bg-[#f1ece0]">
      <div className="container-lux grid items-center gap-14 py-20 md:grid-cols-2 md:py-28">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-[#241f1c]">
            <img
              src="https://images.pexels.com/photos/8450107/pexels-photo-8450107.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="A perfumer dosing amber oil into small vials of botanicals by hand"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <p className="absolute bottom-8 left-8 right-8 font-serif text-2xl italic text-alabaster">
              "Nothing ships until the accord speaks with one voice."
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">The House</p>
          <h2 className="mt-3 text-3xl md:text-4xl">
            A bench, a set of scales, and a great deal of patience
          </h2>
          <div className="rule mt-5" />
          <p className="mt-6 text-sm font-light leading-[1.9] text-muted">
            Al Özhan began with a single formula reworked over two years. We still
            compose that way — by hand, in batches small enough to weigh on a jeweller's
            scale, with naturals sourced from growers we can name.
          </p>
          <p className="mt-4 text-sm font-light leading-[1.9] text-muted">
            Every batch is macerated for weeks so the raw edges soften and the
            composition speaks with one voice. Nothing ships until it does.
          </p>
          <Link to="/products" className="mt-8 inline-block btn-outline">
            Meet the fragrances
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Craft() {
  const steps = [
    { icon: Leaf, title: "Sourced", copy: "Naturals bought direct — oud from Cambodia, rose from Ta'if, vetiver from Haiti." },
    { icon: FlaskConical, title: "Composed", copy: "Weighed and blended by hand in batches of a few hundred millilitres." },
    { icon: Sparkles, title: "Rested", copy: "Macerated 3–6 weeks so the accord rounds out and holds together." },
    { icon: Package, title: "Bottled", copy: "Filled, sealed and packed with a set of samples to try before you commit." },
  ];
  return (
    <section id="atelier" className="container-lux py-20 md:py-28">
      <Reveal className="max-w-xl">
        <p className="eyebrow">From bench to box</p>
        <h2 className="mt-3 text-3xl md:text-4xl">How a bottle is made</h2>
        <div className="rule mt-5" />
      </Reveal>
      <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06} className="bg-alabaster p-8">
            <s.icon size={22} strokeWidth={1.4} className="text-gold" />
            <p className="mt-5 text-[10px] uppercase tracking-eyebrow text-muted">
              Step {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 text-xl">{s.title}</h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-muted">{s.copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const settings = useSettings();
  return (
    <section className="bg-ink text-alabaster">
      <div className="container-lux grid gap-8 py-16 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <p className="text-[11px] uppercase tracking-eyebrow text-gold-soft">The list</p>
          <h2 className="mt-3 text-3xl md:text-4xl">First to know, first to sample</h2>
          <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-alabaster/80">
            New releases, restocks and the occasional note from the bench.
            {settings.freeShippingThreshold
              ? ` Free shipping over ${settings.currencySymbol}${settings.freeShippingThreshold.toLocaleString("en-IN")}.`
              : ""}
          </p>
        </div>
        <form
          className="flex gap-0 border-b border-alabaster/40"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full bg-transparent py-3 text-sm text-alabaster placeholder:text-alabaster/50 focus:outline-none"
          />
          <button className="btn px-6 text-alabaster hover:text-gold-soft">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedCollection />
      <CategorySplit />
      <Story />
      <Craft />
      <Newsletter />
      <Contact embedded />
    </>
  );
}
