import React from "react";

const SlidingBanner = () => {
const message = `🚚✨ 100 percent authentic products  
🛒 Online skincare store in Lagos  
🎁 You get Free delivery on every order over 300k within Lagos  
💝 Every order comes with a gift  
⏱️ Delivery within Lagos 24-48 hours (but you can enjoy same day delivery within Lagos if you order before 12pm, Monday - Friday)  
🚚📦 Delivery outside Lagos 2-5 days  
🌍✈️ International deliveries 5-7 working days`;

  return (
    <div className=" bg-gray-800 py-2">
      <div className="w-full overflow-hidden container1 ">
        <div className="sliding-track   flex gap-[40px] whitespace-nowrap text-white  md:text-base">
          {[...Array(10)].map((_, i) => (
            <span key={i}>{message}</span>
          ))}
        </div>
       
      </div>
    </div>
  );
};

export default SlidingBanner;
