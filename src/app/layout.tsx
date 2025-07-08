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
  title: "GrandioseGrin Cosmetics - Radiant Beauty, Timeless Elegance",
  description:
    "Explore premium cosmetics and beauty products at GrandioseGrin. Elevate your beauty routine with our carefully selected makeup, skincare, and fragrance collections.",
  generator:
    "GrandioseGrin, cosmetics, beauty products, skincare, makeup, fragrance, online beauty store",
  keywords: [
    "cosmetics",
    "beauty products",
    "skincare",
    "makeup",
    "fragrance",
    "luxury beauty",
    "online beauty store",
    "premium cosmetics",
    "beauty essentials",
    "GrandioseGrin",
  ],
  applicationName: "GrandioseGrin Cosmetics",
  openGraph: {
    title: "GrandioseGrin Cosmetics - Radiant Beauty, Timeless Elegance",
    description:
      "Discover the best in beauty with GrandioseGrin Cosmetics. Shop our curated collection of makeup, skincare, and fragrances to enhance your natural radiance.",
    url: "https://www.grandiosegrin.com",
    siteName: "GrandioseGrin Cosmetics",
    images: [
      {
        url: "https://res.cloudinary.com/dtipo8fg3/image/upload/v1731517339/istockphoto-1430775999-612x612_ruzqva.jpg",
        width: 1200,
        height: 630,
        alt: "GrandioseGrin Cosmetics - Radiant beauty products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@grandiosegrin",
    title: "GrandioseGrin Cosmetics - Radiant Beauty, Timeless Elegance",
    description:
      "Enhance your beauty with premium skincare, makeup, and fragrances from GrandioseGrin.",
    images:
      "https://res.cloudinary.com/dtipo8fg3/image/upload/v1731517338/istockphoto-637324230-612x612_gzcdkm.jpg",
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
