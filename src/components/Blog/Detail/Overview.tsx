"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import BlogCard from "../BlogCard";

interface BlogValues {
  id: string;
  title: string;
  description: string;
  blogImageURL1: string;
  timestamp: string;
}

const BlogPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogValues | null>(null);
  const { slug } = useParams();
  const [blogs, setBlogs] = useState<BlogValues[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogValues[];

        const currentBlog = blogsData.find((b) => b.id === slug);
        setBlog(currentBlog || null);

        // Filter out the current blog
        setBlogs(blogsData.filter((b) => b.id !== slug));
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [slug]);

  const processText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/__(.*?)__/g, "<i>$1</i>")
      .replace(
        /### (.*?)(\n|$)/g,
        '<h3 class="text-xl font-bold pt-6 pb-2">$1</h3>'
      )
      .replace(
        /## (.*?)(\n|$)/g,
        '<h2 class="text-2xl font-bold pt-8 pb-2">$1</h2>'
      )
      .replace(/- (.*?)(\n|$)/g, '<li class="pb-4 pt-1">$1</li>')
      .replace(
        /(\d+)\. (.*?)(\n|$)/g,
        '<p class="pb-4 pt-1" value="$1">$1.  $2</p>'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" class="text-primary font-medium">$1</a>'
      );
  };

  const formatDate = (firebaseTimestamp: string): string => {
    const date = new Date(firebaseTimestamp);
    const day = date.getDate();
    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${dayWithSuffix} ${month}, ${year}`;
  };

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className="container1 mt-[60px] px-4 py-8 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Blog Details */}
        <div className="sm:col-span-3">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-gray-500 mb-2">{formatDate(blog.timestamp)}</p>
          <div className="h-[300px] w-full my-4 flex border">
            <img
              src={blog.blogImageURL1}
              alt="Blog Cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: processText(blog.description) }}
          ></div>
        </div>

        {/* Related Blogs */}
        <div>
          {blogs.length > 0
            ? blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  title={blog.title}
                  description={blog.description}
                  image={blog.blogImageURL1}
                  link={`/blog/${blog.id}`}
                />
              ))
            : Array(4)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-[300px] w-full bg-gray-200 rounded-md mb-4 animate-pulse"
                  ></div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
