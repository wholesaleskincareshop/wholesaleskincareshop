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
          <Paragraph1 className=" max-w-[883px] text-center ">
            Your Destination for Premium Skincare and Beauty Products
          </Paragraph1>
        </div>
        <div className=" grid col-span-1 xl:items-center xl:grid-cols-6 gap-[24px] xl:gap-[30px]">
          <div className=" xl:col-span-3">
            <div
              className=" bg-white rounded-lg p-[31px overflow-hidden "
              data-aos="fade-left"
            >
              <img
                src="/images/section3.jpg"
                alt="branding"
                className="w-full rounded-lg"
              />{" "}
            </div>
          </div>
          <div className=" xl:col-span-3  xl:space-y-[30px]">
            <div className="  " data-aos="fade-right">
              <div className="space-y-[12px]  xl:space-y-[32px] md:space-y-[32px]">
                <Header4>Celebrating Your Natural Beauty</Header4>
                <Paragraph1>
                  Our passionate team is dedicated to creating a curated
                  selection of skincare and beauty products that empower you to
                  feel confident and radiant every day. We believe that
                  self-care is a celebration of your unique beauty, and each
                  product we offer is crafted to nourish and highlight what
                  makes you, uniquely you.
                </Paragraph1>
                <Paragraph1>
                  Driven by a commitment to quality and self-expression, our
                  mission is to connect with individuals who seek authenticity
                  and care in their beauty routines, providing products that
                  support their journey to inner and outer wellness.
                </Paragraph1>

                <div>
                  <Link
                    href="/about-us"
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
