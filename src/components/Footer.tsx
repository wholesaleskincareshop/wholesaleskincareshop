"use client"

import React from "react";
import { HeaderAny, Paragraph1, Paragraph2, ParagraphLink1, ParagraphLink2 } from "./Text";
import Button from "./Button";
import Link from "next/link";
import { usePathname } from "next/navigation";


function Footer() {
  const pathname = usePathname();
  
  if (pathname.includes("/admin")) {
    return null; // Return null to hide the navbar
  }


  return (
    <div
      className={
        ["/products", "/blog"].includes(pathname)
          ? "bg-bg_gray hidden sm:py-[100px]-"
          : " bg-white sm:py-[100px]-"
      }
    >
      <div className="  bg-black [#4A4A4A]  ">
        <div className=" container1 py-[32px] sm:py-[40px] ">
          {/* desktop */}
          <div className="sm:flex hidden items-start justify-between mb-[30px]">
            <div className="w-[100px] relative  ">
              <img
                src="/logo.jpg"
                alt="photographer"
                className=" rounded-full"
              />
            </div>
            <div className="  gap-[28px] grid grid-cols-2  ">
              <Link href="/">
                <ParagraphLink1
                  className={
                    pathname === "/"
                      ? "text-[#ECECEC] font-bold "
                      : " text-[#ECECEC] "
                  }
                >
                  Home
                </ParagraphLink1>
              </Link>{" "}
              <Link href="/about-us">
                {" "}
                <ParagraphLink1
                  className={
                    pathname === "/about-us"
                      ? "text-[#ECECEC] font-bold "
                      : " text-[#ECECEC] "
                  }
                >
                  About
                </ParagraphLink1>
              </Link>
              <Link href="/products">
                {" "}
                <ParagraphLink1
                  className={
                    pathname === "/products"
                      ? "text-[#ECECEC] font-bold "
                      : " text-[#ECECEC] "
                  }
                >
                  Shop
                </ParagraphLink1>
              </Link>
              <Link href="/blogs">
                {" "}
                <ParagraphLink1
                  className={
                    pathname === "/blogs"
                      ? "text-[#ECECEC] font-bold "
                      : " text-[#ECECEC] "
                  }
                >
                  Blog
                </ParagraphLink1>
              </Link>
              <Link href="/contact-us">
                {" "}
                <ParagraphLink1
                  className={
                    pathname === "/contact-us"
                      ? "text-[#ECECEC] font-bold "
                      : " text-[#ECECEC] "
                  }
                >
                  Contact us
                </ParagraphLink1>
              </Link>
            </div>
            <div className=" flex flex-col py-4 gap-2 items-center- justify-center-">
              <div className=" flex gap-4 items-center mb-2">
                <Link
                  href="https://www.instagram.com/grandiosegrin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1729676533/utilities/templates/instagram_2_ujmgac.png"
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                </Link>
                <Link
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1729676725/utilities/templates/facebook-app-symbol_x2whit.png"
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                </Link>
                <Link
                  href="https://www.x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1729675779/utilities/templates/twitter_3_sihd1i.png"
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                </Link>
              </div>

              <div className=" flex items-center gap-2 text-[#ECECEC] ">
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>

                <Paragraph2> wholesaleskincareshopp@gmail.com</Paragraph2>
              </div>
              <div className=" flex items-center gap-2 text-[#ECECEC] ">
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
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>

                <Paragraph2> +2348140926533</Paragraph2>
              </div>
            </div>
            <div className=" py-2 px-4 rounded-lg bg-white flex justify-center items-center gap-2 flex-col">
              <p className=" text-[12px]  ">
                {" "}
                Payments secuered by{" "}
                <span className=" font-bold">Flutterwave</span>{" "}
              </p>
              <div className=" flex gap-4 flex-col- items-center">
                {" "}
                <img
                  src="https://res.cloudinary.com/dtipo8fg3/image/upload/v1732661439/image-removebg-preview_6_sygmis.png"
                  alt=""
                  className=" w-[30px] h-[30px]"
                />{" "}
                <img
                  src="https://res.cloudinary.com/dtipo8fg3/image/upload/v1732660748/image-removebg-preview_5_doqrew.png"
                  alt=""
                  className=" w-[200px]"
                />
              </div>
            </div>
          </div>
          <div className=" sm:flex justify-center items-center hidden py-4"></div>

          {/* mobile  */}
          <div className=" mb-[24px] sm:hidden sm:mb-[110px]">
            <div className=" space-y-[24px] mb-[24px] ">
              {" "}
              <Link href="/">
                {" "}
                <ParagraphLink1 className=" text-[#ECECEC]  ">
                  Home{" "}
                </ParagraphLink1>
              </Link>
              <Link href="/about-us">
                {" "}
                <ParagraphLink2 className=" text-[#ECECEC]  ">
                  About{" "}
                </ParagraphLink2>
              </Link>
              <Link href="/products">
                {" "}
                <ParagraphLink2 className=" text-[#ECECEC] ">
                  Shop
                </ParagraphLink2>
              </Link>
              <Link href="/blog">
                {" "}
                <ParagraphLink2 className=" text-[#ECECEC] ">
                  Blog
                </ParagraphLink2>
              </Link>
              <Link href="/contact-us">
                {" "}
                <ParagraphLink2 className=" text-[#ECECEC] ">
                  Contact us
                </ParagraphLink2>
              </Link>
              <div className=" flex flex-col p-4- gap-2 items-center- justify-center-">
                <div className=" flex gap-4 items-center mb-4">
                  <Link
                    href="https://www.instagram.com/grandiosegrin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1729676533/utilities/templates/instagram_2_ujmgac.png"
                      alt="instagram"
                      className="w-[14px] h-[14px]"
                    />
                  </Link>
                  <Link href="/">
                    <img
                      src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1729676725/utilities/templates/facebook-app-symbol_x2whit.png"
                      alt="facebook"
                      className="w-[14px] h-[14px]"
                    />
                  </Link>
                  <Link href="/">
                    <img
                      src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1729675779/utilities/templates/twitter_3_sihd1i.png"
                      alt=""
                      className="w-[14px] h-[14px]"
                    />
                  </Link>
                </div>
                <div className=" flex items-center gap-2 text-[#ECECEC] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>

                  <Paragraph2> wholesaleskincareshopp@gmail.com</Paragraph2>
                </div>
                <div className=" flex items-center gap-2 text-[#ECECEC] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>

                  <Paragraph2> +2348140926533</Paragraph2>
                </div>
              </div>
            </div>

            <div className="col-span-1 order-2 sm:order-1 hidden">
              {" "}
              <img
                src="/images/logo2.png"
                alt="photographer"
                className=" "
              />{" "}
            </div>
          </div>

          <div className=" border-t pt-[24px] sm:pt-[32px] flex flex-wrap justify-between">
            <div className=" flex justify-center items-center sm:hidden py-4">
              <div className=" py-2 px-4 rounded-lg bg-white flex justify-center items-center gap-2 flex-col">
                <p className=" text-[12px]  ">
                  {" "}
                  Payments secuered by{" "}
                  <span className=" font-bold">Flutterwave</span>{" "}
                </p>
                <div className=" flex gap-4 flex-col- items-center">
                  {" "}
                  <img
                    src="https://res.cloudinary.com/dtipo8fg3/image/upload/v1732661439/image-removebg-preview_6_sygmis.png"
                    alt=""
                    className=" w-[20px] h-[20px]"
                  />{" "}
                  <img
                    src="https://res.cloudinary.com/dtipo8fg3/image/upload/v1732660748/image-removebg-preview_5_doqrew.png"
                    alt=""
                    className=" w-[150px]"
                  />
                </div>
              </div>
            </div>
            <ParagraphLink2 className=" text-[14px] text-[#ECECEC] ">
              © 2024 Wholesale Skincare Shop Ltd. All rights reserved.
            </ParagraphLink2>
            <div className="flex flex-wrap gap-[24px] items-center">
              <Link href="/privacy-policy" className="">
                {" "}
                <ParagraphLink2 className=" text-[14px] text-[#ECECEC] underline ">
                  Privacy Policy
                </ParagraphLink2>
              </Link>

              <Link href="/terms-of-service">
                <ParagraphLink2 className=" text-[14px] text-[#ECECEC] underline">
                  Terms of Service{" "}
                </ParagraphLink2>
              </Link>

              {/* <Link href="/">
                {" "}
                <ParagraphLink2 className=" text-[#ECECEC] underline">
                  Cookies Settings{" "}
                </ParagraphLink2>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
