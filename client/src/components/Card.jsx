import React from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'

const cards = [
  {
    title: 'Email Us',
    description: 'dornee@gmail.com',
    aos: 'flip-left',
  },
  {
    title: 'Visit Us',
    description: 'Kanda, Accra - Ghana',
    aos: 'flip-left',
  },
  {
    title: 'Contact Us',
    description: '+233 XXX XXX XXX',
    aos: 'flip-right',
  },
]

const Card = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-16 mt-10">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white border-2 border-[#BB0545] rounded-lg shadow-md p-6 text-gray-800 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          data-aos={card.aos}
          data-aos-duration="1000"
        >
          <h3 className="text-xl font-semibold mb-4 text-[#BB0545]">{card.title}</h3>
          <p className="text-gray-600 mb-6">{card.description}</p>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#BB0545]">
              <Mail size={16} className="text-white" />
            </span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#BB0545]">
              <MapPin size={16} className="text-white" />
            </span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#BB0545]">
              <Phone size={16} className="text-white" />
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Card