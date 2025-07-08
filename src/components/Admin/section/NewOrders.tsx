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
import SearchBar from "./SearchBar";
import SummaryBlocks from "./SummaryBlocks";
import { AnyARecord } from "dns";
import countries from "../logistics/CountriesWithFlags";

type Product = {
  id: string;
  initials: string;
  name: string;
  productImageURL1: string;
  quantity: number;
  price: number;
  TotalPaid: any;
};

type Order = {
  id: string;
  initials: string;
  name: string;
  quantity: number;
  products: Product[];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  currency: string;
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  message: string;
  totalPaid: string;
  shippingFee: string;
  paymentMethod: string;
  viewed: boolean;
  shipped: boolean;
  returned: boolean;
  timestamp: string;
};

function NewOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [totalOrders, setTotalOrders] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Orders"));

        const ordersData: Order[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const products = data.products || []; // Ensure products is defined as an array
          return {
            id: doc.id,
            name: `${doc.data().firstName} ${doc.data().lastName}`,
            initials: doc.data().firstName[0] + doc.data().lastName[0], // Assuming you have firstName and lastName in your form
            products: data.products || [],
            quantity: products.reduce(
              (total: any, product: any) => total + (product.quantity || 0),
              0
            ),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            currency: data.currency,
            address: data.address,
            country: data.country,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            message: data.message,
            totalPaid: data.totalPaid,
            shippingFee: data.shippingFee,
            paymentMethod: data.paymentMethod,
            viewed: data.viewed || false,
            shipped: data.shipped || false,
            returned: data.returned || false,
            timestamp: data.timestamp ? data.timestamp.toDate() : null,
          };
        });

        setTotalOrders(ordersData.length);
        setUnreadCount(ordersData.filter((order) => !order.viewed).length);

        ordersData.sort((a, b) => {
          const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return timeB - timeA;
        });

        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refresh]);

  const showUnreadOrders = () => {
    const unread = orders.filter((order) => !order.viewed);
    setFilteredOrders(unread);
  };

  const showUnshippedOrders = () => {
    const unshipped = orders.filter((order) => !order.shipped);
    setFilteredOrders(unshipped);
  };

  const showShippedOrders = () => {
    const shipped = orders.filter((order) => order.shipped);
    setFilteredOrders(shipped);
  };

  const showReturedOrders = () => {
    const returned = orders.filter((order) => order.returned);
    setFilteredOrders(returned);
  };

  const showAllOrders = () => {
    setFilteredOrders(orders);
  };

  const handleClick = async (order: Order) => {
    // Update the viewed status in Firestore
    const orderDocRef = doc(db, "Orders", order.id.toString()); // Assuming id is the Firestore document ID

    try {
      await updateDoc(orderDocRef, { viewed: true }); // Update the viewed field
      console.log("Order viewed status updated successfully");
    } catch (error) {
      console.error("Error updating order: ", error);
    }

    // Set the order as viewed in the local state
    const updatedOrders = orders.map((ord) =>
      ord.id === order.id ? { ...ord, viewed: true } : ord
    );
    setOrders(updatedOrders); // Update the orders state
    setFilteredOrders(updatedOrders); // Ensure filtered list reflects changes
    setSelectedOrder(order);
    setRefresh((prev) => !prev);

    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedOrder(null);
  };

  // Predefined list of colors to cycle through
  const bgColors = ["bg-red-500", "bg-green-500", "bg-blue-600"];

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  });

  const markAsShipped = async (orderId: any) => {
    try {
      const orderRef = doc(db, "Orders", orderId); // Reference to the specific document
      await updateDoc(orderRef, { shipped: true }); // Update the shipped field to true
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const markAsRetured = async (orderId: any) => {
    try {
      const orderRef = doc(db, "Orders", orderId); // Reference to the specific document
      await updateDoc(orderRef, { returned: true }); // Update the shipped field to true
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

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
    <div>
      {" "}
      <div className="mx-4- xl:mx-0 ">
        <div className="  bg-white py-[35px]  rounded-lg shadow-md">
          <div className="px-2  xl:px-4">
            {selectedOrder ? (
              // Render the detailed view if a submission is selected
              <div data-aos="zoom-in" className="">
                <div className=" flex  border-b pb-2 w-full text-[14px]  gap-4 items-center">
                  <button
                    onClick={handleBack}
                    className="hover:scale-110 transition-transform duration-300"
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
                        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                      />
                    </svg>
                  </button>

                  <div className=" flex w-full-">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-[50px] h-[50px] flex items-center justify-center  rounded-full bg-primary -${
                          bgColors[selectedOrder.id.length % bgColors.length]
                        }`}
                      >
                        <span className="text-lg font-bold uppercase">
                          {selectedOrder.initials}
                        </span>
                      </div>
                      <div>
                        <Header5 className="text-[23px]  ">
                          {selectedOrder.name}
                        </Header5>
                        <Paragraph2 className="text-sm sm:-mt-2 font-semibold-">
                          {selectedOrder.email}
                        </Paragraph2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" mt-[20px] space-y-[20px]">
                  <div className=" px-4 sm:px-[20px] py-[20px] bg-bg_gray rounded-[15px] space-y-[20px]">
                    <div className=" flex justify-between items-center">
                      <Paragraph2 className="text-sm text-gray-500  underline-">
                        {formatTimestamp(
                          typeof selectedOrder.timestamp === "string"
                            ? new Date(selectedOrder.timestamp) // Convert string to Date
                            : selectedOrder.timestamp // Use as is if it's already a Date object
                        )}{" "}
                        {/* Use the custom formatting function */}
                      </Paragraph2>
                      <Paragraph2 className="text-sm text-gray-500  underline-">
                        {selectedOrder.shipped ? "shipped" : " "}
                      </Paragraph2>
                    </div>

                    {selectedOrder.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex- grid grid-cols-6 relative justify-between items-center bg-white p-2   rounded-lg"
                      >
                        <img
                          src={product.productImageURL1.replace(
                            "/upload/",
                            "/upload/w_1000,f_auto/"
                          )}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <ParagraphLink2 className="font-bold text-[14px] col-span-2 ">
                          {product.name}
                        </ParagraphLink2>
                        <Paragraph1 className="text-gray-500 ">
                          ₦{" "}
                          {new Intl.NumberFormat("en-US", {}).format(
                            Number(product.price)
                          )}{" "}
                        </Paragraph1>
                        <Paragraph1 className="text-gray-500 ">
                          Qt: {product.quantity}
                        </Paragraph1>
                        <div>
                          <Paragraph1 className="font-bold">
                            ₦{" "}
                            {new Intl.NumberFormat("en-US", {}).format(
                              Number(product.price * product.quantity)
                            )}{" "}
                          </Paragraph1>
                        </div>
                      </div>
                    ))}
                    <div className=" grid grid-cols-1 xl:grid-cols-2 items-center gap-4 sm:gap-[20px] ">
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          Shipping Fee
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">
                            ₦{" "}
                            {new Intl.NumberFormat("en-US", {}).format(
                              Number(selectedOrder.shippingFee)
                            )}{" "}
                          </p>
                        </div>
                      </div>
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          Total Paid
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px] border-b border-secondary">
                          <p className=" text-[14px] ">
                            ₦{" "}
                            {new Intl.NumberFormat("en-US", {}).format(
                              Number(selectedOrder.totalPaid)
                            )}
                          </p>
                        </div>
                      </div>
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          First Name
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">
                            {selectedOrder.firstName}
                          </p>
                        </div>
                      </div>
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          Last Name
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">
                            {selectedOrder.lastName}
                          </p>
                        </div>
                      </div>
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          E-mail address{" "}
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">{selectedOrder.email}</p>
                        </div>
                      </div>
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          Phone Number{" "}
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">
                            {selectedOrder.phoneNumber}
                          </p>
                        </div>
                      </div>

                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          Country{" "}
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">
                            {selectedOrder.country}

                            {countries.find(
                              (country) =>
                                country.code === selectedOrder.country
                            )?.name || selectedOrder.country}
                          </p>
                        </div>
                      </div>
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          State{" "}
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">{selectedOrder.state}</p>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className=" px-[30px] py-[39px] bg-bg_gray rounded-[15px] space-y-[40px]">
                    <div>
                      <ParagraphLink2 className="  text-[14px] font-bold ">
                        Payment Method{" "}
                      </ParagraphLink2>
                      <div className=" p-4 bg-white rounded-[12px]">
                        <p className=" text-[14px] ">
                          {selectedOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div>
                      <ParagraphLink2 className="  text-[14px] font-bold ">
                        Address{" "}
                      </ParagraphLink2>
                      <div className=" p-4 bg-white rounded-[12px]">
                        <p className=" text-[14px] ">{selectedOrder.address}</p>
                      </div>
                    </div>
                    <div className=" grid grid-cols-2  gap-4 sm:gap-[40px] ">
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          City
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">{selectedOrder.city}</p>
                        </div>
                      </div>
                      <div>
                        <ParagraphLink2 className="  text-[14px] font-bold ">
                          Zip Code
                        </ParagraphLink2>
                        <div className=" p-4 bg-white rounded-[12px]">
                          <p className=" text-[14px] ">
                            {selectedOrder.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <ParagraphLink2 className="  text-[14px] font-bold ">
                        Message/Note{" "}
                      </ParagraphLink2>
                      <div className=" p-4 bg-white rounded-[12px]">
                        <p className=" text-[14px] ">{selectedOrder.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      className="px-4 py-1  rounded-lg text-black bg-bg_gray text-[14px] hover:b"
                      onClick={() => {
                        markAsRetured(selectedOrder.id);
                        handleClick(selectedOrder);
                      }}
                    >
                      Returned
                    </button>
                    <button
                      className={`px-4 py-1 rounded-lg text-white text-[14px] ${
                        selectedOrder.shipped
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-primary hover:bg-black"
                      }`}
                      onClick={() => {
                        markAsShipped(selectedOrder.id);
                        handleClick(selectedOrder);
                      }}
                      disabled={selectedOrder.shipped}
                    >
                      Done
                    </button>
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
                    orders={orders} // Pass orders instead of submissions
                    // @ts-ignore
                    onSearchResults={setFilteredOrders} // Use setFilteredOrders to update results
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
                      <div className="absolute space-y- z-10 top-[30px] right-0 bg-white px-4 py-2 rounded-lg shadow-md">
                        <button onClick={() => showAllOrders()}>
                          <Paragraph2 className="text-sm whitespace-nowrap">
                            All Order
                          </Paragraph2>
                        </button>

                        <button onClick={() => showUnreadOrders()}>
                          <Paragraph2 className="text-sm whitespace-nowrap">
                            Unread orders
                          </Paragraph2>
                        </button>
                        <button onClick={() => showShippedOrders()}>
                          <Paragraph2 className="text-sm whitespace-nowrap">
                            Shipped Orders
                          </Paragraph2>
                        </button>

                        <button onClick={() => showUnshippedOrders()}>
                          <Paragraph2 className="text-sm whitespace-nowrap">
                            Unshipped Orders
                          </Paragraph2>
                        </button>
                        <button onClick={() => showReturedOrders()}>
                          <Paragraph2 className="text-sm whitespace-nowrap">
                            Returned Orders
                          </Paragraph2>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className=" h-screen space-y-4 overflow-y-auto scrollable-div px-2 ">
                  <Header5 className="pt-3">New Orders</Header5>

                  {filteredOrders.map((order, index) => (
                    <div
                      key={order.id}
                      className={`flex items-center border px-2  space-x-4 py-2 bg-white rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 ${
                        order.viewed ? "text-gray-400" : "" // Change text color for viewed orders
                      }`}
                      onClick={() => handleClick(order)}
                    >
                      <div
                        className={`w-[10%] h-full flex items-center justify-center  text- rounded-lg  `}
                      >
                        {/* <img src="/images/testProduct.jpg" alt="" /> */}
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
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                          />
                        </svg>
                      </div>
                      <Paragraph1 className="sm:text-lg font-semibold w-full sm:w-[20%] whitespace-nowrap truncate overflow-hidden">
                        {order.name}
                      </Paragraph1>
                      <Paragraph1 className="w-[10%] sm:block hidden whitespace-nowrap truncate overflow-hidden ">
                        Qt: {order.quantity}
                      </Paragraph1>
                      <Paragraph1 className="w-[10%] sm:block hidden whitespace-nowrap truncate overflow-hidden ">
                        {order.state}
                      </Paragraph1>
                      <Paragraph1 className="w-[10%] sm:block hidden whitespace-nowrap truncate overflow-hidden ">
                        {countries.find(
                          (country) => country.code === order.country
                        )?.name || order.country}{" "}
                      </Paragraph1>
                      <Paragraph1 className="w-[10%] sm:block hidden whitespace-nowrap truncate overflow-hidden ">
                        {new Date(order.timestamp).toLocaleDateString("en-US")}
                      </Paragraph1>
                      <Paragraph1 className="w-[18%] sm:block hidden whitespace-nowrap font-bold truncate overflow-hidden ">
                        ₦
                        {new Intl.NumberFormat("en-US", {}).format(
                          Number(order.totalPaid)
                        )}
                      </Paragraph1>
                      <Paragraph1
                        className={`sm:w-[2%] w-[12%] text-primary- whitespace-nowrap truncate overflow-hidden ${
                          order.returned
                            ? "text-red-500"
                            : order.shipped
                            ? "text-primary"
                            : "text-[#e6c533]"
                        }`}
                      >
                        {order.returned ? "x" : order.shipped ? "✔" : "o"}{" "}
                      </Paragraph1>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewOrders;
