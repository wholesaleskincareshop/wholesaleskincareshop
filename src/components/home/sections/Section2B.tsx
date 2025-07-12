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
      <div className=" container1 py-[34px] - xl:py-[50px]  text-p_black">
        {" "}
        <div
          className=" flex flex-col gap-[8px] xl:gap-[24px] sm:text-center sm:items-center w-full mb-[24px] xl:mb-[64px]"
          data-aos="fade-up"
        >
          <Header3>
            <span className="text-primary">Trending</span> Products
          </Header3>
          <Paragraph1 className="max-w-[883px] sm:flex hidden">
            Discover our most in-demand skincare products — trusted by
            professionals and loved by individuals for their proven results,
            ingredient quality, and everyday value.
          </Paragraph1>
        </div>
        {/* data-aos="fade-right" */}
        <div className="flex items-center overflow-y-auto scrollbar-hide gap-2  sm:gap-[24px]">
          {featuredProducts && featuredProducts.length > 0
            ? featuredProducts.slice(0, 8).map((product: any) => (
                <div className=" min-w-[280px]">
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
