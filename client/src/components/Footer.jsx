import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaInstagram,
  FaPinterestP,
  FaTiktok,
  FaFacebookF,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// Replace with Dornee's real handles / URLs
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/dornee",
    Icon: FaInstagram,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com/dornee",
    Icon: FaPinterestP,
  },
  { label: "TikTok", href: "https://tiktok.com/@dornee", Icon: FaTiktok },
  { label: "Facebook", href: "https://facebook.com/dornee", Icon: FaFacebookF },
];

const NAV_LINKS = [
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#about" },
  { label: "Atelier", href: "#atelier" },
  { label: "Contact", href: "#contact" },
];

/**
 * DorneeFooter
 * npm i gsap @gsap/react react-icons
 */
export default function Footer() {
  const footerRef = useRef(null);
  const location = useLocation();

  if (
    location.pathname === "/auth/admin/dashboard" ||
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/register"
  ) {
    return null;
  }
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-col]",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              once: true,
            },
          },
        );
      }, footerRef);
      return () => ctx.revert();
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} className="bg-[#070707] px-6 pb-8 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div data-col className="lg:col-span-2">
            <span className="font-['Fraunces'] text-2xl text-[#F6F1EA]">
              Dornee
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#F6F1EA]/55">
              A female-fashion design studio crafting made-to-measure garments —
              from first sketch to final stitch.
            </p>
          </div>

          {/* Nav */}
          <div data-col>
            <p className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#B76E79]">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-[#F6F1EA]/70 transition-colors hover:text-[#F6F1EA]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div data-col>
            <p className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.25em] text-[#B76E79]">
              Follow the studio
            </p>
            <ul className="mt-5 flex gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Dornee on ${label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F6F1EA]/20 text-[#F6F1EA]/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B76E79] hover:text-[#B76E79]"
                  >
                    <Icon size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-col
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#F6F1EA]/10 pt-6 text-xs text-[#F6F1EA]/40 sm:flex-row"
        >
          <span>© {new Date().getFullYear()} Dornee. All rights reserved.</span>
          <span className="font-['Space_Mono'] tracking-[0.15em]">
            MADE TO MEASURE
          </span>
        </div>
      </div>
    </footer>
  );
}
