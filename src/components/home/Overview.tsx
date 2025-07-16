"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import HeroSection from "./sections/HeroSection";
import Section2 from "./sections/Section2";
import Section2B from "./sections/Section2B";
import Section3 from "./sections/Section3";
import Section4 from "./sections/Section4";
import Section5 from "./sections/Section5";
import Section6 from "./sections/Section6";
import BlogSection from "./sections/others/BlogSection";
import NewsLetter from "./sections/NewsLetter";

interface Product {
  id: string;
  name: string;
  currentPrice: number;
  productImageURL1: string;
  category: string;
  createdAt: Date;
}

function Overview() {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchHomepageProducts = async () => {
      try {
        // Featured
        const featuredQuery = query(
          collection(db, "products"),
          where("isFeatured", "==", true),
          limit(8)
        );
        const featuredSnap = await getDocs(featuredQuery);
        const featured = featuredSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        })) as Product[];
        setFeaturedProducts(featured);

        // Trending
        const trendingQuery = query(
          collection(db, "products"),
          where("isTrending", "==", true),
          limit(8)
        );
        const trendingSnap = await getDocs(trendingQuery);
        const trending = trendingSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        })) as Product[];
        setTrendingProducts(trending);

        // Latest
        const latestQuery = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
          limit(8)
        );
        const latestSnap = await getDocs(latestQuery);
        const latest = latestSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        })) as Product[];
        setLatestProducts(latest);
      } catch (err) {
        console.error("Error fetching homepage products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageProducts();
  }, []);

  return (
    <div>
      <HeroSection />
      <Section2 featuredProducts={featuredProducts} />
      <Section2B featuredProducts={trendingProducts} />
      <Section4 />
      <Section3 latestProducts={latestProducts} />
      <Section5 />
      <BlogSection />
      <NewsLetter />
      <Section6 />
    </div>
  );
}

export default Overview;
