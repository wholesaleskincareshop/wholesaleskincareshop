"use client";

import Button from "@/components/Button";
import { Header1Plus, Header3, Header4, Paragraph1 } from "@/components/Text";
import Link from "next/link";
import React from "react";
import AOS from "aos";


function section6() {

   React.useEffect(() => {
     AOS.init({
       duration: 1000,
     });
   });
  
  return (
    <div>
      <div
        className=" container1 pt-[24px] xl:pt-[50px] text-p_black"
        data-aos="fade-up"
      >
        {" "}
        <div className="flex flex-col xl:gap-[24px] items-center w-full text-center pb-[64px]">
          <Header1Plus>
            Discover Your Best <span className="text-primary">Skin</span> with
            Us
          </Header1Plus>
          <Paragraph1 className="max-w-[883px] text-center">
            Have questions or need help choosing the right products? Our team is
            here to support both skincare professionals and individuals in
            finding exactly what they need.
          </Paragraph1>
          <Button
            text="Contact Us Today"
            href="/contact-us"
            isLink={true}
            additionalClasses="border-white mt-[14px] w-fit "
          />
        </div>
      </div>
    </div>
  );
}

export default section6;
