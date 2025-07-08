"use client";

import { Header4, HeaderAny } from "@/components/Text";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs } from "firebase/firestore"; // Firestore functions

function SummaryBlocks() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [availableProducts, setAvailableProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
   const fetchData = async () => {
     try {
       // Fetch orders collection and calculate total revenue and pending orders
       const ordersSnapshot = await getDocs(collection(db, "Orders"));
       let revenue = 0;
       let pending = 0;
       let productsSold = 0;

       ordersSnapshot.forEach((doc) => {
         const order = doc.data();
         revenue += order.totalPaid || 0;

         // Iterate through the products array in each order
         if (Array.isArray(order.products)) {
           order.products.forEach((product) => {
             productsSold += product.quantity || 0;
           });
         }
         if (!order.shipped) {
           pending += 1;
         }
       });

       setTotalRevenue(revenue);
       setTotalProductsSold(productsSold);
       setPendingOrders(pending);

       // Fetch products collection and calculate available products
       const productsSnapshot = await getDocs(collection(db, "products"));
       let available = 0;

       productsSnapshot.forEach((doc) => {
         const product = doc.data();
         // Convert availableAmount to a number
         const availableAmount = Number(product.availableAmount) || 0;
         available += availableAmount;
       });

       setAvailableProducts(available);
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   };


    fetchData();
  }, []);

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <div className="w-full bg-white rounded-lg p-6 border-b-4 border-secondary">
              {/* Total revenue */}
              <HeaderAny>Total Revenue</HeaderAny>
              <HeaderAny className="text-black text">₦ {totalRevenue.toLocaleString()}</HeaderAny>
            </div>
          </div>
          <div className="hidden sm:block col-span-1">
            <div className="w-full bg-white rounded-lg p-6 border-b-4 border-secondary">
              {/* Total products sold */}
              <HeaderAny>Total Products Sold</HeaderAny>
              <HeaderAny className="text-black">{totalProductsSold.toLocaleString()}</HeaderAny>
            </div>
          </div>
          <div className="hidden sm:block col-span-1">
            <div className="w-full bg-white rounded-lg p-6 border-b-4 border-secondary">
              {/* Available products */}
              <HeaderAny>Available Product</HeaderAny>
              <HeaderAny className="text-black">{availableProducts.toLocaleString()}</HeaderAny>
            </div>
          </div>
          <div className="col-span-1">
            <div className="w-full bg-white rounded-lg p-6 border-b-4 border-secondary">
              {/* Pending orders */}
              <HeaderAny>Pending Order</HeaderAny>
              <HeaderAny className="text-black">{pendingOrders.toLocaleString()}</HeaderAny>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryBlocks;
