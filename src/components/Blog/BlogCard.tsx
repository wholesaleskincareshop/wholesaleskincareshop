import React from "react";
import { Header3, HeaderAny, Paragraph2 } from "../Text";

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  image,
  link,
}) => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg- bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <img
        className="w-full h-48 object-cover"
        src={image.replace("/upload/", "/upload/w_1000,f_auto/")}
        alt={title}
      />
      <div className="p-4">
        <HeaderAny className="text-[16px] font-semibold text-gray-800 mb-2">{title}</HeaderAny>
        <Paragraph2 className="text-gray-600 mb-4">
          {" "}
          {description.split(" ").slice(0, 11).join(" ")}...
        </Paragraph2>
        <a href={link} className="text-primary hover:underline font-semibold">
          Read More
        </a>
      </div>
    </div>
  );
};

export default BlogCard;
