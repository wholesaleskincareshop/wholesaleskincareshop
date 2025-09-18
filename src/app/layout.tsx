import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "aos/dist/aos.css";
import NetworkStatusChecker from "./NetworkStatusChecker";
import { Toaster } from "react-hot-toast"; // Import Toaster
import Script from "next/script";
import WhatsAppButton from "./WhatsAppButton";

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
  generator: "Next js",
  keywords: [
    // Core Wholesale & B2B
    "wholesale skincare",
    "bulk skincare",
    "spa skincare supplies",
    "salon skincare wholesale",
    "skincare distributors",
    "skincare for estheticians",
    "professional skincare lines",
    "bulk facial cleansers",
    "bulk moisturizers",
    "bulk serums",
    "wholesale face masks",
    "spa treatment products wholesale",
    "salon skincare kits",
    "wholesale exfoliators",
    "B2B skincare store",
    "dermatologist-grade wholesale skincare",
    "skincare brands for spas",
    "esthetician skincare supplies",
    "wholesale anti-aging products",
    "wholesale acne treatment products",

    // Problem-Solving / Customer Pain Points
    "best skincare for acne-prone skin",
    "skincare for hyperpigmentation",
    "skincare for sensitive skin",
    "dry skin solutions",
    "oily skin care routine products",
    "rosacea skincare products",
    "eczema skincare relief",
    "psoriasis skincare treatment",
    "skincare for dark spots",
    "sun damage repair skincare",
    "anti-aging skincare routine",
    "wrinkle reduction creams wholesale",
    "skin barrier repair skincare",
    "hydrating serums for dry skin",
    "exfoliation for clogged pores",
    "gentle cleansers for sensitive skin",
    "brightening serums for dull skin",
    "skincare for hormonal acne",
    "redness reducing skincare products",

    // Shopping & Consumer Keywords
    "online skincare shop",
    "buy skincare online",
    "affordable skincare store",
    "best skincare deals",
    "skincare bundles wholesale",
    "organic skincare online",
    "vegan skincare store",
    "cruelty-free skincare shop",
    "luxury skincare online",
    "natural skincare products",
    "men's skincare online shop",
    "women's skincare products",
    "teen skincare solutions",
    "Korean skincare wholesale",
    "Japanese skincare shop",
    "skincare clearance sale",
    "bulk order skincare discounts",
    "online beauty supply store",
    "skincare gift sets online",
    "professional-grade skincare online",

    // Specific Product Searches
    "wholesale facial cleansers",
    "wholesale toners",
    "wholesale exfoliants",
    "wholesale vitamin C serum",
    "wholesale hyaluronic acid serum",
    "wholesale retinol creams",
    "wholesale sunscreen skincare",
    "wholesale night creams",
    "wholesale face oils",
    "wholesale sheet masks",
    "wholesale clay masks",
    "wholesale eye creams",
    "wholesale lip balms",
    "wholesale body scrubs",
    "wholesale hand creams",
    "wholesale foot masks",
    "wholesale spa body wraps",
    "wholesale facial kits",
    "wholesale collagen serums",

    // Business & Trade Queries
    "skincare private label wholesale",
    "white label skincare products",
    "custom skincare formulation",
    "skincare bulk pricing",
    "wholesale beauty supply",
    "B2B spa supplies",
    "esthetician starter kits",
    "salon skincare packages",
    "bulk skincare discounts",
    "professional esthetic supplies",
    "spa facial starter kits",
    "trade skincare supplier",
    "salon back bar skincare",
    "hotel amenity skincare products",
    "resell skincare online",
    "drop shipping skincare products",
    "branded skincare wholesale",
    "private spa skincare supplier",
    "wholesale organic spa products",
    "bulk luxury skincare for spas",

    // Pain + Purchase Intent
    "skincare for acne scars",
    "skincare routine for beginners",
    "best serums for glowing skin",
    "cheap bulk skincare online",
    "trusted skincare for spas",
    "effective anti-aging solutions",
    "top esthetician skincare brands",
    "natural acne treatment skincare",
    "bulk exfoliators for spas",
    "sensitive skin wholesale products",
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
  alternates: {
    canonical: "https://wholesaleskincareshop.com",
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
      <head>
        {/* Add Cloudinary widget script */}
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
          async
        ></script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KZPMGM3T62"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KZPMGM3T62');
            `,
          }}
        />
      </head>
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
