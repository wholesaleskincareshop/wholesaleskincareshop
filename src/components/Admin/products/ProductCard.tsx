"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Paragraph2, ParagraphLink2 } from "@/components/Text";
import Button from "@/components/Button";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  product,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState(product);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-full bg-white rounded-lg shadow-l overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {isModalOpen && (
        <ProductModal product={product} onClose={handleModalClose} />
      )}
      <div
        onClick={handleEditClick}
        className="bg-white relative p-2 hover:border-primary cursor-pointer border-2 rounded-lg"
      >
        <img
          src={
            image
              ? image.replace("/upload/", "/upload/w_500,f_auto/")
              : "/images/default-product.png"
          }
          alt={title}
          className="w-full h-[100px] object-cover rounded-lg hover:scale-110 transition-transform duration-300 "
        />
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-lg ${
            product.availableAmount === "0" ? "bg-red-500" : "bg-black"
          }`}
        >
          <p className="text-white text-[12px]">
            {product.availableAmount === "0"
              ? "Out of Stock"
              : `Qt: ${product.availableAmount}`}
          </p>
        </div>
        {!product.isPublish && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-4 py-2 rounded">
            <p className="text-white font-semibold">Unpublished</p>
          </div>
        )}
        <div className=" flex flex-col justify-center border-t pt-2 items-center   ga -rounded-lg  bg-white bg-opacity-65">
          <p className=" font-medium text-center pb-2  whitespace-nowrap w-[100%] truncate overflow-hidden">
            {" "}
            {title}{" "}
          </p>

          <button className="whitespace-nowrap text-[13px] flex justify-center py-1 bg-primary hover:bg-black rounded-lg w-full  text-white ">
            <p>{`₦ ${new Intl.NumberFormat("en-US", {}).format(
              Number(price)
            )}`}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
