import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "aos/dist/aos.css";
import Head from "next/head"; // Import Head for adding custom scripts
import NetworkStatusChecker from "./NetworkStatusChecker";
import { Toaster } from "react-hot-toast"; // Import Toaster

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Wholesale Skincare Shop - Quality Products for All",
  description:
    "Shop high-quality skincare products trusted by spas and salons. Whether you're buying in bulk or for personal use, find effective, science-backed skincare at great prices.",
  generator:
    "wholesale skincare, spa skincare, salon supplies, bulk beauty products, science-backed skincare, B2B skincare store, skincare for estheticians, skincare for resellers",
  keywords: [
    "wholesale skincare",
    "bulk skincare",
    "spa skincare",
    "salon skincare supplies",
    "science-backed skincare",
    "skincare for estheticians",
    "retail skincare",
    "skincare shop",
    "B2B beauty store",
    "dermatologist-grade skincare",
  ],
  applicationName: "Wholesale Skincare Shop",
  openGraph: {
    title: "Wholesale Skincare Shop - Spa-Quality Products for All",
    description:
      "Explore curated skincare trusted by estheticians, spas, and salons. Shop bulk or retail with tiered pricing and expert-grade formulas for every skin type.",
    url: "https://www.wholesaleskincareshop.com",
    siteName: "Wholesale Skincare Shop",
    images: [
      {
        url: "https://res.cloudinary.com/dqziqldkb/image/upload/v1752326559/6010238764733025601_giaz9n.jpg",
        width: 1200,
        height: 630,
        alt: "Spa-quality skincare products for businesses and individuals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@wholesaleskinshop",
    title: "Wholesale Skincare Shop - Spa-Quality Products for All",
    description:
      "Effective skincare for spas, salons, and everyday routines. Shop trusted brands in bulk or individually at affordable prices.",
    images:
      "https://res.cloudinary.com/dqziqldkb/image/upload/v1752326559/6010238764733025601_giaz9n.jpg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* Add Cloudinary widget script */}
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
          async
        ></script>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F2YRYGXF65"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F2YRYGXF65');
            `,
          }}
        />
      </Head>
      <body className=" bg-[#f1efe8]-">
        <Toaster />
        <NetworkStatusChecker />

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
