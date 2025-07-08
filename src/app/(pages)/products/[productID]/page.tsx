import Overview from "@/components/Products/Detail/Overview";
import React from "react";
import { Metadata } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Define dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { productID: string };
}): Promise<Metadata> {
  const productID = params.productID;

  // Fetch product data
  const productRef = doc(db, "products", productID);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return {
      title: "Product Not Found - GrandioseGrin Cosmetics",
      description: "The product you are looking for is not available.",
    };
  }

  const product = productSnap.data();
  return {
    title: `${product.name} - GrandioseGrin Cosmetics`,
    description: `Price: ₦${product.currentPrice}, ${product.description}`,
    openGraph: {
      title: product.name,
      description: `Price: ₦${product.currentPrice}, ${product.description}`,
      images: [
        {
          url: product.productImageURL1 || "/default-image.jpg",
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: `Price: ₦${product.currentPrice}, ${product.description}`,
      images: [product.productImageURL1 || "/default-image.jpg"],
    },
  };
}

// Fetch the product data (runs on the server side)
export default async function ProductDetail({
  params,
}: {
  params: { productID: string };
}) {
  const productID = params.productID;

  // Fetch product data
  const productRef = doc(db, "products", productID);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Product Not Found</h1>
      </div>
    );
  }

  const product = productSnap.data();

  return (
    <div className="pt-[5000px]- min-h-screen">
      <Overview />
    </div>
  );
}

