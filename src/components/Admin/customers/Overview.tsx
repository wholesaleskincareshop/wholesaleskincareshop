"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs } from "firebase/firestore";
import { Header4, ParagraphLink1 } from "@/components/Text";
import EmailList from "./EmailList";

interface Order {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  totalPaid: number;
}

const Overview: React.FC = () => {
  const [ordersSummary, setOrdersSummary] = useState<Record<string, any>>([]);
  const [filteredOrders, setFilteredOrders] = useState<Record<string, any>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmails, setShowEmails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Start loading state
      try {
        const querySnapshot = await getDocs(collection(db, "Orders"));

        const orders: Order[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phoneNumber: data.phoneNumber,
            country: data.country,
            totalPaid: data.totalPaid || 0,
          };
        });

        // Group orders by email
        const groupedOrders = orders.reduce((acc, order) => {
          if (!acc[order.email]) {
            acc[order.email] = {
              email: order.email,
              name: order.name,
              phoneNumber: order.phoneNumber,
              country: order.country,
              totalPaid: 0,
            };
          }
          acc[order.email].totalPaid += order.totalPaid;
          return acc;
        }, {} as Record<string, any>);

        // Convert to array, sort by totalPaid (highest first)
        const sortedOrders = Object.values(groupedOrders).sort(
          (a, b) => b.totalPaid - a.totalPaid
        );

        setOrdersSummary(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = ordersSummary.filter(
      (order: any) =>
        order.name.toLowerCase().includes(lowerSearchTerm) ||
        order.email.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, ordersSummary]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className=" absolut inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[100px] container1">
      <div className=" flex flex-wrap gap-4 sm:justify-between mb-4">
        <Header4 className="text-xl font-bold ">Customers Summary</Header4>
        <div className=" relative">
          {" "}
          <button
            onClick={() => setShowEmails(!showEmails)}
            className="rounded-lg px-4 border bg-white "
          >
            <ParagraphLink1 className=" text-center">
              Newsletter List{" "}
            </ParagraphLink1>
          </button>{" "}
          <div>
            {showEmails && (
              <div className=" absolute top-[50px] sm:right-0 border overflow-hidden bg-white rounded-lg shadow">
                <EmailList />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 bg-white items-center rounded-lg border w-full px-4 py-2 overflow-hidden mb-4">
        <img src="/icons/search.svg" alt="search-icon" className="w-5 h-5" />

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="outline-none w-full"
        />
      </div>

      <div className="sm:grid grid-cols-5 rounded-lg px-4 hidden ">
        <ParagraphLink1 className="text-gray-500 font-bold">
          Name
        </ParagraphLink1>
        <ParagraphLink1 className="text-gray-500 font-bold">
          Email
        </ParagraphLink1>
        <ParagraphLink1 className="text-gray-500 font-bold">
          Phone
        </ParagraphLink1>
        <ParagraphLink1 className="text-gray-500 font-bold">
          Country
        </ParagraphLink1>
        <ParagraphLink1 className="text-gray-500 font-bold">
          Total Transaction
        </ParagraphLink1>
      </div>
      {filteredOrders.length > 0 ? (
        <div>
          {filteredOrders.map((order: any) => (
            <div
              key={order.email}
              className="grid sm:grid-cols-5 bg-white rounded-lg mb-4 p-4"
            >
              <div className=" flex gap-2 items-center">
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
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <ParagraphLink1>{order.name}</ParagraphLink1>
              </div>

              <ParagraphLink1>{order.email}</ParagraphLink1>
              <ParagraphLink1>{order.phoneNumber}</ParagraphLink1>
              <ParagraphLink1>{order.country}</ParagraphLink1>
              <ParagraphLink1>
                {`₦ ${new Intl.NumberFormat("en-US", {}).format(
                  Number(order.totalPaid)
                )}`}
              </ParagraphLink1>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Overview;
