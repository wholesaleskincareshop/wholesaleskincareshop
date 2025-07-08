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
import ProductCard from "@/components/Products/ProductCard";

interface Section3Props {
  latestProducts: any;
}

const Section3: React.FC<Section3Props> = ({ latestProducts }) => {
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  return (
    <div>
      {" "}
      <div className=" container1 pt-[34px] xl:pt-[50px]  text-p_black">
        {" "}
        <div
          className=" flex xl:gap-[24px] flex-col text-center items-center w-full mb-[24px] xl:mb-[64px]"
          // data-aos="fade-up"
        >
          <Header3>
            Our Newest <span className="text-primary">Beauty</span> Essentials
          </Header3>{" "}
          <Paragraph1 className="max-w-[883px] text-center">
            Handpicked just for you, these products are here to elevate your
            routine and keep you at the forefront of beauty trends.
          </Paragraph1>
        </div>
        <div className="xl:flex grid grid-cols-2 items-center xl:overflow-y-auto scrollbar-hide   gap-2 [24px] xl:gap-4 [30px]">
          {latestProducts && latestProducts.length > 0
            ? latestProducts.slice(0, 8).map((product: any) => (
                <div className=" xl:w-[200px]">
                  <ProductCard
                    key={product.id}
                    image={product.productImageURL1}
                    title={product.name}
                    price={product.currentPrice}
                    product={product}
                  />
                </div>
              ))
            : Array(8)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-[200px] xl:min-w-[250px] bg-gray-200 rounded-md animate-pulse"
                  ></div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default Section3;
