"use client";

import React, { useState, useEffect } from "react";
import { Header3, Paragraph1, ParagraphLink1 } from "../Text";
import AOS from "aos";
import BlogCard from "./BlogCard";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, addDoc, getDocs } from "firebase/firestore";

type BlogValues = {
  id: string;
  title: string;
  blogImageURL1: string;
  blogImagePublicId1: string;
  description: string;
};

function BlogIntro() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogValues[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        }) as BlogValues[];

        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  return (
    <div>
      <div className=" container1 py-[24px] xl:py-[100px] pt-[100px]  text-p_black">
        {" "}
        <div
          className=" flex flex-col gap-[8px] text-center xl:gap-[24px] items-center w-full mb-[24px] xl:mb-[64px]"
          data-aos="fade-up"
        >
          <Header3>
            Explore the World of{" "}
            <span className="text-primary text-center">Beauty</span> and
            Wellness
          </Header3>
          <Paragraph1 className="max-w-[883px] text-center">
            Welcome to our beauty blog, your go-to source for the latest
            updates, tips, and trends in the world of beauty. Here, we celebrate
            individuality and inspire confidence, elegance, and self-expression
            in every glow.
          </Paragraph1>
        </div>
        {/* data-aos="fade-right" */}
        <div className=" grid grid-cols-1 xl:grid-cols-3  sm:grid-cols-1 gap-[24px] xl:gap-[30px]">
          {blogs && blogs.length > 0
            ? blogs.map((blog: any) => (
                <div key={blog.id}>
                  <BlogCard
                    title={blog.title}
                    description={blog.description}
                    image={blog.blogImageURL1}
                    link={`/blog/${blog.id}`}
                  />
                </div>
              ))
            : Array(6)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-[300px] w-full bg-gray-200 rounded-md animate-pulse"
                  ></div>
                ))}
        </div>
      </div>
    </div>
  );
}

export default BlogIntro;
