"use client";

import {
  Header3,
  Header4,
  Paragraph1,
  ParagraphLink1,
} from "@/components/Text";
import Link from "next/link";
import React from "react";
import AOS from "aos";


function Section3() {

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });


  return (
    <div>
      {" "}
      <div className=" container1 py-[24px] xl:py-[100px]  text-p_black">
        {" "}
        <div
          className=" flex xl:gap-[24px] flex-col items-center w-full mb-[24px] xl:mb-[64px]"
          data-aos="fade-up"
        >
          <Header3>Get to Know Us</Header3>
          <Paragraph1 className="max-w-[883px] text-center">
            Your trusted source for high-quality skincare — serving both
            professionals and everyday users with care and consistency.
          </Paragraph1>
        </div>
        <div className=" grid col-span-1 xl:items-center xl:grid-cols-6 gap-[24px] xl:gap-[30px]">
          <div className=" xl:col-span-3">
            <div
              className=" bg-white rounded-lg p-[31px h-[500px] overflow-hidden "
              data-aos="fade-left"
            >
              <img
                src="https://res.cloudinary.com/dqziqldkb/image/upload/v1752225664/Gemini_Generated_Image_ruzlmcruzlmcruzl_p8bx0y.png"
                alt="branding"
                className="w-full rounded-lg"
              />{" "}
            </div>
          </div>
          <div className=" xl:col-span-3  xl:space-y-[30px]">
            <div className="  " data-aos="fade-right">
              <div className="space-y-[12px]  xl:space-y-[32px] md:space-y-[32px]">
                <Header4>Dedicated to Healthy, Confident Skin</Header4>
                <Paragraph1>
                  Our team is committed to offering a curated collection of
                  skincare essentials that support real results — whether you're
                  a professional providing treatments or an individual building
                  a routine at home. Every product we offer is selected for its
                  quality, effectiveness, and ability to meet diverse skin
                  needs.
                </Paragraph1>
                <Paragraph1>
                  Rooted in care, quality, and trust, our mission is to empower
                  both businesses and individuals with access to reliable
                  skincare that promotes long-term skin health, confidence, and
                  well-being.
                </Paragraph1>

                <div>
                  <Link
                    href="/blog/3MjcN04B24nmOqz8UrYi"
                    className=" text-[20px] text-primary font-bold underline "
                  >
                    <ParagraphLink1> Read More</ParagraphLink1>
                  </Link>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section3;
