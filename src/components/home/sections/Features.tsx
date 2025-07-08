import { Header4, Paragraph2 } from "@/components/Text";
import React from "react";
import AOS from "aos";

function Features() {
  const features = [
    {
      title: "Worldwide Shipping",
      description:
        "We deliver to over 100 countries, ensuring your orders reach you no matter where you are.",
      icon: "https://res.cloudinary.com/dtipo8fg3/image/upload/v1732732969/planet-earth_jgsslh.png", // Replace with actual image path
    },
    {
      title: "Best Quality",
      description:
        "Our products are crafted with premium materials, offering you unmatched quality and durability.",
      icon: "https://res.cloudinary.com/dtipo8fg3/image/upload/v1732732972/makeup_xrfl3s.png", // Replace with actual image path
    },
    {
      title: "Best Offer",
      description:
        "Enjoy unbeatable prices and incredible deals that make your shopping more rewarding.",
      icon: "https://res.cloudinary.com/dtipo8fg3/image/upload/v1732732969/tag_lihdso.png", // Replace with actual image path
    },
    {
      title: "Secure Payment",
      description:
        "Your transactions are protected with advanced encryption, ensuring complete peace of mind.",
      icon: "https://res.cloudinary.com/dtipo8fg3/image/upload/v1732732969/lock_fgzy8m.png", // Replace with actual image path
    },
  ];

    React.useEffect(() => {
      AOS.init({
        duration: 1000,
      });
    });

  return (
    <div className="container1 py-[50px] text-p_black">
      <div className="grid grid-cols-1 sm:grid-cols-4  gap-[24px] sm:gap-[36px] items-start">
        {features.map((feature, index) => (
          <div
            data-aos="fade-up"
            key={index}
            className="flex flex-col gap-4 justify-center text-center pb-4 "
          >
            <img
              src={feature.icon}
              alt={feature.title}
              className="w-16 h-16 mx-auto"
            />
            <Header4 className="text-lg font-semibold">{feature.title}</Header4>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
