import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookingModal from "./BookingModal";
import img1 from "../assets/erasebg.png";
gsap.registerPlugin(ScrollTrigger);
export default function DorneeHomeSection() {
  const sectionRef = useRef(null);
  const swatchRef = useRef(null);
  const stitchRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Reveal animation for text elements
        gsap.fromTo(
          "[data-reveal]",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );

        // Gentle floating motion for the swatch card
        gsap.to(swatchRef.current, {
          y: -16,
          rotate: 2,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Stitch line draw
        const path = stitchRef.current;
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-6 mt-10"
    >
      {/* Ambient red glow */}
      <div className="absolute inset-0 opacity-60" />

      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-20" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 relative z-10">
        {/* Copy column */}
        <div>
          <p
            data-reveal
            className="font-mono font-bold text-xs uppercase tracking-[0.3em] text-[#AA1D23]"
          >
            Dornee Atelier - Women Collection
          </p>

          <h2
            data-reveal
            className="mt-5 font-serif text-4xl leading-[1.1] text-gray-900 sm:text-6xl"
          >
            Design, cut,
            <br />
            and fit —<span className="italic text-[#AA1D23]"> for her.</span>
          </h2>

          <p
            data-reveal
            className="mt-6 max-w-md text-base leading-relaxed text-gray-900"
          >
            Dornee is a female‑fashion design studio building considered,
            made‑to‑measure pieces from first sketch to final stitch. Every
            garment starts as a conversation and ends as something only you
            could wear.
          </p>

          <div data-reveal className="mt-10">
            <button
              onClick={() => setModalOpen(true)}
              className="group relative inline-flex items-center font-mono text-xs uppercase tracking-[0.2em] text-[#F5F0EB] cursor-pointer font-extrabold"
            >
              <span className="relative px-8 py-3.5 border bg-[#AA1D23] rounded transition-all duration-300 hover:bg-[#AA1D23] hover:border-[#AA1D23] hover:shadow-[0_0_30px_-5px_#AA1D23]">
                Book Now
              </span>
            </button>
          </div>
        </div>

        {/* Visual column */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative h-[380px] w-full sm:h-[440px] sm:w-[800px]">
            <img src={img1} alt="" className="w-full object-cover" />
          </div>
        </div>
      </div>

      {/* Booking modal */}
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
