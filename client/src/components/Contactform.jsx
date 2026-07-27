import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import contact from "../assets/contact.svg";
import {
  submitContact,
  clearContactSuccess,
} from "../store/slices/contactSlice";

const fieldBase =
  "peer w-full rounded-lg border border-[#E6E2DB] bg-white px-11 py-3.5 text-sm text-[#1C1A1B] outline-none transition-colors placeholder:text-transparent focus:border-[#B76E79]";

const Field = ({ icon: Icon, label, ...props }) => (
  <div className="relative w-full">
    <Icon
      size={17}
      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1A1B]/35 peer-focus:text-[#B76E79]"
    />
    <input {...props} placeholder={label} className={fieldBase} />
    <label
      htmlFor={props.id}
      className="pointer-events-none absolute left-11 top-3.5 origin-left -translate-y-0 text-sm text-[#1C1A1B]/45 transition-all
        peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-[#B76E79]
        peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:scale-90 peer-[&:not(:placeholder-shown)]:text-[#1C1A1B]/60"
    >
      {label}
    </label>
  </div>
);

const Contactform = () => {
  const dispatch = useDispatch();
  const { loading, successMessage } = useSelector((state) => state.contact);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    const result = await dispatch(submitContact(payload));
    if (result.meta.requestStatus === "fulfilled") {
      e.target.reset();
      setSubmitted(true);
    }
  };

  return (
    <section className="overflow-hidden bg-[#FAF8F5] px-4 py-20 lg:px-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          className="hidden lg:block"
        >
          <img src={contact} alt="" className="w-full" />
        </div>

        <div data-aos="fade-left" data-aos-duration="1000">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B76E79]">
            Get in touch
          </p>
          <h3 className="mt-3 font-['Fraunces'] text-3xl leading-tight text-[#1C1A1B] lg:text-4xl">
            Write to Us
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#1C1A1B]/60">
            Tell us about the piece you have in mind — style, occasion, and
            timeline — and our team will follow up within one business day.
          </p>

          {submitted ? (
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#B76E79]/30 bg-[#B76E79]/5 p-5">
              <CheckCircle2
                size={22}
                className="mt-0.5 shrink-0 text-[#B76E79]"
              />
              <div>
                <p className="font-semibold text-[#1C1A1B]">
                  Order request sent
                </p>
                <p className="mt-1 text-sm text-[#1C1A1B]/60">
                  Thank you — we'll reach out shortly to confirm the details.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Field
                  icon={User}
                  label="Your name"
                  type="text"
                  id="name"
                  name="name"
                  required
                />
                <Field
                  icon={Mail}
                  label="Your email"
                  type="email"
                  id="email"
                  name="email"
                  required
                />
              </div>

              <div className="relative">
                <MessageSquare
                  size={17}
                  className="pointer-events-none absolute left-4 top-4 text-[#1C1A1B]/35"
                />
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="What would you like to enquire about?"
                  className="w-full resize-none rounded-lg border border-[#E6E2DB] bg-white py-3.5 pl-11 pr-4 text-sm text-[#1C1A1B] outline-none transition-colors placeholder:text-[#1C1A1B]/40 focus:border-[#B76E79]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#BB0545] py-3.5 text-sm font-semibold text-[#F6F1EA] transition-colors hover:bg-[#B76E79] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#1C1A1B]/45">
                We get back to you at the shortest possible time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contactform;
