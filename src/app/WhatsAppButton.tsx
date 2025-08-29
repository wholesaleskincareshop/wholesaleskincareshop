/** @format */
"use client";

import React from "react";

const WhatsAppButton = () => {
  const phoneNumber = "2348140926533"; // Replace with your WhatsApp number (with country code, no +)
  const message = "Hello, I would like to know more about your products"; // Default message

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-[99]  hover:bg-gray-100 text-white p-2 sm:p-4 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110"
    >
      <img
        src="https://res.cloudinary.com/dqziqldkb/image/upload/v1756495306/whatsapp_1_bpom4z.png"
              alt=""
              className="h-[30px] sm:h-[50px]"
      />
    </button>
  );
};

export default WhatsAppButton;
