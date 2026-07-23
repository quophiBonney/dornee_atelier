import React from "react";

const Map = () => {
  return (
    <div className="mt-10">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d64147291.162642665!2d-90.15468498392934!3d11.095487002374604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf849983684341%3A0x6c2902d726fb93cb!2sSpintex%20Road%2C%20Accra!5e0!3m2!1sen!2sgh!4v1782232460271!5m2!1sen!2sgh"
        className="w-full"
        height="450"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;