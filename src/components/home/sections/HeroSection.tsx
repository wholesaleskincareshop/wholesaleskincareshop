/** @format */

import React from "react";
import BannerCarousel from "./others/Banner";
import Image from "next/image";
import Button from "@/components/Button";

const HomePage = () => {
  const imageUrls = [
    "https://res.cloudinary.com/dqziqldkb/image/upload/v1752125129/Screenshot_2025-07-10_062509_wlvblr.png",
    "https://res.cloudinary.com/dqziqldkb/image/upload/v1752125072/Screenshot_2025-07-10_062353_qji1b9.png",
    "https://res.cloudinary.com/dqziqldkb/image/upload/v1752124848/Red_and_Yellow_Illustrative_Modern_Happy_New_Year_2025_Banner_2_hzshv2.png",
  ];

  return (
    <div className="  pt-[70px] ">
      <div className="bg-black text-white pt-[70px hidden  ">
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
            Same day delivery around Lagos (10:00 am - 8:00 pm), 
          </h1>
        </div>
      </div>
      <BannerCarousel imageUrls={imageUrls} />

      {/* <div className="flex container1 justify-center-  xl: flex-row -flex-col items-center mt-4 gap-4 xl:gap-[32px]">
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
      </div> */}
    </div>
  );
};

export default HomePage;
