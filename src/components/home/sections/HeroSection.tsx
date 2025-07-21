/** @format */

import React from "react";
import BannerCarousel from "./others/Banner";
import Image from "next/image";
import Button from "@/components/Button";
import SlidingBanner from "./others/SlidingBanner";

const HomePage = () => {
  const imageUrls = [
    "https://res.cloudinary.com/dqziqldkb/image/upload/v1753088849/5_nqhwsc.png",
    "https://res.cloudinary.com/dqziqldkb/image/upload/v1753088827/6_oyd4de.png",
    "https://res.cloudinary.com/dqziqldkb/image/upload/v1752125072/Screenshot_2025-07-10_062353_qji1b9.png",
    "https://res.cloudinary.com/dqziqldkb/image/upload/v1752124848/Red_and_Yellow_Illustrative_Modern_Happy_New_Year_2025_Banner_2_hzshv2.png",
  ];

  return (
    <div className=" pt-[60px]  sm:pt-[70px] ">
      <SlidingBanner />

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
