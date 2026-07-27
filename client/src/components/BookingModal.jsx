import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  FiX,
  FiArrowLeft,
  FiArrowRight,
  FiLoader,
  FiLock,
} from "react-icons/fi";
import { createAppointment } from "../store/slices/appointmentSlice";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const CURRENCY = "GHS";

const SERVICE_FEES = {
  "Custom Design": 250,
  "Fitting Consultation": 80,
  "Personal Styling": 150,
  Alterations: 50,
};

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "Custom Design",
  date: "",
  notes: "",
};

const fieldClasses =
  "w-full border-0 border-b border-[#201C1D]/20 bg-transparent pb-2 text-[#201C1D] placeholder:text-[#201C1D]/30 focus:border-[#7A2334] focus:outline-none focus:ring-0 transition-colors";

const labelClasses =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#201C1D]/55";

export default function BookingModal({ open, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const checkRef = useRef(null);
  const dispatch = useDispatch();
  const { loading: appointmentLoading } = useSelector(
    (state) => state.appointment,
  );

  const [step, setStep] = useState("form"); // "form" | "pay" | "success"
  const [form, setForm] = useState(INITIAL_FORM);
  const [paystackReady, setPaystackReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [reference, setReference] = useState(null);

  // Load Paystack Inline once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.PaystackPop) {
      setPaystackReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackReady(true);
    document.body.appendChild(script);
  }, []);

  // Reset internal state whenever the modal is closed
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("form");
        setForm(INITIAL_FORM);
        setPaying(false);
        setReference(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Open / close choreography
  useGSAP(() => {
    if (!overlayRef.current || !panelRef.current) return;

    if (open) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.set(overlayRef.current, { display: "flex" })
        .fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
        )
        .fromTo(
          panelRef.current,
          { opacity: 0, y: 28, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45 },
          "-=0.15",
        )
        .fromTo(
          panelRef.current.querySelectorAll("[data-field]"),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.045 },
          "-=0.2",
        );
    } else {
      document.body.style.overflow = "";
      gsap.to(panelRef.current, {
        opacity: 0,
        y: 16,
        scale: 0.98,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        delay: 0.05,
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
    }
  }, [open]);

  // Re-stagger fields whenever the step changes (form -> pay -> success)
  useGSAP(() => {
    if (!open || !panelRef.current) return;
    gsap.fromTo(
      panelRef.current.querySelectorAll("[data-field]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power3.out" },
    );
  }, [step]);

  // Draw the success checkmark
  useGSAP(() => {
    if (step !== "success" || !checkRef.current) return;
    const path = checkRef.current;
    const length = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.6, ease: "power2.out", delay: 0.15 },
    );
  }, [step]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleDetailsSubmit(e) {
    e.preventDefault();
    setStep("pay");
  }

  function handlePayment() {
    if (!window.PaystackPop || paying) return;
    setPaying(true);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: SERVICE_FEES[form.service] * 100,
      currency: CURRENCY,
      ref: `DORNEE-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Full name",
            variable_name: "full_name",
            value: form.name,
          },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
          {
            display_name: "Service",
            variable_name: "service",
            value: form.service,
          },
          {
            display_name: "Preferred date",
            variable_name: "preferred_date",
            value: form.date,
          },
          {
            display_name: "Notes",
            variable_name: "notes",
            value: form.notes || "—",
          },
        ],
      },
      callback: (response) => {
        setPaying(false);
        setReference(response.reference);
        // Persist appointment to the database via Redux thunk
        dispatch(
          createAppointment({
            ...form,
            reference: response.reference,
            amount: SERVICE_FEES[form.service],
          }),
        );
        setStep("success");
      },
      onClose: () => {
        setPaying(false);
      },
    });

    handler.openIframe();
  }

  const fee = SERVICE_FEES[form.service];

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dornee-booking-title"
      className="fixed inset-0 z-50 hidden items-center justify-center bg-[#0E0C0D]/72 backdrop-blur-sm px-4 py-8 overflow-y-scroll"
      onMouseDown={(e) => e.target === overlayRef.current && onClose?.()}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl overflow-hidden rounded-sm mt-36 md:mt-20 mb-10 bg-white shadow-2xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#AA1D23] via-[#A9873F] to-[#AA1D23]" />

        {step !== "success" && (
          <button
            onClick={onClose}
            aria-label="Close booking form"
            className="absolute right-8 top-8 z-10 text-[#201C1D]/45 transition-colors hover:text-[#201C1D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AA1D23] rounded-full cursor-pointer"
          >
            <FiX size={22} />
          </button>
        )}
        {step === "form" && (
          <form onSubmit={handleDetailsSubmit} className="px-8 py-10 sm:px-10">
            <div data-field className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#7A2334] font-['Fraunces'] text-[11px] italic text-[#7A2334]">
                D
              </span>
              <p className="font-['Space_Mono'] text-[11px] uppercase tracking-[0.25em] text-[#7A2334]">
                Atelier Booking
              </p>
            </div>
            <h2
              id="dornee-booking-title"
              data-field
              className="mt-3 font-['Fraunces'] text-3xl leading-tight text-[#201C1D]"
            >
              Reserve your consultation
            </h2>
            <p data-field className="mt-2 text-sm text-[#201C1D]/60">
              Tell us a little about you — we'll follow up within one business
              day to confirm your fitting.
            </p>

            <div className="mt-7 space-y-5">
              <div data-field>
                <label htmlFor="name" className={labelClasses}>
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ama Owusu"
                  className={fieldClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div data-field>
                  <label htmlFor="email" className={labelClasses}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className={fieldClasses}
                  />
                </div>
                <div data-field>
                  <label htmlFor="phone" className={labelClasses}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="024 000 0000"
                    className={fieldClasses}
                  />
                </div>
              </div>

              <div data-field>
                <label className={labelClasses}>Service</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(SERVICE_FEES).map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, service: s }))}
                      className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                        form.service === s
                          ? "border-[#7A2334] bg-[#7A2334] text-[#F3EFE7]"
                          : "border-[#201C1D]/20 text-[#201C1D]/70 hover:border-[#7A2334]/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div data-field>
                <label htmlFor="date" className={labelClasses}>
                  Preferred date
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={fieldClasses}
                />
              </div>

              <div data-field>
                <label htmlFor="notes" className={labelClasses}>
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Occasion, fabric preferences, inspiration…"
                  className={`resize-none ${fieldClasses}`}
                />
              </div>
            </div>

            <button
              data-field
              type="submit"
              className="cursor-pointer mt-5 flex w-full items-center justify-center gap-2 bg-[#AA1D23] py-3.5 font-['Space_Mono'] text-xs uppercase tracking-[0.2em] text-[#F3EFE7] transition-colors hover:bg-[#3A1F26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AA1D23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EFE7]"
            >
              Complete Booking
              <FiArrowRight size={14} />
            </button>
          </form>
        )}

        {/* ---------------------------------------------------------- */}
        {/* STEP 2 — booking fee / Paystack                              */}
        {/* ---------------------------------------------------------- */}
        {step === "pay" && (
          <div className="px-8 py-10 sm:px-10">
            <button
              data-field
              type="button"
              onClick={() => setStep("form")}
              className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#201C1D]/50 hover:text-[#201C1D]"
            >
              <FiArrowLeft size={13} /> Edit details
            </button>

            <h2
              data-field
              className="mt-4 font-['Fraunces'] text-3xl leading-tight text-[#201C1D]"
            >
              Secure your slot
            </h2>
            <p data-field className="mt-2 text-sm text-[#201C1D]/60">
              A refundable booking fee confirms your reservation and is deducted
              from your final invoice.
            </p>

            <div
              data-field
              className="relative mt-7 rounded-sm border border-[#201C1D]/15 bg-[#F3EFE7] p-5"
            >
              <div className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#0E0C0D]/72" />
              <div className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#0E0C0D]/72" />

              <dl className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[#201C1D]/55">Client</dt>
                  <dd className="text-[#201C1D]">{form.name || "—"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#201C1D]/55">Service</dt>
                  <dd className="text-[#201C1D]">{form.service}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#201C1D]/55">Preferred date</dt>
                  <dd className="text-[#201C1D]">
                    {form.date || "To be confirmed"}
                  </dd>
                </div>
              </dl>

              <div className="my-4 border-t border-dashed border-[#201C1D]/25" />

              <div className="flex items-center justify-between">
                <span className="font-['Space_Mono'] text-[11px] uppercase tracking-[0.2em] text-[#201C1D]/55">
                  Booking fee
                </span>
                <span className="font-['Fraunces'] text-2xl text-[#7A2334]">
                  ₵{fee.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              data-field
              type="button"
              disabled={!paystackReady || paying}
              onClick={handlePayment}
              className="mt-7 flex w-full items-center justify-center gap-2 bg-[#7A2334] py-3.5 font-['Space_Mono'] text-xs uppercase tracking-[0.2em] text-[#F3EFE7] transition-colors hover:bg-[#5E1A28] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#201C1D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EFE7]"
            >
              {paying ? (
                <>
                  <FiLoader size={14} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <FiLock size={13} />
                  {paystackReady
                    ? `Pay ₵${fee.toLocaleString()} with Paystack`
                    : "Loading payment…"}
                </>
              )}
            </button>

            <p
              data-field
              className="mt-3 text-center text-[10px] uppercase tracking-[0.15em] text-[#201C1D]/40"
            >
              Secured by Paystack · cards, mobile money &amp; bank transfer
            </p>
          </div>
        )}

        {/* ---------------------------------------------------------- */}
        {/* STEP 3 — confirmation                                       */}
        {/* ---------------------------------------------------------- */}
        {step === "success" && (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              className="mb-5"
            >
              <circle
                cx="28"
                cy="28"
                r="27"
                stroke="#3F6B52"
                strokeWidth="1.5"
              />
              <path
                ref={checkRef}
                d="M17 29L24.5 36.5L39.5 20"
                stroke="#3F6B52"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <h3 className="font-['Fraunces'] text-2xl text-[#201C1D]">
              Booking confirmed
            </h3>
            <p className="mt-2 max-w-xs text-sm text-[#201C1D]/60">
              Thank you, {form.name.split(" ")[0] || "there"}. Your booking fee
              has been received and your fitting is reserved. Our studio team
              will reach out shortly with the details.
            </p>
            {reference && (
              <p className="mt-4 font-['Space_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#201C1D]/40">
                Ref · {reference}
              </p>
            )}
            <button
              onClick={onClose}
              className="mt-8 font-['Space_Mono'] text-xs uppercase tracking-[0.2em] text-[#201C1D] underline decoration-[#7A2334] underline-offset-4 hover:text-[#7A2334]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
