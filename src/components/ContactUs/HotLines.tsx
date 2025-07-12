import React from "react";
import { Header3, Header4, Paragraph1 } from "../Text";

const HotLines = () => {
  const contacts = [
    {
      title: "Sales",
      description:
        "Would you like to join the circle of GrandioseGrin Cosmetics? If yes, do well to contact us.",
      phone: "+234 707 832 8640",
    },
    {
      title: "Complaints",
      description:
        "Feel free to reach out to us at any time if you have a complaint about any of our products or services.",
      phone: "+234 707 832 8640",
    },
    {
      title: "Returns",
      description:
        "Do you wish to return any of our products due to a defect or inappropriate choice? Reach us via WhatsApp now.",
      phone: "+234 707 832 8640",
    },
    {
      title: "Dealership",
      description:
        "Would you like to become a dealer with GrandioseGrin Cosmetics? Yes, do well to contact us.",
      phone: "+234 707 832 8640",
    },
  ];

  return (
    <div className="bg-gray-50 [#f8f5c9] py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <Header3 className="text-3xl font-bold text-gray-800 mb-8">
          Have any queries?{" "}
          <span className="text-primary">We're here to help.</span>
        </Header3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition duration-300"
            >
              <Header4 className="text-xl font-semibold text-gray-700 mb-2">
                {contact.title}
              </Header4>
              <Paragraph1 className="text-gray-600 mb-4">{contact.description}</Paragraph1>
              <a
                href={`tel:${contact.phone}`}
                className="text-primary font-medium hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotLines;
