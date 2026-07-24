import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const cards = [
  {
    title: "Email Us",
    description: "dornee@gmail.com",
    icon: Mail,
    aos: "flip-left",
  },
  {
    title: "Visit Us",
    description: "Kanda, Accra - Ghana",
    icon: MapPin,
    aos: "flip-left",
  },
  {
    title: "Contact Us",
    description: "+233 XXX XXX XXX",
    icon: Phone,
    aos: "flip-right",
  },
];

const Card = () => {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 mt-10 md:grid-cols-2 lg:grid-cols-3 lg:px-16">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            data-aos={card.aos}
            data-aos-duration="1000"
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#BB0545]/30 hover:shadow-xl"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#BB0545]/10 transition-colors duration-300 group-hover:bg-[#BB0545]">
              <Icon
                size={22}
                className="text-[#BB0545] transition-colors duration-300 group-hover:text-white"
              />
            </span>

            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500">{card.description}</p>

            <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#BB0545] transition-all duration-300 group-hover:w-full" />
          </div>
        );
      })}
    </div>
  );
};

export default Card;
