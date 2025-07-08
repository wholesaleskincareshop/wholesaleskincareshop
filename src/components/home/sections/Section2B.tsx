"use client";

import Button from "@/components/Button";
import {
  Header3,
  Header4,
  Paragraph1,
  ParagraphLink1,
} from "@/components/Text";
import Link from "next/link";
import React from "react";
import AOS from "aos";
import RandomFaces from "./others/RandomFaces";
import ProductCard from "@/components/Products/ProductCard";

interface Section2Props {
  featuredProducts: any;
}

const Section2: React.FC<Section2Props> = ({ featuredProducts }) => {
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  return (
    <div>
      <div className=" container1 pt-[34px] - xl:pt-[50px]  text-p_black">
        {" "}
        <div
          className=" flex flex-col gap-[8px] xl:gap-[24px] text-center items-center w-full mb-[24px] xl:mb-[64px]"
          data-aos="fade-up"
        >
          <Header3>
            Our <span className="text-primary">Trending</span> Products
          </Header3>
          <Paragraph1 className="max-w-[883px] text-center hidden-">
            Each product is carefully selected to celebrate your unique beauty,
            empowering you to express yourself with confidence, elegance, and
            radiance.
          </Paragraph1>
        </div>
        {/* data-aos="fade-right" */}
        <div className="flex items-center overflow-y-auto scrollbar-hide   gap-[24px] xl:gap-[30px]">
          {featuredProducts && featuredProducts.length > 0
            ? featuredProducts.slice(0, 8).map((product: any) => (
                <div className=" w-[200px]">
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
                    className="h-[200px] min-w-[250px] bg-gray-200 rounded-md animate-pulse"
                  ></div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default Section2;
