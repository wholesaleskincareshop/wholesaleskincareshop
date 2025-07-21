import React from "react";

const SlidingBanner = () => {
  const message = `🚚✨ Welcome to our store! Enjoy same-day delivery across Lagos 🏙️ from 10:00 AM to 8:00 PM. Fast, reliable, and right to your doorstep 🏡. Shop with us today and experience convenience like never before! 💼🛒🎉`;

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
