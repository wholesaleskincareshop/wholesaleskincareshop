
import React, { useState, useEffect } from "react";

interface BannerCarouselProps {
  imageUrls: string[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [imageUrls]); // ✅ only reset when imageUrls change

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="sm:max-w-6xl mx-auto">
      <div className="relative">
        <div className="w-full relative sm:h-[350px] h-[200px] border sm:rounded-lg overflow-hidden">
          {imageUrls.map((src, index) => (
            <img
              key={index}
              src={
                src
                  ? src.replace("/upload/", "/upload/w_1000,f_auto/") // bigger size for banners
                  : "/images/default-product.png"
              }
              alt={`Banner ${index + 1}`}
              className={`absolute top-0 left-0 w-full sm:h-[350px] h-[200px] object-cover transition-opacity duration-700 ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute z-10 sm:left-6 left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 p-2 rounded-full text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute z-10 sm:right-6 right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 p-2 rounded-full text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex hidden justify-center mt-3 space-x-2">
        {imageUrls.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === currentIndex ? "bg-black" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
