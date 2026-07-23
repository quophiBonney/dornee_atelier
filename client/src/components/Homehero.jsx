import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Parallax, EffectCreative } from "swiper/modules";
import d8 from "../assets/d5.jpg";
import d1 from "../assets/d1.jpg";
import d16 from "../assets/d16.jpg";
import d4 from "../assets/d11.jpg";

const slides = [
  {
    image: d1,
    badge: "Luxury Stays",
    title: "Discover the Extraordinary",
    text: "A premium escape designed to feel elegant, calm, and unforgettable.",
    focal: "80% 20%",
  },
  {
    image: d8,
    badge: "Attention Stealing",
    title: "Chic Style, Bold Presence",
    text: "Welcome to Dornee Atelier. Explore our collection and discover something special.",
    focal: "10% 10%",
  },
  {
    image: d16,
    badge: "Elegant Design",
    title: "Escape to Paradise",
    text: "Soft motion, rich atmosphere, and a bold visual story from the first glance.",
    focal: "80% 20%",
  },
  {
    image: d4,
    badge: "Premium Vibe",
    title: "Paradise Starts Here",
    text: "A hero section that moves with depth, elegance, and serious presence.",
    focal: "80% 20%",
  },
];

const Homehero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const swiperRef = useRef(null);

  // Store swiper instance and update navigation when elements become available
  const onSwiper = (swiper) => {
    swiperRef.current = swiper;
  };

  // Whenever prevEl or nextEl changes, (re)initialize the navigation
  useEffect(() => {
    if (swiperRef.current && prevEl && nextEl) {
      const swiper = swiperRef.current;
      swiper.params.navigation.prevEl = prevEl;
      swiper.params.navigation.nextEl = nextEl;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [prevEl, nextEl]);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black lg:h-screen">
      <Swiper
        modules={[Autoplay, Navigation, Parallax, EffectCreative]}
        slidesPerView={1}
        loop
        loopAdditionalSlides={slides.length}
        speed={1400}
        effect="creative"
        creativeEffect={{
          prev: { shadow: true, translate: ["-18%", 0, -1], opacity: 0.4 },
          next: { translate: ["100%", 0, 0] },
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        parallax
        onSwiper={onSwiper}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <SwiperSlide key={`${slide.title}-${index}`}>
              <div className="relative h-full w-full overflow-hidden">
                <div className="absolute inset-0 -right-36 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{ objectPosition: slide.focal }}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.06),_transparent_50%)]" />

                <div className="mt-10 lg:mt-24 relative z-10 flex h-full items-end pb-24 lg:items-center lg:pb-0">
                  <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
                    <div className="max-w-3xl text-white">
                      <div
                        className="flex items-center gap-4"
                        data-swiper-parallax="-300"
                        data-swiper-parallax-opacity="0"
                      >
                        <span className="font-mono text-sm text-white/50">
                          0{index + 1}
                        </span>
                        <span className="h-px w-10 bg-amber-300/70" />
                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                          {slide.badge}
                        </span>
                      </div>

                      <h1
                        className="font-serif mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:7text-xl"
                        data-swiper-parallax="-500"
                      >
                        {slide.title}
                      </h1>

                      <p
                        className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg lg:text-xl"
                        data-swiper-parallax="-650"
                      >
                        {slide.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom nav arrows – use callback refs to notify when they mount */}
      {/* <button
        ref={(el) => setPrevEl(el)}
        aria-label="Previous slide"
        className="group absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/10 sm:flex lg:left-8"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">
          ←
        </span>
      </button> */}
      {/* <button
        ref={(el) => setNextEl(el)}
        aria-label="Next slide"
        className="group absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/10 sm:flex lg:right-8"
      >
        <span className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </button> */}

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className="h-[3px] overflow-hidden rounded-full bg-white/20"
            style={{ width: activeIndex === index ? "40px" : "16px" }}
          >
            <div
              className={`h-full bg-amber-300 transition-all ${
                activeIndex === index
                  ? "w-full duration-[6000ms] ease-linear"
                  : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default Homehero;
