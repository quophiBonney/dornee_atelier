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
  FiCalendar,
  FiMapPin,
  FiVideo,
} from "react-icons/fi";
import { createAppointment } from "../store/slices/appointmentSlice";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const CURRENCY = "GHS";

const SERVICE_FEES = {
  "Kente Dress": 500,
  "Arewa Dress": 500,
  "Bridal Gowns": 500,
  "Ready To Wear": 500,
  "Cocktail Dress": 500,
  "Evening Dress": 500,
};

const APPOINTMENT_MODES = [
  { value: "walk-in", label: "Walk-in", icon: FiMapPin },
  { value: "virtual", label: "Virtual", icon: FiVideo },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "Custom Design",
  date: null,
  appointmentMode: "",
  notes: "",
};

const fieldClasses =
  "w-full border-0 border-b border-[#201C1D]/20 bg-transparent pb-2 text-[#201C1D] placeholder:text-[#201C1D]/30 focus:border-[#7A2334] focus:outline-none focus:ring-0 transition-colors text-base";

const labelClasses =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#201C1D]/55";

// menuPortalTarget + menuPosition="fixed" send the dropdown to <body>,
// so it's never clipped by the modal's overflow-y-auto and always
// renders above everything else (z-index bumped via menuPortal below).
const customSelectStyles = {
  control: (base) => ({
    ...base,
    border: "none",
    borderBottom: "1px solid rgba(32, 28, 29, 0.2)",
    borderRadius: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
    paddingBottom: "2px",
    "&:hover": {
      borderBottomColor: "rgba(32, 28, 29, 0.4)",
    },
    "&:focus-within": {
      borderBottomColor: "#7A2334",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "rgba(32, 28, 29, 0.4)",
    padding: "0 4px",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? "#7A2334"
      : isFocused
        ? "rgba(122, 35, 52, 0.1)"
        : "transparent",
    color: isSelected ? "#F3EFE7" : "#201C1D",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: isSelected ? "#7A2334" : "rgba(122, 35, 52, 0.1)",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "#201C1D",
  }),
  placeholder: (base) => ({
    ...base,
    color: "rgba(32, 28, 29, 0.3)",
  }),
};

const datePickerCustomStyles = `
  .react-datepicker {
    font-family: inherit;
    border-color: #201C1D20;
    border-radius: 4px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  }
  .react-datepicker-popper {
    z-index: 9999;
  }
  .react-datepicker__header {
    background-color: #F3EFE7;
    border-bottom-color: #201C1D20;
    padding-top: 16px;
  }
  .react-datepicker__current-month {
    color: #201C1D;
    font-weight: 500;
    font-family: 'Fraunces', serif;
    font-size: 16px;
  }
  .react-datepicker__day-name {
    color: #201C1D80;
    font-weight: 400;
    font-size: 12px;
    text-transform: uppercase;
  }
  .react-datepicker__day {
    color: #201C1D;
    font-size: 14px;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .react-datepicker__day:hover {
    background-color: rgba(122, 35, 52, 0.1);
    border-radius: 4px;
  }
  .react-datepicker__day--selected {
    background-color: #7A2334 !important;
    color: #F3EFE7 !important;
    border-radius: 4px;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: rgba(122, 35, 52, 0.2);
    border-radius: 4px;
  }
  .react-datepicker__day--disabled {
    color: #201C1D30 !important;
    cursor: not-allowed;
  }
  .react-datepicker__day--outside-month {
    color: #201C1D20;
  }
  .react-datepicker__navigation {
    top: 14px;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #201C1D60;
  }
  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: #7A2334;
  }
`;

export default function BookingModal({ open, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const checkRef = useRef(null);
  const dispatch = useDispatch();
  const { loading: appointmentLoading } = useSelector(
    (state) => state.appointment,
  );

  const [step, setStep] = useState("form");
  const [form, setForm] = useState(INITIAL_FORM);
  const [paystackReady, setPaystackReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [reference, setReference] = useState(null);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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

  useGSAP(() => {
    if (!open || !panelRef.current) return;
    gsap.fromTo(
      panelRef.current.querySelectorAll("[data-field]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power3.out" },
    );
  }, [step]);

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

  function handleServiceSelect(service) {
    setForm((f) => ({ ...f, service }));
  }

  function handleModeSelect(option) {
    setForm((f) => ({ ...f, appointmentMode: option.value }));
  }

  function handleDateChange(date) {
    setForm((f) => ({ ...f, date }));
  }

  function isDateAvailable(date) {
    const day = date.getDay();
    return day === 2 || day === 3 || day === 5; // Tuesday, Wednesday, Friday
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
            display_name: "Appointment Mode",
            variable_name: "appointmentMode",
            value: form.appointmentMode,
          },
          {
            display_name: "Service",
            variable_name: "service",
            value: form.service,
          },
          {
            display_name: "Preferred date",
            variable_name: "preferred_date",
            value: form.date
              ? form.date.toLocaleDateString()
              : "To be confirmed",
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
        dispatch(
          createAppointment({
            ...form,
            date: form.date ? form.date.toISOString() : null,
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
    <>
      <style>{datePickerCustomStyles}</style>
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dornee-booking-title"
        className="fixed inset-0 z-50 hidden items-center justify-center bg-[#0E0C0D]/72 backdrop-blur-sm px-4 py-6 overflow-y-auto"
        onMouseDown={(e) => e.target === overlayRef.current && onClose?.()}
      >
        <div
          ref={panelRef}
          className="relative w-full max-w-2xl my-auto bg-white shadow-2xl rounded-sm overflow-visible max-h-[90vh] overflow-y-auto"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#AA1D23] via-[#A9873F] to-[#AA1D23] z-10" />

          {step !== "success" && (
            <button
              onClick={onClose}
              aria-label="Close booking form"
              className="absolute right-4 sm:right-8 top-4 sm:top-8 z-20 text-[#201C1D]/45 transition-colors hover:text-[#201C1D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AA1D23] rounded-full cursor-pointer p-1 bg-white/80 backdrop-blur-sm sm:bg-transparent"
            >
              <FiX size={22} />
            </button>
          )}

          {step === "form" && (
            <form
              onSubmit={handleDetailsSubmit}
              className="px-4 sm:px-8 py-6 sm:py-10"
            >
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
                className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl leading-tight text-[#201C1D]"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className={labelClasses}>Appointment Mode</label>
                  <Select
                    options={APPOINTMENT_MODES.map((mode) => ({
                      ...mode,
                      label: (
                        <div className="flex items-center gap-2">
                          <mode.icon size={16} />
                          <span>{mode.label}</span>
                        </div>
                      ),
                    }))}
                    value={
                      APPOINTMENT_MODES.find(
                        (mode) => mode.value === form.appointmentMode,
                      ) && {
                        value: form.appointmentMode,
                        label: (
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = APPOINTMENT_MODES.find(
                                (m) => m.value === form.appointmentMode,
                              )?.icon;
                              return Icon ? <Icon size={16} /> : null;
                            })()}
                            <span>
                              {
                                APPOINTMENT_MODES.find(
                                  (m) => m.value === form.appointmentMode,
                                )?.label
                              }
                            </span>
                          </div>
                        ),
                      }
                    }
                    onChange={handleModeSelect}
                    styles={customSelectStyles}
                    placeholder="Select appointment type"
                    isSearchable={false}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    className="text-base"
                  />
                </div>

                <div data-field>
                  <label className={labelClasses}>Service</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(SERVICE_FEES).map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => handleServiceSelect(s)}
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
                  <label className={labelClasses}>Preferred date</label>
                  <div className="relative">
                    <DatePicker
                      selected={form.date}
                      onChange={handleDateChange}
                      filterDate={isDateAvailable}
                      minDate={new Date()}
                      placeholderText="Select a date (Tue, Wed, Fri)"
                      className={`${fieldClasses} pr-10 cursor-pointer`}
                      dateFormat="EEEE, MMMM d, yyyy"
                      wrapperClassName="w-full"
                      showPopperArrow={false}
                      popperPlacement="bottom-start"
                      portalId="dornee-datepicker-portal"
                    />
                    <FiCalendar
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[#201C1D]/40 pointer-events-none"
                      size={18}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-[#201C1D]/40 uppercase tracking-wide">
                    Available: Tuesdays, Wednesdays, and Fridays
                  </p>
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
                disabled={!form.appointmentMode || !form.date}
                className="cursor-pointer mt-5 flex w-full items-center justify-center gap-2 bg-[#AA1D23] py-3.5 font-['Space_Mono'] text-xs uppercase tracking-[0.2em] text-[#F3EFE7] transition-colors hover:bg-[#3A1F26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AA1D23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3EFE7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Booking
                <FiArrowRight size={14} />
              </button>
            </form>
          )}

          {step === "pay" && (
            <div className="px-4 sm:px-8 py-6 sm:py-10">
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
                className="mt-4 font-['Fraunces'] text-2xl sm:text-3xl leading-tight text-[#201C1D]"
              >
                Secure your slot
              </h2>
              <p data-field className="mt-2 text-sm text-[#201C1D]/60">
                A refundable booking fee confirms your reservation and is
                deducted from your final invoice.
              </p>

              <div
                data-field
                className="relative mt-7 rounded-sm border border-[#201C1D]/15 bg-[#F3EFE7] p-4 sm:p-5"
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
                    <dt className="text-[#201C1D]/55">Mode</dt>
                    <dd className="text-[#201C1D] capitalize">
                      {form.appointmentMode}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-[#201C1D]/55">Preferred date</dt>
                    <dd className="text-[#201C1D]">
                      {form.date
                        ? form.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "To be confirmed"}
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

          {step === "success" && (
            <div className="flex flex-col items-center px-4 sm:px-8 py-12 sm:py-16 text-center">
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
              <p className="mt-2 max-w-xs text-sm text-[#201C1D]/60 px-4">
                Thank you, {form.name?.split(" ")[0] || "there"}. Your booking
                fee has been received and your fitting is reserved. Our studio
                team will reach out shortly with the details.
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
    </>
  );
}
