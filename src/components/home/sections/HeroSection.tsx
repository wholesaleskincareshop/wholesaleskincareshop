/** @format */
"use client";

import React, { useEffect, useState } from "react";
import BannerCarousel from "./others/Banner";
import SlidingBanner from "./others/SlidingBanner";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const HomePage = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const snapshot = await getDocs(collection(db, "banners"));
        const urls = snapshot.docs.map((doc) => doc.data().bannerImageURL);
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className="pt-[60px] sm:pt-[70px]">
      {/* Sliding text banner (your existing component) */}
      <SlidingBanner />

      {/* Banner carousel now uses Firestore banners */}
      <BannerCarousel imageUrls={imageUrls} />
    </div>
  );
};

export default HomePage;
