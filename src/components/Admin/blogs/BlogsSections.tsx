"use client";

import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, addDoc, getDocs } from "firebase/firestore";
import {
  Header2,
  Header3,
  Header4,
  Header5,
  ParagraphLink1,
} from "@/components/Text";
import BlogModal from "./BlogModal";

type BlogValues = {
  id: string;
  title: string;
  blogImageURL1: string;
  blogImagePublicId1: string;
  description: string;
};

function BlogsSections() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogValues[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogValues | null>(null);
  const [isAddMoreOpen, setIsAddMoreOpen] = useState(false);
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);

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

  const handleModalClose = () => {
    setSelectedBlog(null);
    setIsAddBlogOpen(false);
  };

  if (loading)
    return (
      <div className=" fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div>
      <div className="container1  pt-[100px] xl:pt-[104px] pb-[24px] ">
        <div className=" pb-[24px]">
          {isAddBlogOpen && (
            <BlogModal blog={null} onClose={handleModalClose} />
          )}

          <div>
            <Header4>All Blogs</Header4>
          </div>
          <div className=" grid grid-cols-1 xl:grid-cols-3  sm:grid-cols-1 gap-[24px] xl:gap-[30px]">
            {blogs.map((blog) => (
              <div key={blog.id}>
                <BlogCard
                  blog={blog}
                  blogImageURL1={blog.blogImageURL1}
                  title={blog.title}
                  description={blog.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" flex fixed bottom-[24px] z-20 right-[24px] ">
        <div className=" relative">
          {isAddMoreOpen && (
            <div className="absolute py-2 right-0 -top-[80px] z-20 mt-2 w-[250px] whitespace-nowrap px-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                onClick={() => setIsAddBlogOpen(!isAddBlogOpen)}
                className="py-1 cursor-pointer"
              >
                <ParagraphLink1>Create New Blog </ParagraphLink1>
              </div>
            </div>
          )}{" "}
          <div
            onClick={() => setIsAddMoreOpen(!isAddMoreOpen)}
            className=" p-4 bg-primary cursor-pointer hover:bg-black text-white rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogsSections;
