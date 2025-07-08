"use client";

import React from "react";
import { Header1Plus, Paragraph1, Paragraph3, ParagraphLink1 } from "../Text";
import Section6 from "../home/sections/Section6";
import AOS from "aos";

function Overview() {

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });
  
  return (
    <div className="pt-[20px] bg-bg_gray">
      <div data-aos="flip-right" className="container1">
        <div className="relative overflow-hidden">
          <div className="flex flex-col bg-primary sm:gap-[20px] px-4 sm:p-[65px] py-12 sm:py- rounded-t-[24px] w-full sm:text-center text-white">
            <Header1Plus>Privacy Policy</Header1Plus>
            <Paragraph3>
              At GrandioseGrin, your privacy is our priority. This policy
              explains how we collect, use, and safeguard your personal
              information when you shop with us or interact with our website.
            </Paragraph3>
          </div>
          <div className="absolute sm:-bottom-[200px] -bottom-[60px] overflow-hidden flex w-full">
            <img
              className="min-w-full"
              src="/images/white_bgR.svg"
              alt="privacy"
            />
          </div>
        </div>

        <div className="py-4 sm:py-[50px] rounded-b-[24px] text-p_black z-[10] bg-white px-4 sm:px-[65px] space-y-[18px] sm:space-y-[32px]">
          <div>
            <ParagraphLink1 className="font-bold text-primary">
              Information We Collect
            </ParagraphLink1>
            <Paragraph1>
              To provide the best experience at GrandioseGrin, we may collect:
              <br />
              - Personal Details: Name, email, phone number, and address
              provided during account creation or checkout.
              <br />
              - Purchase Data: Products bought and preferences to recommend
              tailored solutions.
              <br />- Cookies: Used to personalize your shopping experience and
              enhance website performance. Manage these via your browser
              settings.
            </Paragraph1>
          </div>

          <div>
            <ParagraphLink1 className="font-bold text-primary">
              How We Use Your Information
            </ParagraphLink1>
            <Paragraph1>
              Your information allows us to:
              <br />
              - Process Orders: Ensure smooth order fulfillment and shipping.
              <br />
              - Improve Services: Personalize product recommendations and
              enhance user experience based on preferences.
              <br />- Stay Connected: With your consent, share updates on new
              arrivals, promotions, or exclusive deals.
            </Paragraph1>
          </div>

          <div>
            <ParagraphLink1 className="font-bold text-primary">
              Safeguarding Your Data
            </ParagraphLink1>
            <Paragraph1>
              We implement industry-standard security measures to protect your
              personal data. While no system is completely secure, we are
              committed to keeping your information safe.
            </Paragraph1>
          </div>

          <div>
            <ParagraphLink1 className="font-bold text-primary">
              Sharing Your Information
            </ParagraphLink1>
            <Paragraph1>
              Your information is not sold or shared except:
              <br />
              - With Trusted Vendors: To facilitate payment processing,
              shipping, and other essential services.
              <br />- For Legal Compliance: When required by law or to protect
              our rights.
            </Paragraph1>
          </div>

          <div>
            <ParagraphLink1 className="font-bold text-primary">
              Your Rights
            </ParagraphLink1>
            <Paragraph1>
              You have the right to:
              <br />
              - Access, correct, or delete your personal details.
              <br />
              - Unsubscribe from marketing emails at any time.
              <br />- Manage cookies through your browser settings.
            </Paragraph1>
          </div>

          <div>
            <ParagraphLink1 className="font-bold text-primary">
              Links to External Websites
            </ParagraphLink1>
            <Paragraph1>
              Our website may include links to third-party platforms. We
              encourage you to review their privacy policies, as we are not
              responsible for their practices.
            </Paragraph1>
          </div>

          <div>
            <ParagraphLink1 className="font-bold text-primary">
              Changes to Our Privacy Policy
            </ParagraphLink1>
            <Paragraph1>
              Updates to this policy may occur periodically. All changes will be
              published here with an effective date. We recommend reviewing this
              policy regularly.
            </Paragraph1>
          </div>
        </div>
        <Section6 />
      </div>
    </div>
  );
}

export default Overview;
