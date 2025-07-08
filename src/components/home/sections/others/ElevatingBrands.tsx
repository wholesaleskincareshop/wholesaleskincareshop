import { Header2, Header3, Header4 } from "@/components/Text";
import React from "react";

function ElevatingBrands() {
  const pictureTypes = [
    "Sephora",
    "MAC",
    "Estée Lauder",
    "L'Oréal",
    "Maybelline",
  ];

  // Generate an array of 300 items cycling through the picture types
  const brands = Array.from(
    { length: 300 },
    (_, i) => pictureTypes[i % pictureTypes.length]
  );

  return (
    <div className="py-[20  text-p_black">
      <Header4 className=" text-center sm:mb-8 mb-2">
        Available <span className=" text-primary">Brands</span>
      </Header4>

      <div className="slider-container3 overflow-hidden whitespace-nowrap">
        <div className="slider-content3 flex gap-[22px] animate-slider3">
          {brands.map((brand, index) => (
            <React.Fragment key={index}>
              <div className=" border-b-2  border-primary">
                <Header4>{brand}</Header4>
              </div>
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
                  d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                />
              </svg>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ElevatingBrands;
