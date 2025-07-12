"use client";


import { Header3, Header4, Paragraph1, Paragraph2, ParagraphLink1 } from "@/components/Text";
import Link from "next/link";
import React from "react";
import AOS from "aos";

function Section4() {

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  return (
    <div className=" bg-bg_gray">
      <div className=" container1 py-[54px] xl:py-[50px]  text-p_black">
        {" "}
        <div
          className=" flex flex-col xl:gap-[24px] items-center w-full mb-[24px] xl:mb-[50px]"
          data-aos="fade-up"
        >
          <Header3 className="text-center">
            Our <span className="text-primary">Simple 3-Step</span> Buying
            Process
          </Header3>
          <Paragraph1 className="max-w-[883px] text-center">
            We make it easy to source trusted skincare — whether you're a spa
            owner stocking up or an individual looking for quality products at
            great value.
          </Paragraph1>
        </div>
        <div className=" grid grid-cols-1 xl:grid-cols-6 gap-[24px] xl:gap-[30px]">
          <div
            data-aos="fade-right"
            className=" xl:col-span-2 bg-gradient-to-br from-[#e1d2f8] to-[#bda6ff] rounded-[24px]"
          >
            <div className=" py-[24px] xl:py-[53px] p-[32px] ">
              <div className="space-y-[24px] xl:space-y-[32px]    ">
                <div className=" flex w-full justify-end-  ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>
                </div>
                <Header4>Browse & Discover</Header4>
                <Paragraph2>
                  Explore our curated selection of effective skincare products
                  designed to meet the needs of professionals and everyday users
                  alike.
                </Paragraph2>
                <div>
                  <Link
                    href="/products"
                    className="text-[20px] font-bold underline"
                  >
                    <ParagraphLink1>Shop Now</ParagraphLink1>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            data-aos="fade-up"
            className=" xl:col-span-2 bg-gradient-to-br from-[#dfe2d5] to-[#a6aa98] rounded-[24px] "
          >
            <div className="">
              <div className="space-y-[24px] xl:space-y-[32px] p-[32px] py-[24px]  xl:py-[53px]">
                <div className=" flex w-full justify-end-  ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </div>
                <Header4>Select & Order</Header4>
                <Paragraph2>
                  Choose the quantities that fit your needs, from single units
                  to bulk purchases, and customize options like size or bundle
                  when available.
                </Paragraph2>
                <div>
                  <Link
                    href="/products"
                    className="text-[20px] font-bold underline"
                  >
                    <ParagraphLink1>View Your Cart</ParagraphLink1>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            data-aos="fade-left"
            className=" xl:col-span-2 bg-gradient-to-br from-blue-200 to-blue-400 rounded-[24px]"
          >
            <div className="">
              <div className="space-y-[24px] xl:space-y-[32px] p-[32px] py-[24px]  xl:py-[53px]">
                <div className=" flex w-full justify-end-  ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                    />
                  </svg>
                </div>
                <Header4>Receive & Replenish</Header4>
                <Paragraph2>
                  Enjoy fast, reliable delivery and restock with ease whenever
                  you need. Your go-to source for consistent, high-quality
                  skincare.
                </Paragraph2>
                <div>
                  <Link
                    href="/products"
                    className="text-[20px] font-bold underline"
                  >
                    <ParagraphLink1>Explore More Products</ParagraphLink1>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section4;
