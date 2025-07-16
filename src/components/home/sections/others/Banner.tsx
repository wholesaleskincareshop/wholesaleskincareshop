import React, { useState, useEffect } from "react";

interface BannerCarouselProps {
  imageUrls: string[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([]);

  // Preload images and track load status
  useEffect(() => {
    const loadStatus = new Array(imageUrls.length).fill(false);

    imageUrls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadStatus[i] = true;
        setLoaded([...loadStatus]); // trigger re-render for newly loaded image
      };
    });
  }, [imageUrls]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="relative ">
      <div className="w-full container1 relative sm:h-[350px] h-[200px] border rounded-lg mx-auto overflow-hidden">
        {imageUrls.map((src, index) => (
          <img
            key={index}
            src={
              src
                ? src.replace("/upload/", "/upload/w_500,f_auto/")
                : "/images/default-product.png"
            }
            alt={`Banner ${index + 1}`}
            className={`absolute top-0 left-0 w-full sm:h-[350px] h-[200px] transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute z-50 sm:left-6 left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 p-1 rounded-full"
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
        className="absolute z-50 sm:right-6 right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 p-1 rounded-full"
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
  );
};

export default BannerCarousel;
