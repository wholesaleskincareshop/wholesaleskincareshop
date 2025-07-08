"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Paragraph2 } from "@/components/Text";
import Button from "@/components/Button";
import BlogModal from "./BlogModal";

type BlogValues = {
  title: string;
  blogImageURL1: string;
  description: string;
  blog: any;
};

const BlogCard: React.FC<BlogValues> = ({
  blogImageURL1,
  title,
  description,
  blog,
}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {isModalOpen && <BlogModal blog={blog} onClose={handleModalClose} />}
      <div
        onClick={handleEditClick}
        className="bg-white relative hover:border-primary cursor-pointer border-2 rounded-lg"
      >
        <img
          className="w-full h-48 object-cover"
          src={blogImageURL1.replace("/upload/", "/upload/w_1000,f_auto/")}
          alt={title}
        />
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">
            {description.split(" ").slice(0, 11).join(" ")}...
          </p>{" "}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
