"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import {
  Header4,
  Header5,
  Paragraph1,
  ParagraphLink1,
} from "@/components/Text";
import Button from "@/components/Button";
import Section6 from "@/components/home/sections/Section6";
import ProductCartCard from "@/components/Cart/ProductCartCard";
import Checkout from "./Checkout";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import useCartStore from "@/stores/cartStore";
import { useExchangeRateStore } from "@/stores/exchangeRateStore";

type Product = {
  id: string; // Firestore document IDs are strings
  image: string;
  name: string;
  price: number;
  quantity: number;
  currentPrice: any;
  oldPrice: any;
  productImageURL1: any;
  productWeight: any;
};

const CheckOutOverview = () => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const cart = useCartStore((state) => state.cart);
  const [products, setProducts] = useState<Product[]>([]);

  const [shippingFee, setShippingFee] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const { selectedCurrency, exchangeRate } = useExchangeRateStore();

  const currencySymbol = selectedCurrency === "USD" ? "$" : "₦";

  const handleShippingFeeChange = (fee: number) => {
    setShippingFee(fee);
  };

  const handleTotalBillChange = (totalBill: number) => {
    setTotalBill(totalBill);
  };

  useEffect(() => {
    if (cart.length > 0) {
      const fetchProducts = async () => {
        try {
          const ids = cart.map((item) => item.id);

          // Firestore query to get products by ID
          const productsRef = collection(db, "products");
          const productsQuery = query(
            productsRef,
            where("__name__", "in", ids)
          );
          const querySnapshot = await getDocs(productsQuery);

          const productDetails = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Include Firestore document ID
            ...doc.data(),
          })) as Omit<Product, "quantity">[]; // Exclude quantity initially

          // Map with cart quantities
          const updatedProducts = productDetails.map((product) => ({
            ...product,
            quantity:
              cart.find((item) => item.id === product.id)?.quantity || 1,
          }));
          // Fetch related products
          const relatedQuery = query(collection(db, "products"));
          const relatedSnap = await getDocs(relatedQuery);
          const related: Product[] = [];
          relatedSnap.forEach((doc) => {
            const data = doc.data() as Omit<Product, "id">; // Exclude 'id'
            related.push({ id: doc.id, ...data });
          });

          setRelatedProducts(related);
          setProducts(updatedProducts);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };

      fetchProducts();
    } else {
      setProducts([]); // Clear products if cart is empty
    }
  }, [cart]);

  const shuffledProducts = [...relatedProducts].sort(() => 0.5 - Math.random());
  const randomProducts = shuffledProducts.slice(0, 4);

  const subtotal = products.reduce((total, product) => {
    const useOldPrice =
      product.oldPrice && product.quantity > 6
        ? product.oldPrice
        : product.currentPrice;
    return total + useOldPrice * product.quantity;
  }, 0);

  // Calculate total product weight
  const totalProductWeight = products.reduce(
    (total, product) => total + product.productWeight  * product.quantity,
    0
  );

  const handleQuantityChange = (productId: string, delta: number) => {
    const cartStore = useCartStore.getState();
    const existingProduct = cart.find((item) => item.id === productId);

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + delta;

      if (newQuantity > 0) {
        // Update the quantity directly in the store
        cartStore.cart = cartStore.cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, quantity: newQuantity }
              : product
          )
        );
      } else {
        // Remove the product if the quantity reaches zero
        cartStore.removeFromCart(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
    // Sync removal with Zustand store
    useCartStore.getState().removeFromCart(productId);
  };

  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  // Toggle visibility function
  const toggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  if (loading)
    return (
      <div className=" absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div>
      <div className="container1  py-[100px]">
        <Header4 className=" mb-4">Checkout</Header4>
        <div className=" grid grid-cols-1 sm:grid-cols-5 gap-8 bg-white  rounded-lg">
          <div className="block sm:hidden">
            <div className=" flex justify-between bg-bg_gray p-2 px-2 rounded-lg items-center ">
              <button
                onClick={toggleSummary}
                className=" flex gap-1 items-center text-[12px] text-primary "
              >
                {isSummaryVisible ? "Hide order summary" : "Show order summary"}{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform ${
                    isSummaryVisible ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <ParagraphLink1 className="text-lg font-bold">
                {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                  Number(
                    selectedCurrency === "USD" && exchangeRate > 0
                      ? (totalBill / exchangeRate).toFixed(2)
                      : totalBill
                  )
                )}`}
              </ParagraphLink1>
            </div>

            {/* Conditionally render Summary based on state */}
            {isSummaryVisible && (
              <div className=" space-y-2 mt-4">
                {/* Products list */}
                <div className="space-y-4 overflow-y-auto bg-bg_gray p-2 rounded-lg h-[300px] scrollbar-hide">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCartCard
                        key={product.id}
                        product={product}
                        onRemove={handleRemoveProduct}
                        onQuantityChange={handleQuantityChange}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      Your cart is empty.
                    </p>
                  )}
                </div>
                <hr />

                <div className="flex justify-between">
                  <Paragraph1>Shipping fee:</Paragraph1>
                  <Paragraph1 className="text-gray-500">
                    {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                      Number(
                        selectedCurrency === "USD" && exchangeRate > 0
                          ? (shippingFee / exchangeRate).toFixed(2)
                          : shippingFee
                      )
                    )}`}
                  </Paragraph1>
                </div>
                <div className="flex justify-between font-semibold">
                  <ParagraphLink1>Total:</ParagraphLink1>
                  <ParagraphLink1>
                    {" "}
                    {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                      Number(
                        selectedCurrency === "USD" && exchangeRate > 0
                          ? (totalBill / exchangeRate).toFixed(2)
                          : totalBill
                      )
                    )}`}
                  </ParagraphLink1>
                </div>
              </div>
            )}
          </div>

          {/* Right section - Product Images */}
          <div className=" sm:col-span-3">
            <div className=" sm:p-4 bg-bg_gray rounded-lg">
              <Checkout
                products={products}
                total={subtotal}
                totalProductWeight={totalProductWeight}
                logoUrl="/images/logo.png"
                onShippingFeeChange={handleShippingFeeChange}
                onTotalBillChange={handleTotalBillChange}
              />
            </div>
          </div>

          {/* Left section - Product Details */}
          <div className="sm:col-span-2 hidden sm:block">
            <div className=" bg-bg_gray rounded-lg p-4">
              <div className=" space-y-4 overflow-y-auto h-[300px]  rounded-lg scrollbar-hide">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCartCard
                      key={product.id}
                      product={product}
                      onRemove={handleRemoveProduct}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    Your cart is empty.
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4  space-y-2">
              <div className="flex justify-between">
                <Paragraph1>Shipping fee:</Paragraph1>
                <Paragraph1 className="text-gray-500">
                  {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                    Number(
                      selectedCurrency === "USD" && exchangeRate > 0
                        ? (shippingFee / exchangeRate).toFixed(2)
                        : shippingFee
                    )
                  )}`}
                </Paragraph1>
              </div>
              <div className="flex justify-between font-semibold">
                <ParagraphLink1>Total:</ParagraphLink1>
                <ParagraphLink1>
                  {" "}
                  {`${currencySymbol} ${new Intl.NumberFormat("en-US").format(
                    Number(
                      selectedCurrency === "USD" && exchangeRate > 0
                        ? (totalBill / exchangeRate).toFixed(2)
                        : totalBill
                    )
                  )}`}
                </ParagraphLink1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Section6 />
    </div>
  );
};

export default CheckOutOverview;
