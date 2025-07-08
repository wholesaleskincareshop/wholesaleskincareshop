"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState, useEffect, useRef } from "react";
import { ParagraphLink1 } from "../Text";
import Button from "../Button";
import AOS from "aos";
import React from "react";
import { db } from "@/lib/firebase"; // Import Firestore database
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { sendEmail } from "@/lib/serverActions"; // Import server action

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  contact_methods: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one contact method"),
  services_needed: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one service"),
  location: Yup.string().required("location is required"),
  productDetail: Yup.string().required("Product Detail is required"),
});

const FormComponent = () => {
  const [phone, setPhone] = useState("");
  const [successPopupVisible, setSuccessPopupVisible] = useState(false); // State for popup
  const successPopupRef = useRef<HTMLDivElement>(null); // Ref for the success popup
  const [attemptedSubmit, setAttemptedSubmit] = useState(false); // Tracks if the user tried to submit the form

  // Firestore submission function
  const submitToFirestore = async (values: any) => {
    try {
      const docRef = await addDoc(collection(db, "formSubmissions"), {
        ...values,
        phoneNumber: phone,
        timestamp: new Date(),
        viewed: false, // Add the viewed field and set it to true
      });
      console.log("Document written with ID: ", docRef.id);
      setSuccessPopupVisible(true); // Show success popup
      // Scroll to the success popup (white box)
      setTimeout(() => {
        successPopupRef.current?.scrollIntoView({
          behavior: "smooth", // Smooth scroll
          block: "center", // Center the element in the view
        });
      }, 1000);

      // Send the email notification
      await sendEmail(); // Use the imported server action

      // Handle success case (e.g., show a success message or navigate)
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle error case (e.g., show an error message)
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      contact_methods: [],
      services_needed: [],
      location: "",
      productDetail: "",
      aboutushow: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form Data", values);
      await submitToFirestore(values); // Call the Firestore submission
    },
  });

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  const SuccessPopup = () => {
    return (
      <div className="fixed inset-0 -top-[175px] -left-[100px] -right-[100px] h-screen- min-w-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div
          ref={successPopupRef}
          className="bg-white flex flex-col text-center gap-[24px] items-center rounded-lg [20px] sm:px-[82px] p-[24px] sm:py-[62px] shadow-lg"
        >
          <img src="/images/logo.png" alt="" className="h-[50px]" />
          <div>
            <ParagraphLink1 className="  text-cente font-bold ">
              Successful!{" "}
            </ParagraphLink1>{" "}
            <p>
              Thanks for your interest in working with me! <br /> we{"’"}ll be
              in touch within 48 hours.
            </p>
          </div>
          <Button
            text="Done"
            href="/about-us"
            isLink={true}
            additionalClasses=" border-0  sm:min-w-[385px] min-w-full "
          />{" "}
        </div>
      </div>
    );
  };

  return (
    <div className=" min-w-full  ">
      {/* <button onClick={async () => await sendEmail()}>Send</button> */}
      {successPopupVisible && <SuccessPopup />} {/* Render the success popup */}
      <form onSubmit={formik.handleSubmit} className="min-w-full ">
        <div>
          <div className="grid min-w-full  grid-cols-1 md:grid-cols-2 gap-[24px] xl:gap-[32px] mb-6 text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px]">
            <div>
              <label className="block text-gray-700">
                <ParagraphLink1 className="  text-cente font-bold ">
                  First Name
                </ParagraphLink1>
              </label>
              <input
                type="text"
                name="firstName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                className="w-full border rounded-[10px] p-2 outline-none"
                placeholder="Enter your first name"
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-500 ">{formik.errors.firstName}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-gray-700">
                {" "}
                <ParagraphLink1 className="  text-cente font-bold ">
                  Last Name
                </ParagraphLink1>
              </label>
              <input
                type="text"
                name="lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                className="w-full border rounded-[10px]  p-2 outline-none"
                placeholder="Enter your last name"
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-red-500 ">{formik.errors.lastName}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-gray-700">
                {" "}
                <ParagraphLink1 className="  text-cente font-bold ">
                  Email Address
                </ParagraphLink1>
              </label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full border rounded-[10px] p-2 outline-none "
                placeholder="Enter your email address"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 ">{formik.errors.email}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-gray-700">
                <ParagraphLink1 className="  text-cente font-bold ">
                  {" "}
                  Phone Number{" "}
                </ParagraphLink1>
              </label>

              <PhoneInput
                country={"us"}
                value={phone}
                onChange={(phone) => {
                  setPhone(phone);
                  formik.setFieldValue("phoneNumber", phone);
                }}
                inputStyle={{
                  width: "100%",
                  //   padding: "20px",
                  height: "46px",
                  borderRadius: "10px",
                  // padding: "2px",
                  //   borderColor: "#E5E7EB",
                  // fontSize: "16px", // Increase font size for larger text
                }}
                buttonStyle={{
                  width: "0px", // Increase the width of the flag area
                  borderRadius: "10px",
                  backgroundColor: "white",
                  borderColor: "white",
                  border: "0px",
                  borderWidth: "0px",
                  margin: "4px",
                }}
                containerClass="phone-input-container"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500 ">{formik.errors.phoneNumber}</div>
              ) : null}
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                <ParagraphLink1 className="  text-cente font-bold ">
                  {" "}
                  Preferred Method of Contact
                </ParagraphLink1>
              </p>

              <div className="flex flex-col space-y-3">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="contact_methods"
                    value="email"
                    onChange={formik.handleChange}
                    className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                  />
                  <span className="ml-2 text-gray-700">
                    <ParagraphLink1 className="  text-cente ">
                      {" "}
                      Email
                    </ParagraphLink1>
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="contact_methods"
                    value="phone_call"
                    onChange={formik.handleChange}
                    className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                  />
                  <span className="ml-2 text-gray-700">
                    <ParagraphLink1 className="  text-cente ">
                      {" "}
                      Phone call
                    </ParagraphLink1>
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="contact_methods"
                    value="whatsapp"
                    onChange={formik.handleChange}
                    className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                  />
                  <span className="ml-2 text-gray-700">
                    <ParagraphLink1 className="  text-cente ">
                      {" "}
                      WhatsApp
                    </ParagraphLink1>
                  </span>
                </label>
              </div>
              {formik.touched.contact_methods &&
              formik.errors.contact_methods ? (
                <div className="text-red-500 ">
                  {formik.errors.contact_methods}
                </div>
              ) : null}
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                <ParagraphLink1 className="  text-cente font-bold ">
                  {" "}
                  Product Category
                </ParagraphLink1>
              </p>

              <div className="flex flex-col space-y-3">
                <div className=" grid grid-cols-2 gap-3">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="services_needed"
                      value="Creams"
                      onChange={formik.handleChange}
                      className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                    />
                    <span className="ml-2 text-gray-700">
                      <ParagraphLink1 className="  text-cente ">
                        {" "}
                        Creams
                      </ParagraphLink1>
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="services_needed"
                      value="Lipsticks"
                      onChange={formik.handleChange}
                      className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                    />
                    <span className="ml-2 text-gray-700">
                      <ParagraphLink1 className="  text-cente ">
                        {" "}
                        Lipsticks
                      </ParagraphLink1>
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="services_needed"
                      value="Foundations"
                      onChange={formik.handleChange}
                      className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                    />
                    <span className="ml-2 text-gray-700">
                      <ParagraphLink1 className="  text-cente ">
                        {" "}
                        Foundations
                      </ParagraphLink1>
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="services_needed"
                      value="commercial"
                      onChange={formik.handleChange}
                      className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                    />
                    <span className="ml-2 text-gray-700">
                      <ParagraphLink1 className="  text-cente ">
                        {" "}
                        Serums
                      </ParagraphLink1>
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="services_needed"
                      value="Lotion"
                      onChange={formik.handleChange}
                      className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                    />
                    <span className="ml-2 text-gray-700">
                      <ParagraphLink1 className="  text-cente ">
                        {" "}
                        Lotion
                      </ParagraphLink1>
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="services_needed"
                      value="others"
                      onChange={formik.handleChange}
                      className="form-checkbox min-h-5 min-w-5 text-orange-500 appearance-none checked:bg-primary checked:border-transparent focus:outline-none border border-primary rounded checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:flex checked:after:justify-center"
                    />
                    <span className="ml-2 text-gray-700">
                      <ParagraphLink1 className="  text-cente ">
                        {" "}
                        Others
                      </ParagraphLink1>
                    </span>
                  </label>
                </div>
              </div>
              {formik.touched.services_needed &&
              formik.errors.services_needed ? (
                <div className="text-red-500 ">
                  {formik.errors.services_needed}
                </div>
              ) : null}
            </div>
          </div>

          <div className=" space-y-[24px] xl:space-y-[32px]">
            <div>
              <label className="block text-gray-700">
                <ParagraphLink1 className="  text-cente font-bold ">
                  {" "}
                  Location
                </ParagraphLink1>
              </label>
              <input
                type="text"
                name="location"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.location}
                className="w-full border rounded-[10px] p-2 outline-none"
                placeholder="Where are you messaging us from?"
              />
              {formik.touched.location && formik.errors.location ? (
                <div className="text-red-500 ">{formik.errors.location}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-gray-700">
                <ParagraphLink1 className="  text-cente font-bold ">
                  Details/Message
                </ParagraphLink1>
              </label>
              <textarea
                name="productDetail"
                onChange={formik.handleChange}
                placeholder="Provide information about your request or specific questions"
                onBlur={formik.handleBlur}
                value={formik.values.productDetail}
                className="w-full border rounded-[10px] p-2 h-[169px] outline-none "
              />
              {formik.touched.productDetail && formik.errors.productDetail ? (
                <div className="text-red-500 ">
                  {formik.errors.productDetail}
                </div>
              ) : null}
            </div>{" "}
            <div>
              <label className="block text-gray-700">
                <ParagraphLink1 className="text-center- font-bold">
                  How Did You Hear About Us?
                </ParagraphLink1>
              </label>
              <input
                type="text"
                name="aboutushow"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.aboutushow}
                className="w-full border rounded-[10px] p-2 outline-none "
                placeholder=""
              />
            </div>
          </div>

          <div className="flex justify-center w-full xl:mt-[80px] mt-[24px]">
            <Button
              text="Submit"
              type="submit"
              disabled={Object.keys(formik.errors).length > 0}
              additionalClasses=" w-full max-w-fit border-primary-"
            />
          </div>
          {Object.keys(formik.errors).length > 0 && (
            <div className="flex justify-center w-full">
              <p className="text-red-500 ">
                Please fill all the necessary fields correctly before
                proceeding.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormComponent;
