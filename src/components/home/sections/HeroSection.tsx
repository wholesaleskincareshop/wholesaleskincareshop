/** @format */

import React from "react";
import BannerCarousel from "./others/Banner";
import Image from "next/image";
import Button from "@/components/Button";

const HomePage = () => {
  const imageUrls = [
    "https://res.cloudinary.com/dtipo8fg3/image/upload/v1734057094/ad-banner-natural-beauty-products-600nw-1780339220_fi36g5.webp",
    "https://res.cloudinary.com/dtipo8fg3/image/upload/v1734057163/cosmetic-banner-design-template-f144d95f86f429ed2b4cf012c01937cc_screen_xemfkc.jpg",
    "https://res.cloudinary.com/dtipo8fg3/image/upload/v1734057163/HKen-blackFriday_FCbanana_web_banner_3b60d3ff-04ac-494d-af52-e198f9fa37bb_g02jmr.webp",
  ];

  return (
    <div className="  pt-[70px] ">
      <div className="bg-black text-white pt-[70px] hidden ">
        <div className="flex py-2 container1">
          <div className="">
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
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
          </div>
          <h1 className="text-white text-[14px]">
            Delivery around FUTO (10:00 am - 8:00 pm)
          </h1>
        </div>
      </div>
      <BannerCarousel imageUrls={imageUrls} />

      <div className="flex container1 justify-center-  xl: flex-row -flex-col items-center mt-4 gap-4 xl:gap-[32px]">
        <Button
          text="Shop Now"
          href="/products"
          isLink={true}
          border="border-2 border-primary "
          additionalClasses="border-primary xl:w-fit- flex justify-center  w-full "
        />
        <Button
          text="About Us"
          href="/about-us"
          isLink={true}
          color="text-white"
          backgroundColor=" bg-p_black"
          border="border-2 border-white "
          additionalClasses=" xl: w-fit- justify-center flex w-full "
        />
      </div>
    </div>
  );
};

export default HomePage;
