import React from 'react'
import contact from '../assets/contact.svg'
const Contactform = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mt-10 p-4 overflow-hidden">
        <div data-aos="fade-right" data-aos-duration="1000">
            <img src={contact}/> 
            </div>
            <div data-aos="fade-left" data-aos-duration="1000" className="">
                <h3 className="text-xl lg:text-2xl font-bold">Write to Us</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime in, officiis quae excepturi nesciunt molestiae reprehenderit minus. Nemo, doloremque laborum.</p>
                <form>
              <div className="flex flex-col lg:flex-row gap-3">
                  <div className="mt-3 w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" placeholder="Your name" />
                </div>
                <div className="mt-3 w-full">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" placeholder="Your email" />
                </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-3">
                <div className="mt-3 w-full">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="location" id="location" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" placeholder="Your location or city" />
                </div>
                <div className="mt-3 w-full">
                   <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date of Event?</label>
                    <input type="date" id="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" placeholder="Describe your oder" />
                </div>
                </div>
                <div className="mt-3">
                   <label htmlFor="order" className="block text-sm font-medium text-gray-700">What Do You Want Order?</label>
                    <textarea id="message" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" placeholder="Describe your oder"></textarea>
                </div>
                
                <div className="mt-3">
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 hover:cursor-pointer w-full">Send Order</button>
                   
                </div>
                <div className="mt-3 border-1 border-red-500 p-2 rounded-lg flex justify-center">
                    <small className="text-red-600 font-bold">Payment made are not refundable.</small>
                </div>
                </form>
            </div>
            
            </div>
  )
}

export default Contactform