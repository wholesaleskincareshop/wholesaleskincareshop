"use client";

import Button from "@/components/Button";
import { Header3, Header4, Header5, Paragraph1 } from "@/components/Text";
import Link from "next/link";
import React, { useState } from "react";
import AOS from "aos";


function Section5() {
  const [openedQuestionIndex, setOpenedQuestionIndex] = useState(null);

  const toggleParagraphVisibility = (index: any) => {
    setOpenedQuestionIndex(openedQuestionIndex === index ? null : index);
  };

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  // Array of FAQ items
  const faqs = [
    {
      id: 1,
      question: "Q. What types of skincare and beauty products do you offer?",
      answer:
        "At GrandioseGrin, we offer a wide range of skincare and cosmetic products, including moisturizers, serums, cleansers, and makeup. Each product is crafted to support different skin types and beauty needs.",
    },
    {
      id: 2,
      question: "Q. How can I place an order?",
      answer:
        "Placing an order is simple! Browse our collection, add items to your cart, and follow the checkout process. If you have any questions, our customer support team is here to help.",
    },
    {
      id: 3,
      question: "Q. How long will it take to receive my order?",
      answer:
        "We aim to process and ship all orders within 2-3 business days. Shipping times may vary based on your location, but you’ll receive a tracking link as soon as your order is on its way!",
    },
    {
      id: 4,
      question: "Q. Can I return or exchange products?",
      answer:
        "Yes, we offer a hassle-free return and exchange policy. If you’re not completely satisfied with your purchase, contact us within 30 days to initiate a return or exchange.",
    },
    {
      id: 5,
      question: "Q. Are your products suitable for sensitive skin?",
      answer:
        "Many of our products are designed with gentle, skin-friendly ingredients suitable for sensitive skin. Please check each product's description for specific details, and reach out if you need personalized advice.",
    },
    {
      id: 6,
      question: "Q. Do you offer samples or trial sizes?",
      answer:
        "Yes, we occasionally offer samples and trial sizes for select products. Keep an eye on our website or subscribe to our newsletter to stay updated on sample availability.",
    },
  ];

  return (
    <div>
      <div className=" container1 py-[54px] xl:p5-[100px] text-p_black">
        {" "}
        <div
          className=" flex flex-col xl:gap-[24px] items-center w-full mb-[24px] xl:mb-[64px]"
          data-aos="fade-up"
        >
          <Header3>
            Frequently Asked <span className=" text-primary">Questions</span>{" "}
          </Header3>
          <Paragraph1 className=" max-w-[883px] text-center ">
            Find answers to all your questions about our skincare and beauty
            products, ordering, and more.
          </Paragraph1>
        </div>
        <div
          className="flex-row items-center justify-center py-4 xl:py-[37px] bg-bg_gray rounded-lg "
          data-aos="flip-up"
        >
          {/* Mapping over FAQ items */}
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`w-full px-4 xl:px-[37px] pt-4 xl:py-[21px] ${
                index !== faqs.length - 1
                  ? "border-b-4 border-[#E4E4E7]"
                  : "xl:-mb-6"
              }`}
            >
              <div
                className="flex items-start   justify-between cursor-pointer"
                onClick={() => toggleParagraphVisibility(faq.id)}
              >
                <Header5 className="text-[18px] w-[250px] xl:w-full font-medium text-primary-50">
                  {faq.question}
                </Header5>
                <button
                  className=" flex justify-center items-center h-4 w-4  cursor-pointer"
                  onClick={() => toggleParagraphVisibility(faq.id)}
                >
                  <img
                    src={
                      openedQuestionIndex === faq.id
                        ? "/icons/dash.svg"
                        : "/icons/plus.svg"
                    }
                    alt=""
                    className=""
                    style={{
                      transform:
                        openedQuestionIndex === faq.id
                          ? "rotate(0deg)" // Keep it static or adjust if necessary
                          : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>
              </div>
              <p
                className={`text-[12px] xl:text-[14px]- md:text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[18px]  overflow-hidden  transition-all pb-4 pt-4 max-w-[90%] duration-300 ${
                  openedQuestionIndex === faq.id ? "max-h-[500px]" : "max-h-0"
                }`}
                style={{ opacity: openedQuestionIndex === faq.id ? "1" : "0" }}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Section5;
