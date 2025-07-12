"use client";

import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { Header3, Header4, Paragraph1, Paragraph3 } from "@/components/Text";

function Questions() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [openSection, setOpenSection] = useState<number | null>(0); // default open first

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? null : section);
  };

  const faqs = [
    {
      id: 1,
      question: "Q. What types of skincare products do you offer?",
      answer:
        "We offer a wide range of skincare essentials including cleansers, serums, moisturizers, masks, and more — suitable for professional use in spas and salons, as well as individual daily routines.",
    },
    {
      id: 2,
      question: "Q. Can I buy in bulk as a business or spa?",
      answer:
        "Absolutely. Our platform is designed for both wholesale and retail customers. You can choose bulk quantities during checkout and receive tiered pricing based on order size.",
    },
    {
      id: 3,
      question: "Q. How do I place an order?",
      answer:
        "Just browse our product collection, select your items, and proceed through our secure checkout. Bulk and single-item orders are both supported, and we accept multiple payment methods.",
    },
    {
      id: 4,
      question: "Q. How fast will my order ship?",
      answer:
        "Orders are typically processed within 1–3 business days. Shipping times vary by location, but you’ll receive tracking information via email once your order is on the way.",
    },
    {
      id: 5,
      question: "Q. Do you accept returns or exchanges?",
      answer:
        "Yes, we offer a 30-day return and exchange window. If you're not fully satisfied, contact our support team and we’ll help you initiate a return or swap.",
    },
    {
      id: 6,
      question: "Q. Are your products suitable for sensitive skin?",
      answer:
        "Many of our formulas are developed with sensitive skin in mind. Be sure to review individual product descriptions or contact us for personalized recommendations.",
    },
    {
      id: 7,
      question: "Q. Do you provide samples or trial sizes?",
      answer:
        "Yes, we occasionally offer samples for select products. Subscribe to our newsletter or follow us online to stay informed about sample availability.",
    },
  ];
  

 
  return (
    <div className="  bg-bg_gray  py-[50px] ">
      <div className=" container1 sm:px-[34px] sm:pt-[24px] p-4 ">
        <div
        // data-aos="fade-left"
        >
          <div className=" flex justify-center flex-col items-center mb-[30px]">
            <Header3 className=" text-center">
              Frequently Asked <span className="text-primary">Questions</span>
            </Header3>
            <Paragraph1 className="max-w-[883px] text-center">
              Get quick answers to common questions about our products,
              wholesale pricing, order process, shipping, and more.
            </Paragraph1>
          </div>
          {faqs.map((item, index) => (
            <div
              key={index}
              className={` mb-[16px] px-[14px] sm:px-[32px]  rounded-[24px] ${
                openSection === index
                  ? "sm: bg-white py-[10px]  sm:py-[20px]"
                  : "sm: bg-white [#e8f6f5] py-[12px] sm:py-[20px]"
              } p-4 transition-colors duration-300`}
            >
              <button
                className="w-full text-left flex justify-between items-center text-[17px] "
                onClick={() => toggleSection(index)}
              >
                <Header4> {item.question} </Header4>
                <Header3>{openSection === index ? "−" : "+"} </Header3>
              </button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={
                  openSection === index
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {item.answer && (
                  <Paragraph1 className="mt-[24px] text-[14px] text-gray-700">
                    {item.answer}
                  </Paragraph1>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Questions;
