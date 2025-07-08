"use client";

import React, { useEffect, useState } from "react";
import axios from "axios"; // Use axios or fetch to hit your own backend or API

// Define varying column spans for different images
const columnSpans = [1, 3, 2, 2, 2, 2, 2, 3, 1];

// Function to get images from Cloudinary folder
async function getImagesFromFolder(folderPath: string) {
  try {
    const response = await axios.get(`/api/get-images`, {
      params: { folder: folderPath },
    });

    const images = response.data.resources.map(
      (resource: any, index: number) => {
        const optimizedUrl = resource.secure_url.replace(
          "/upload/",
          "/upload/w_1000,f_auto/"
        ); // Modify the URL

        return {
          id: index + 1,
          src: optimizedUrl, // Use the modified URL
        };
      }
    );

    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

const Overview = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    getImagesFromFolder("utilities/templates/Gallary").then(setImages);
    setLoading(false); // Set loading to false after images are fetched
  }, []);

  // Disable right-click (context menu) for images
  const handleContextMenu = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  // Disable long-press for mobile devices
  const handleTouchStart = (event: React.TouchEvent<HTMLImageElement>) => {
    event.preventDefault(); // This prevents long-press actions
  };

  return (
    <div className="mt-[100px]">
      <div className="container mx-auto">
        <div className="min-h-screen space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:p-0 p-4">
            {loading
              ? // Show placeholder loader (black boxes) while images are loading
                Array.from({ length: 9 }).map((_, index) => {
                  const span = columnSpans[index % columnSpans.length]; // Define the span for loader
                  return (
                    <div
                      key={index}
                      className={`h-[300px] w-full rounded-lg border-2 bg-black border-primary overflow-hidden 
                      ${span === 1 ? "sm:col-span-1" : ""}
                      ${span === 2 ? "sm:col-span-2" : ""}
                      ${span === 3 ? "sm:col-span-3" : ""}`}
                    />
                  );
                })
              : images.map((image, index) => {
                  const span = columnSpans[index % columnSpans.length]; // Determine the span for the current image
                  return (
                    <div
                      key={image.id}
                      className={`h-[300px] w-full rounded-lg border-2 bg-black border-primary overflow-hidden 
                  ${span === 1 ? "sm:col-span-1" : ""}
                  ${span === 2 ? "sm:col-span-2" : ""}
                  ${span === 3 ? "sm:col-span-3" : ""}`}
                    >
                      <img
                        src={image.src}
                        alt={`Image ${image.id}`} // Simple alt text
                        className="h-full w-full object-cover"
                        onContextMenu={handleContextMenu} // Disable right-click
                        onTouchStart={handleTouchStart} // Disable long-press on mobile
                        draggable={false} // Disable dragging of the image
                      />
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
