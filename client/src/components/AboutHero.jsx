import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set("[data-brand], [data-menu], [data-title], [data-sub]", {
          opacity: 1,
          y: 0,
          clearProps: "transform",
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-brand]",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 },
      )
        .fromTo(
          "[data-menu]",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          "[data-title]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.1",
        )
        .fromTo(
          "[data-sub]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4",
        );
    },
    { scope: heroRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={heroRef} className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__body text-white max-w-5xl m-auto">
        <h1
          data-title
          className="font-serif mt-6 text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-5xl mb-4"
        >
          We design it your way
        </h1>

        <div data-sub className="hero__sub">
          <p>
            Explore our premium collection of ready-to-wear and made-to-order
            pieces, featuring tailored dresses, statement outerwear, and
            everyday essentials. Every piece is drafted, cut, and finished
            in-house — built to fit the way you actually move through your day.
          </p>
          <p>Shop the current collection, made in Accra.</p>
        </div>
      </div>
    </section>
  );
}
