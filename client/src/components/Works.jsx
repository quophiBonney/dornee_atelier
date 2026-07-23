import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import d11 from "../assets/d11.jpg";
import d5 from "../assets/d5.jpg";
import d6 from "../assets/d6.jpg";
import d14 from "../assets/d14.jpg";
const places = [
  {
    name: "Fashion one",
    image: d11,
  },
  {
    name: "Fashion two",
    image: d5,
  },
  {
    name: "Fashion three",
    image: d6,
  },
  {
    name: "Fashion four",
    image: d14,
  },
  {
    name: "Cooked Food",
    image: d11,
  },
  {
    name: "Our Night Life",
    image: d11,
  },
  {
    name: "Cape Town",
    image: d11,
  },
  {
    name: "Party With Us",
    image: d11,
  },
];

const Works = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openPreview = (index) => {
    setSelectedIndex(index);
  };

  const closePreview = () => {
    setSelectedIndex(null);
  };

  const goNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === places.length - 1 ? 0 : prev + 1));
  };

  const goPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === 0 ? places.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedIndex === null) return;

      if (event.key === "Escape") closePreview();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <section className="bg-[#17110C] overflow-hidden px-5 py-20 lg:px-16 xl:px-20">
      <div className="w-full">
        <div className="mb-14 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-white">
            Discover
          </span>

          <h2 className="font-serif mt-4 text-4xl font-bold text-white 00 md:text-5xl lg:text-6xl">
            Explore Our Gallery
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-white lg:text-xl">
            Discover breathtaking moments, resources and facilities at the
            highest peak of your comfort.
          </p>
        </div>

        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          speed={1000}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 180,
            modifier: 2,
            scale: 0.9,
            slideShadows: false,
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1080: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 2,
              spaceBetween: 50,
            },
          }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="beauty-swiper"
        >
          {places.map((place, index) => (
            <SwiperSlide key={place.name}>
              <div
                onClick={() => openPreview(index)}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg"
              >
                <div className="relative h-[400px] overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white">
                      {place.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/80">
                      Click to preview
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-8 flex items-center justify-center gap-6">
          <button className="custom-prev flex h-14 w-14 items-center justify-center rounded-full border border-white text-xl transition-all duration-300 bg-white text-[#A11C1A]">
            <FaArrowLeft />
          </button>
          <button className="custom-next flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 text-xl transition-all duration-300 bg-white text-[#A11C1A]">
            <FaArrowRight />
          </button>
        </div>
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-7xl">
            <button
              onClick={closePreview}
              className="cursor-pointer absolute right-3 top-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white backdrop-blur-md transition hover:bg-white/20"
              aria-label="Close preview"
            >
              ✕
            </button>

            <div className="relative overflow-hidden rounded-3xl bg-black shadow-2xl">
              <div className="relative h-[75vh] w-full">
                <img
                  src={places[selectedIndex].image}
                  alt={places[selectedIndex].name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <h3 className="text-3xl font-bold text-white sm:text-5xl">
                    {places[selectedIndex].name}
                  </h3>
                  <p className="mt-3 max-w-2xl text-white/80">
                    Full image preview with easy navigation through all slides.
                  </p>
                </div>

                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6 cursor-pointer"
                  aria-label="Previous image"
                >
                  ←
                </button>

                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-6 cursor-pointer"
                  aria-label="Next image"
                >
                  →
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto bg-black/90 p-4">
                {places.map((place, index) => (
                  <button
                    key={`${place.name}-mini`}
                    onClick={() => setSelectedIndex(index)}
                    className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      selectedIndex === index
                        ? "border-white scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={place.image}
                      alt={`${place.name} preview`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                    <span className="absolute bottom-1 left-2 right-2 truncate text-left text-xs font-semibold text-white">
                      {place.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Works;
