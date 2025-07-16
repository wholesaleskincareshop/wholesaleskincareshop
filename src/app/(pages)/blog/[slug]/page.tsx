import { Metadata } from "next";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import BlogCard from "../../../../components/Blog/BlogCard";
import { format } from "date-fns";

interface Blog {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
  description: string;
  blogImageURL1: string;
  createdAt: string;
  seconds: any;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  // Fetch blogs data
  const querySnapshot = await getDocs(collection(db, "blogs"));
  const blogsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Blog[];

  const currentBlog = blogsData.find((b) => b.id === slug);

  if (!currentBlog) {
    return {
      title: "Blog Not Found @ Wholesale Skincare Shop – E-commerce Platform for Professionals & Individuals Cosmetics",
      description: "The blog post you are looking for is not available.",
    };
  }

  return {
    title: `${currentBlog.title} @ Wholesale Skincare Shop – E-commerce Platform for Professionals & Individuals Cosmetics`,
    description: currentBlog.description.slice(0, 160), // First 160 characters as description
    openGraph: {
      title: currentBlog.title,
      description: currentBlog.description.slice(0, 160),
      images: [
        {
          url: currentBlog.blogImageURL1 || "/default-image.jpg",
          alt: currentBlog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentBlog.title,
      description: currentBlog.description.slice(0, 160),
      images: [currentBlog.blogImageURL1 || "/default-image.jpg"],
    },
  };
}

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, "blogs"));

  return snapshot.docs.map((doc) => ({
    slug: doc.id, // assuming you're using blog.id as the slug
  }));
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // Fetch blogs data
  const querySnapshot = await getDocs(collection(db, "blogs"));
  const blogsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Blog[];

  const currentBlog = blogsData.find((b) => b.id === slug);

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Blog Not Found</h1>
      </div>
    );
  }

  const relatedBlogs = blogsData.filter((b) => b.id !== slug);

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
        '<p class="pb-1 pt-4" value="$1">$1.  $2</p>'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" class="text-primary font-medium">$1</a>'
      );
  };

  return (
    <div className="container1 mt-[60px] px-4 py-8 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Blog Details */}
        <div className="sm:col-span-3">
          <h1 className="text-4xl font-bold mb-4">{currentBlog.title}</h1>
          <p className="text-gray-500 mb-2">
            {currentBlog.createdAt &&
              format(
                // @ts-ignore
                new Date(currentBlog.createdAt.seconds * 1000),
                "do, MMMM yyyy"
              )}
          </p>{" "}
          <div className="h-[300px] w-full my-4 flex border">
            <img
              src={currentBlog.blogImageURL1.replace(
                "/upload/",
                "/upload/w_1000,f_auto/"
              )}
              alt="Blog Cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: processText(currentBlog.description),
            }}
          ></div>
        </div>

        {/* Related Blogs */}
        <div>
          {relatedBlogs.length > 0
            ? relatedBlogs.map((blog) => (
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
}
