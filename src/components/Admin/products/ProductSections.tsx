"use client";

import React, { useState, useEffect } from "react";
import { Header3, Header4, Header5, ParagraphLink1 } from "@/components/Text";
import ProductCard from "./ProductCard";
import AddMore from "./AddMore";
import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import CategoryEditor from "./CategoryEditor";
import ManageCategories from "./ManageCategories";
import CategorySelector from "./CategorySelector";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "./SearchBar";

interface Product {
  id: string;
  name: string;
  currentPrice: number;
  isFeatured: boolean;
  createdAt: Date;
  productImageURL1: string;
  category: string;
  sub_category: string;
  selectedCategory: any;
  isTrending: any;
  availableAmount: any;
}

interface Category {
  id: string;
  name: string;
  properties: Record<string, any>; // Store additional properties of the category
}

function ProductSections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddMoreOpen, setIsAddMoreOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [refetch, setRefetch] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [isCOpen, setIsCOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "category"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(), // Convert Firestore Timestamp to Date
          };
        }) as Product[];

        setProducts(productsData);

        // Featured products
        setFeaturedProducts(
          productsData.filter((product) => product.isFeatured)
        );
        setDisplayedProducts(productsData); // Default: show all products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
    fetchProducts();
  }, [refetch]);

  useEffect(() => {
    let filteredProducts = products;

    // Filter by category
    if (selectedCategory) {
      setLoading(true);

      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category === selectedCategory ||
          product.sub_category === selectedCategory
      );
    }

    // Apply additional filters
    switch (activeFilter) {
      case "Trending":
        setLoading(true);
        filteredProducts = filteredProducts.filter(
          (product) => product.isTrending
        );
        break;

      case "Latest":
        setLoading(true);
        filteredProducts = filteredProducts.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;

      case "Price: Low to High":
        setLoading(true);
        filteredProducts = filteredProducts.sort(
          (a, b) => a.currentPrice - b.currentPrice
        );
        break;

      case "Price: High to Low":
        setLoading(true);
        filteredProducts = filteredProducts.sort(
          (a, b) => b.currentPrice - a.currentPrice
        );
        break;

      case "Available Products":
        setLoading(true);
        filteredProducts = filteredProducts.filter(
          (product) => product.availableAmount > 0
        );
        break;
      case "Out of Stock":
        setLoading(true);
        filteredProducts = filteredProducts.filter(
          (product) => product.availableAmount <= 0
        );
        break;

      case "Low Stock":
        setLoading(true);
        filteredProducts = filteredProducts.filter(
          (product) => product.availableAmount < 20
        );
        break;

      default:
        setLoading(true);
        break;
    }

    setDisplayedProducts(filteredProducts);
    setLoading(false);
  }, [selectedCategory, activeFilter, products]);

  useEffect(() => {
    if (searchQuery) {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedProducts(filteredProducts);
    } else {
      setDisplayedProducts(products);
    }
  }, [searchQuery, products]);

  const filters = [
    "All",
    "Trending",
    "Latest",
    // "Price: Low to High",
    // "Price: High to Low",
    "Available Products",
    "Out of Stock",
    "Low Stock",
  ];

  const handleRefetch = () => {
    setLoading(true); // Optionally show loading indicator
    setRefetch((prev) => !prev); // Toggle refetch state to trigger useEffect
  };

  if (loading)
    return (
      <div className=" fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-[100px] w-[100px] border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div>
      <div className="container1  pt-[50px]  xl:pt-[84px] pb-[24px] ">
        <AddMore onRefetch={handleRefetch} />

        <div className=" py-[24px]-">
          <div className=" gap-4 mt-8">
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              closeMenu={() => setIsCOpen(false)} // Pass the close function
            />

            <div className=" xl:col-span-5">
              <div className=" mb-4  pt-2">
                <SearchBar />
              </div>
              <div className="xl:hidden  px-2 mb-4">
                <ParagraphLink1 className=" ">
                  Number of unique products:{" "}
                  <span className=" font-bold px-4- bg-white p-1 border  rounded-lg">
                    {displayedProducts.length}
                  </span>
                </ParagraphLink1>
              </div>
              <div className=" flex w-full justify-between items-center mb-4">
                <div className="xl:flex hidden  ">
                  <ParagraphLink1 className=" ">
                    Number of unique products:{" "}
                    <span className=" font-bold p-2 border rounded-lg">
                      {displayedProducts.length}
                    </span>
                  </ParagraphLink1>
                </div>
                <div>
                  <Header3> Products</Header3>
                </div>
                <div className=" flex  gap-1 items-center">
                  <CategoryEditor onRefetch={refetch} />
                  <div className="relative inline-">
                    <div
                      onClick={() => setIsOpen(!isOpen)}
                      className=" flex gap-4 border bg-white w-fit cursor-pointe rounded-lg p-2"
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
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        />
                      </svg>
                    </div>
                    {isOpen && (
                      <div className="absolute right-0 z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {filters.map((filter) => (
                            <div
                              key={filter}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setActiveFilter(filter)}
                            >
                              {filter}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* data-aos="fade-right" */}

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 [24px] xl:gap-4 [30px] ">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      image={product.productImageURL1}
                      title={product.name}
                      description="A brief description of the product."
                      price={product.currentPrice}
                      product={product}
                    />
                  ))
                ) : searchQuery ? (
                  // Display this if no products match the search query
                  <div className="col-span-full mt-6 text-center p-4">
                    <p className="text-gray-500 text-lg pb-4">
                      No products found for "
                      <span className="font-semibold">{searchQuery}</span>"
                    </p>
                    <Link
                      href="/admin/products"
                      className=" text-primary font underline"
                    >
                      {" "}
                      Browse other products{" "}
                    </Link>
                  </div>
                ) : (
                  // Placeholder loading skeleton when no query is provided
                  Array(8)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-[150px] w-full bg-gray-200 rounded-md animate-pulse"
                      ></div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div className=" pb-[400px]"></div>
        </div>
      </div>
    </div>
  );
}

export default ProductSections;
