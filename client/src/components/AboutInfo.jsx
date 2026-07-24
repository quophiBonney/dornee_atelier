import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import portrait from "../assets/d7.jpg";

export default function AboutInfo() {
  const sectionRef = useRef(null);
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
        gsap.set("[data-image], [data-title], [data-rule], [data-block]", {
          opacity: 1,
          y: 0,
          scaleX: 1,
          clearProps: "transform",
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      tl.fromTo(
        "[data-image]",
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.1 },
      )
        .fromTo(
          "[data-title]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.7",
        )
        .fromTo(
          "[data-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, transformOrigin: "left center" },
          "-=0.3",
        )
        .fromTo(
          "[data-block]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
          "-=0.2",
        );
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="mt-10 flex min-h-screen flex-col bg-white lg:flex-row"
    >
      <div
        data-image
        className="min-h-[55vh] w-full bg-cover bg-top bg-no-repeat lg:min-h-screen lg:w-1/2"
        style={{ backgroundImage: `url(${portrait})` }}
        role="img"
        aria-label="Portrait of a Dornee client"
      />

      <div className="flex w-full flex-col justify-center px-7 py-14 lg:w-1/2 lg:px-24 lg:py-16 lg:pl-18">
        <h2
          data-title
          className="font-['Fraunces'] text-[clamp(1.9rem,3.2vw,2.6rem)] uppercase leading-[1.15] text-[#1C1A1B]"
        >
          Exclusive Clientele of Dornee
        </h2>

        <hr data-rule className="my-7 h-0.5 w-12 border-none bg-[#B76E79]" />

        <div
          data-block
          className="border-t border-[#E6E2DB] py-6 first:border-t-0 first:pt-0"
        >
          <p className="text-[0.98rem] leading-relaxed text-[#2C2A2B]">
            At Dornee, we understand that exceptional style emerges when a
            woman's vision meets the expertise of a dedicated studio.
          </p>
        </div>

        <div data-block className="border-t border-[#E6E2DB] py-6">
          <p className="text-[0.98rem] leading-relaxed text-[#2C2A2B]">
            Our made-to-measure approach brings your unique aspirations to life,
            creating pieces that are both striking and timeless. With meticulous
            attention to detail, we recommend the perfect colors, fabrics, and
            silhouettes that reflect your personality and elevate your wardrobe.
          </p>
        </div>

        <div data-block className="border-t border-[#E6E2DB] py-6">
          <p className="text-[0.98rem] leading-relaxed text-[#2C2A2B]">
            From creatives to founders, style icons, and everyday women, the
            Dornee woman is known for her confidence and ease.
          </p>
        </div>
      </div>
    </section>
  );
}
