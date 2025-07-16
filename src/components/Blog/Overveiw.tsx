// app/blog/page.tsx
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BlogIntro from "@/components/Blog/BlogIntro";

export default async function BlogPage() {
  const querySnapshot = await getDocs(collection(db, "blogs"));
  const blogs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as any),
  }));

  return <BlogIntro blogs={blogs} />;
}
