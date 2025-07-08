"use client";

import {
  Header1,
  Header2,
  Header3,
  Header4,
  Header5,
  Paragraph1,
  Paragraph2,
  ParagraphLink2,
} from "@/components/Text";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Firestore functions
import AOS from "aos";
import SearchBar from "../navBar/SearchBar";
import SummaryBlocks from "./SummaryBlocks";
import NewOrders from "./NewOrders";

type Submission = {
  id: string;
  initials: string;
  name: string;
  firstName: string;
  secondName: string;
  email: string;
  phoneNumber: string;
  location: string;
  productDetail: string;
  aboutushow: string;
  contact_methods: string[];
  services_needed: string[];
  viewed: boolean;
  timestamp: string;
};

function NewSubmission() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "formSubmissions"));

        type Submission = {
          id: string;
          initials: string;
          name: string;
          firstName: string;
          secondName: string;
          email: string;
          phoneNumber: string;
          location: string;
          productDetail: string;
          aboutushow: string;
          contact_methods: string[];
          services_needed: string[];
          viewed: boolean;
          timestamp: string;
        };

        const submissionData: Submission[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          initials: doc.data().firstName[0] + doc.data().lastName[0], // Assuming you have firstName and lastName in your form
          name: `${doc.data().firstName} ${doc.data().lastName}`,
          firstName: doc.data().firstName,
          secondName: doc.data().lastName,
          email: doc.data().email,
          phoneNumber: doc.data().phoneNumber,
          location: doc.data().location,
          productDetail: doc.data().productDetail,
          aboutushow: doc.data().aboutushow,
          contact_methods: doc.data().contact_methods,
          services_needed: doc.data().services_needed,
          viewed: doc.data().viewed || false, // Retrieve 'viewed' field, defaulting to false
          timestamp: doc.data().timestamp
            ? doc.data().timestamp.toDate()
            : null,
        }));

        // Update total submissions and unread submissions count
        setTotalSubmissions(submissionData.length);
        setUnreadCount(submissionData.filter((s) => !s.viewed).length);

        // Sort submissions by timestamp, handling nulls
        submissionData.sort((a, b) => {
          // @ts-ignore
          const timeA = a.timestamp ? a.timestamp.getTime() : 0;
          // @ts-ignore
          const timeB = b.timestamp ? b.timestamp.getTime() : 0;
          return timeB - timeA;
        });

        setSubmissions(submissionData);
        setFilteredSubmissions(submissionData); // Initialize filtered submissions
      } catch (error) {
        console.error("Error fetching submissions: ", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchSubmissions();
  }, []);

  // Filter unread submissions
  const showUnreadSubmissions = () => {
    const unread = submissions.filter((submission) => !submission.viewed);
    setFilteredSubmissions(unread);
  };

  function showAllSubmissions() {
    setFilteredSubmissions(submissions); // Show all submissions
  }

  const handleClick = async (submission: Submission) => {
    // Update the viewed status in Firestore
    const submissionDocRef = doc(
      db,
      "formSubmissions",
      submission.id.toString()
    ); // Assuming id is the Firestore document ID

    try {
      await updateDoc(submissionDocRef, { viewed: true }); // Update the viewed field
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    // Set the submission as viewed
    const updatedSubmissions = submissions.map((sub) =>
      sub.id === submission.id ? { ...sub, viewed: true } : sub
    );
    setSubmissions(updatedSubmissions); // Update state with viewed submission
    setSelectedSubmission(submission);

    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedSubmission(null);
  };

  // Predefined list of colors to cycle through
  const bgColors = ["bg-red-500", "bg-green-500", "bg-blue-600"];

  console.log(selectedSubmission); // Check if the object is populated

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const formatTimestamp = (timestamp: Date | null): string => {
    if (!timestamp) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const formattedTime = timestamp.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const formattedDate = timestamp.toLocaleDateString("en-US", options);

    // Extract day from formattedDate to append "th", "st", "nd", or "rd"
    const day = timestamp.getDate();
    const daySuffix = (day: any) => {
      if (day > 3 && day < 21) return "th"; // We only need to worry about 11-13 for suffix
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return ` ${formattedDate}`;
  };

  return (
    <div className=" bg-bg_gray min-h-screen pb-[100px] text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px]">
      <div className="mx- lg:mx-0">
        <div className="container1  pt-[100px] xl:pt-[104px] pb-[24px] ">
          <SummaryBlocks />
          <div className="grid- hidden grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className=" col-span-1">
              {" "}
              <div className=" w-full bg-white rounded-lg p-4">
                {" "}
                <Header5 className=" ">Total Form Submission </Header5>{" "}
                <Header4 className="text-black ">{totalSubmissions}</Header4>
              </div>
            </div>
            <div className=" col-span-1">
              {" "}
              <div className=" w-full bg-white rounded-lg p-4">
                {" "}
                <Header5 className=" ">Unread Submissions </Header5>{" "}
                <Header4 className="text-black ">{unreadCount}</Header4>
              </div>
            </div>
          </div>

          <div className=" grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className=" sm:col-span-3">
              {" "}
              <NewOrders />
            </div>
            <div className=" sm:col-span-2">
              <div className="mx-4- xl:mx-0 ">
                <div className="  bg-white py-[35px] p  rounded-lg shadow-md">
                  <div className="px-2  xl:px-4">
                    {selectedSubmission ? (
                      // Render the detailed view if a submission is selected
                      <div data-aos="zoom-in" className="">
                        <div className=" flex  border-b pb-2 w-full  gap-4 items-center">
                          <button
                            onClick={handleBack}
                            className="hover:scale-110 transition-transform duration-300"
                          >
                            <img
                              src="/icons/back1.svg"
                              alt=""
                              className=" w-[50px]- h-[25px] sm:h-[50px]"
                            />
                          </button>

                          <div className=" flex w-full-">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-[50px] h-[50px] flex items-center justify-center text-white rounded-full bg-primary -${
                                  bgColors[
                                    selectedSubmission.id.length %
                                      bgColors.length
                                  ]
                                }`}
                              >
                                <span className="text-lg font-bold">
                                  {selectedSubmission.initials}
                                </span>
                              </div>
                              <div>
                                <Header5 className="text-[23px] ">
                                  {selectedSubmission.name}
                                </Header5>
                                <Paragraph2 className="text-[14px] sm:-mt-2 font-semibold-">
                                  {selectedSubmission.email}
                                </Paragraph2>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className=" text-[14px] mt-[40px] space-y-[20px]">
                          {" "}
                          <div className=" px-4 sm:px-[20px] py-[20px] bg-bg_gray rounded-[15px] space-y-[10px]">
                            <Paragraph2 className="text-[14px] text-gray-500 text-center underline-">
                              {formatTimestamp(
                                typeof selectedSubmission.timestamp === "string"
                                  ? new Date(selectedSubmission.timestamp) // Convert string to Date
                                  : selectedSubmission.timestamp // Use as is if it's already a Date object
                              )}{" "}
                              {/* Use the custom formatting function */}
                            </Paragraph2>
                            <div className=" grid grid-cols-1 xl:grid-cols-1 items-center gap-4 sm:gap-[20px] ">
                              <div>
                                <ParagraphLink2 className="  text-cente font-bold ">
                                  First Name
                                </ParagraphLink2>
                                <div className=" p-4 bg-white rounded-[12px]">
                                  <p className=" ">
                                    {selectedSubmission.firstName}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <ParagraphLink2 className="  text-cente font-bold ">
                                  Last Name
                                </ParagraphLink2>
                                <div className=" p-4 bg-white rounded-[12px]">
                                  <p className=" ">
                                    {selectedSubmission.secondName}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <ParagraphLink2 className="  text-cente font-bold ">
                                  E-mail address{" "}
                                </ParagraphLink2>
                                <div className=" p-4 bg-white rounded-[12px]">
                                  <p className=" ">
                                    {selectedSubmission.email}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <ParagraphLink2 className="  text-cente font-bold ">
                                  Phone Number{" "}
                                </ParagraphLink2>
                                <div className=" p-4 bg-white rounded-[12px]">
                                  <p className=" ">
                                    {selectedSubmission.phoneNumber}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <ParagraphLink2 className=" font-bold">
                                  Preferred Method of Contact
                                </ParagraphLink2>
                                <div className="flex w-full flex-col">
                                  <div className="mt-[12px] flex flex-col gap-[16px]">
                                    {Array.isArray(
                                      selectedSubmission?.contact_methods
                                    ) &&
                                      selectedSubmission?.contact_methods.map(
                                        (contact_method, index) => {
                                          // Render specific text based on the value of `quality`
                                          let displayText = "";

                                          switch (contact_method) {
                                            case "email":
                                              displayText = "Email";
                                              break;
                                            case "phone_call":
                                              displayText = "Phone call";
                                              break;
                                            case "whatsapp":
                                              displayText = "WhatsApp";
                                              break;
                                            default:
                                              displayText = "Unknown"; // Fallback text if needed
                                          }

                                          return (
                                            <div
                                              key={index}
                                              className="flex items-center gap-[13px]"
                                            >
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
                                                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                              </svg>
                                              <ParagraphLink2 className="text-center font-bold">
                                                {displayText}
                                              </ParagraphLink2>
                                            </div>
                                          );
                                        }
                                      )}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <ParagraphLink2 className=" font-bold">
                                  Product Category
                                </ParagraphLink2>
                                <div className="flex w-full flex-col">
                                  <div className="mt-[12px] flex flex-col gap-[16px]">
                                    {Array.isArray(
                                      selectedSubmission?.services_needed
                                    ) &&
                                      selectedSubmission.services_needed.map(
                                        (service_needed, index) => {
                                          // Render specific text based on the value of `service_needed`
                                          let displayText = "";

                                          switch (service_needed) {
                                            case "Creams":
                                              displayText = "Creams";
                                              break;
                                            case "Lipsticks":
                                              displayText = "Lipsticks";
                                              break;
                                            case "Foundations":
                                              displayText = "Foundations";
                                              break;
                                            case "Serums":
                                              displayText = "Serums";
                                              break;
                                            case "Lotion":
                                              displayText = "Lotion";
                                              break;
                                            case "others":
                                              displayText = "Others";
                                              break;
                                            default:
                                              displayText = "Unknown"; // Fallback text if needed
                                          }

                                          return (
                                            <div
                                              key={index}
                                              className="flex items-center gap-[13px]"
                                            >
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
                                                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                              </svg>
                                              <ParagraphLink2 className="text-center font-bold">
                                                {displayText}
                                              </ParagraphLink2>
                                            </div>
                                          );
                                        }
                                      )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <ParagraphLink2 className="  text-cente font-bold ">
                                  Location{" "}
                                </ParagraphLink2>
                                <div className=" p-4 bg-white rounded-[12px]">
                                  <p className=" ">
                                    {selectedSubmission.location}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>{" "}
                          <div className=" px-[30px] py-[39px] bg-bg_gray rounded-[15px] space-y-[40px]">
                            <div>
                              <ParagraphLink2 className="  text-cente font-bold ">
                                Details/Message
                              </ParagraphLink2>
                              <div className=" p-4 bg-white rounded-[12px]">
                                <p className=" ">
                                  {selectedSubmission.productDetail}
                                </p>
                              </div>
                            </div>

                            <div>
                              <ParagraphLink2 className="  text-cente font-bold ">
                                How Did You Hear About Us?
                              </ParagraphLink2>
                              <div className=" p-4 bg-white rounded-[12px]">
                                <p className=" ">
                                  {selectedSubmission.aboutushow}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      // Render the list of submissions if none is selected
                      <div className="space-y-2 scrollable-div- overflow-y-auto- max-h-screen- ">
                        <div className=" flex items-center justify-between gap-4">
                          <SearchBar
                            submissions={submissions}
                            // @ts-ignore
                            onSearchResults={setFilteredSubmissions}
                          />
                          <div className="relative">
                            <button onClick={toggleFilter}>
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
                                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                                />
                              </svg>
                            </button>

                            {isFilterOpen && (
                              <div className="absolute space-y- z-10 -bottom-[120px] right-0 bg-white px-4 py-2 rounded-lg shadow-md">
                                <button onClick={() => showAllSubmissions()}>
                                  <Paragraph2 className="text-[14px] whitespace-nowrap">
                                    All submissions
                                  </Paragraph2>
                                </button>

                                <button onClick={() => showUnreadSubmissions()}>
                                  <Paragraph2 className="text-[14px] whitespace-nowrap">
                                    All unread
                                  </Paragraph2>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className=" h-screen space-y- overflow-y-auto scrollable-div px-2 ">
                          {" "}
                          <Header5 className="pt-3">New Submissions</Header5>
                          <div className=" flex items-center gap-4">
                            <div className=" flex- border hidden rounded-lg px-2 gap-2">
                              {" "}
                              <ParagraphLink2>
                                {totalSubmissions}
                              </ParagraphLink2>{" "}
                              <Paragraph1>Form</Paragraph1>
                            </div>
                            <div className=" flex- hidden border-b rounded-lg px-2 gap-2">
                              {" "}
                              <ParagraphLink2>
                                {unreadCount}
                              </ParagraphLink2>{" "}
                              <Paragraph1>Unread</Paragraph1>
                            </div>
                          </div>
                          {filteredSubmissions.map((submission, index) => (
                            <div
                              key={submission.id}
                              className={`flex items-start  space-x-4 py-2 bg-white rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 ${
                                submission.viewed ? "text-gray-400" : "" // Change text color for viewed submissions
                              }`}
                              onClick={() => handleClick(submission)}
                            >
                              <div
                                className={`min-w-12 min-h-12 flex items-center justify-center mt-2 text-white rounded-full ${
                                  bgColors[index % bgColors.length]
                                }`}
                              >
                                <span className="text-lg font-bold">
                                  {submission.initials}
                                </span>
                              </div>
                              <div className="flex-1 w-full overflow-hidden border-b pb-2">
                                <Paragraph1 className="text-[14px] font-semibold">
                                  {submission.name}
                                </Paragraph1>

                                <Paragraph2 className=" text-[14px] xl:-mt-2 truncate overflow-hidden whitespace-nowrap lg: max-w-[90%] -max-w-[300px]">
                                  {submission.productDetail}
                                </Paragraph2>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSubmission;
