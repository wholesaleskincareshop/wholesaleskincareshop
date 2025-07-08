import React, { useState, useEffect } from "react";

const RandomFaces: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/?results=4"); // Fetch 4 random users
        const data = await response.json();
        const randomImages = data.results.map(
          (user: any) => user.picture.thumbnail
        ); // Use thumbnail size images
        setImages(randomImages);
      } catch (error) {
        console.error("Error fetching random faces:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="flex items-center space-x-[-12px]">
      {images.map((image, index) => (
        <div
          key={index}
          className="w-12 h-12 rounded-full border-2 border-white overflow-hidden"
        >
          <img
            src={image}
            alt={`Random face ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="w-12 h-12 text-center text-[14px] bg-primary rounded-full flex items-center justify-center text-white font-semibold border-2 border-white">
        +150
      </div>
    </div>
  );
};

export default RandomFaces;
