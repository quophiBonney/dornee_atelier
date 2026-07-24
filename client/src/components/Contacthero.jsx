import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ContactHero() {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-eyebrow]",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 },
      )
        .fromTo(
          "[data-line]",
          { opacity: 0, y: "100%" },
          { opacity: 1, y: "0%", duration: 0.8, stagger: 0.1 },
          "-=0.2",
        )
        .fromTo(
          "[data-sub]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.35",
        )
        .fromTo(
          "[data-scrollcue]",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2",
        );

      // Ambient scroll-cue drift, loops indefinitely
      gsap.to("[data-scrollcue-dot]", {
        y: 10,
        duration: 1.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden bg-[#1C1A1B] px-6 py-28"
    >
      {/* Faint garment outline, ambient background detail */}
      <svg
        viewBox="0 0 400 520"
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[560px] w-[420px] -translate-y-1/2 opacity-[0.06] lg:block"
        fill="none"
      >
        <path
          d="M200 40c-28 0-48 20-48 44 0 12 4 20 4 20l-76 36 20 68 48-20v260h104V188l48 20 20-68-76-36s4-8 4-20c0-24-20-44-48-44z"
          stroke="#F6F1EA"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <div className="relative mx-auto w-full max-w-5xl">
        <p
          data-eyebrow
          className="font-['Space_Mono'] text-[11px] uppercase tracking-[0.3em] text-[#B76E79]"
        >
          Get in Touch
        </p>

        <h1 className="mt-6 font-['Fraunces'] text-[15vw] leading-[0.92] text-[#F6F1EA] sm:text-[8rem] lg:text-[7.5rem]">
          {["Contact Us"].map((line) => (
            <span key={line} className="block overflow-hidden">
              <span data-line className="block">
                {line.split(" ").map((word, i) => (
                  <span key={i}>{word}&nbsp;</span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-sub
          className="mt-8 max-w-lg text-[15px] leading-relaxed text-[#F6F1EA]/60"
        >
          Have a question about an order, a custom piece, or a collaboration?
          Reach out below and our team in Accra will get back to you within one
          business day.
        </p>
      </div>

      <div
        data-scrollcue
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#F6F1EA]/40">
          Scroll
        </span>
        <span className="flex h-8 w-5 justify-center rounded-full border border-[#F6F1EA]/25 pt-1.5">
          <span
            data-scrollcue-dot
            className="h-1.5 w-1.5 rounded-full bg-[#B76E79]"
          />
        </span>
      </div>
    </section>
  );
}
