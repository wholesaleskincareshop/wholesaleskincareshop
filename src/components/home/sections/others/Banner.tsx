import React, { useState, useEffect } from 'react';

interface BannerCarouselProps {
  imageUrls: string[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    // Load images from external URLs
    const imagePromises = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then((loadedImages) => setImages(loadedImages as HTMLImageElement[]))
      .catch((error) => console.error('Error loading images:', error));
  }, [imageUrls]);

  useEffect(() => {
    // Automatically change images every 2 seconds
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(intervalId); // Cleanup on unmount
    };
  }, [currentIndex, images]);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const DotIndicator: React.FC<{ active: boolean }> = ({ active }) => (
    <span
      className={`inline-block w-2 h-2 bg-primary rounded-full mx-2 ${
        active ? 'bg-secondary w-2 h-2' : 'bg-primary'
      }`}
    />
  );

  return (
    <div className="relative container1">
      <div className="w-[100%] relative sm:h-[350px] h-[200px] border    rounded-lg mx-auto overflow-hidden rou">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={`Banner ${index + 1}`}
            className={`absolute top-0 left-0 w-[100%] mx-auto sm:h-[350px] opacity-85 h-[200px] transition-transform duration-500 ${
              index === currentIndex ? "translate-x-0" : "translate-x-full"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={prevSlide}
          className="absolute sm:left-6 - left-6 top-1/2 transform -translate-y-1/2 text-bg_gray bg-black bg-opacity-20 p-1 font-bold rounded-full"
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
          className="absolute bg-black bg-opacity-20 - right-6 sm:right-6 top-1/2 transform -translate-y-1/2  text-bg_gray p-1 font-bold rounded-full"
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
      {/* <div className="flex justify-center pb-2">
        {images.map((_, index) => (
          <DotIndicator key={index} active={index === currentIndex} />
        ))}
      </div> */}
    </div>
  );
};

export default BannerCarousel;
