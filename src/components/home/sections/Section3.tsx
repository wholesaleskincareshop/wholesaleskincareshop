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
      <div className=" container1 py-[34px] xl:py-[50px]  text-p_black">
        {" "}
        <div
          className=" flex xl:gap-[24px] flex-col sm:text-center sm:items-center w-full mb-[24px] xl:mb-[64px]"
          // data-aos="fade-up"
        >
          <Header3>
            Newest <span className="text-primary">Skincare</span> Essentials
          </Header3>
          <Paragraph1 className="max-w-[883px] sm:flex hidden">
            Explore our latest arrivals — carefully selected for their
            effectiveness, quality ingredients, and value for professionals and
            skincare enthusiasts alike.
          </Paragraph1>
        </div>
        <div className=" grid grid-cols-2 sm:grid-cols-4 items-center scrollbar-hide gap-2 sm:gap-[24px]">
          {latestProducts && latestProducts.length > 0
            ? latestProducts.slice(0, 8).map((product: any) => (
                <div className=" ">
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
