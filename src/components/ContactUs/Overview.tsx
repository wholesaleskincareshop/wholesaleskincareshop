"use client";

import { Header1, Header1Plus, Paragraph1, Paragraph2 } from "@/components/Text";
import React from "react";
import FormComponent from "./FormSection";
import AOS from "aos";
import { Phone, Mail, MapPin, PhoneCall, MailIcon } from "lucide-react";


function Overview() {
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  return (
    <div className=" bg-bg_gray py-[70px] xl:py-[100px]">
      <div className=" container1    text-p_black" data-aos="flip-right">
        <div className=" grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className=" bg-primary rounded-lg h-full bg-cover bg-center py-[30px] px-4  sm:py-[100px] sm:px-[60px] flex flex-col justify-cente text-white [#95E4CF]  "
            style={{
              backgroundImage: `url('/images/bgyre.svg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Header1>Contact Us</Header1>

            <Paragraph1 className="text-">
              Have questions about our products or need expert recommendations?
              Fill out the form below — we’re here to help you choose the right
              solutions for healthy, confident skin.
            </Paragraph1>

            <div className=" flex mt-8 sm:mt-[120px] flex-col gap-[30px] sm:gap-[50px] ">
              <div className=" flex gap-2 items-start">
                <Phone className="sm:mt-2 min-w-8" />

                <div className="">
                  <Paragraph2> +2348140926533</Paragraph2>
                  <Paragraph2 className=" italic ">
                    {" "}
                    (Mon-Fri, 9am-5pm EST)
                  </Paragraph2>
                </div>
              </div>
              <div className=" flex gap-2 items-start">
                <MailIcon className="sm:mt-2 min-w-8" />

                <div className="">
                  <Paragraph2> wholesaleskincareshopp@gmail.com</Paragraph2>
                  <Paragraph2 className=" italic ">
                    {" "}
                    (We'll respond within 24 hours)
                  </Paragraph2>
                </div>
              </div>
              <div className=" flex gap-2 items-start">
                <MapPin className="sm:mt-2 min-w-8" />
                <div className="">
                  <Paragraph2> Amuwo Odofin festac,</Paragraph2>
                  <Paragraph2 className=" italic ">
                    {" "}
                    Lagos, Lagos, Nigeria
                  </Paragraph2>
                </div>
              </div>
            </div>
          </div>
          <div className=" bg-white sm:col-span-2 rounded-lg p-4  xl:p-[50px] flex flex-col   xl:gap-[24px] items-center w-full ">
            <Header1Plus className="text-center">
              Let’s <span className="text-primary">Elevate</span> Your Skincare
              Business — and Routine
            </Header1Plus>

            <div className=" mt-[24px] flex w-full xl:mt-[36px] space-y-[24px] mb-[24px]">
              {/* <Paragraph1 className="  text-center ">
              To ensure our best work, I only accept ONE new Strategic Business
              Brand Transformation client each month. 
            </Paragraph1>
            <Paragraph1 className=" text-center ">
              If you {"'"}re ready to #GetFocused and would like to see if your
              business is a good fit for our services, please fill out the form
              below and I {"'"}ll be in touch!
            </Paragraph1> */}
              <FormComponent />
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default Overview;
