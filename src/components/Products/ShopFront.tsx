"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import LoaderOverlay from "./others/LoaderOverlay";
import SectionScroller from "./others/SectionScroller";
import FilterMenu from "./others/FilterMenu";
import ProductGrid from "./others/ProductGrid";
import CategorySelector from "./CategorySelector";
import SearchBar from "./SearchBar";


import { useOverviewState } from "./others/OverviewState";
import { useCategoryFetch, useProductFetch } from "./others/OverviewFetch";
import { useSearchFilter, useActiveFilter } from "./others/OverviewFilters";
import AOS from "aos";
import "aos/dist/aos.css";
import { filters, sections } from "./others/constants";
import { Header3, Header4, Header5 } from "../Text";


export default function Overview() {
  const state = useOverviewState();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  useCategoryFetch(state.setCategories);
  const fetchProducts = useProductFetch(state);

  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);

  React.useEffect(() => {
    fetchProducts(true);
  }, [state.selectedCategory]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchProducts();
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (state.observerRef.current) observer.observe(state.observerRef.current);

    return () => {
      if (state.observerRef.current)
        observer.unobserve(state.observerRef.current);
    };
  }, [fetchProducts, state.observerRef]);

  useSearchFilter(searchQuery, state.products, state.setDisplayedProducts);
  useActiveFilter(state);

  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative">
      <LoaderOverlay loading={state.loading} />
      <div className="container1 min-h-screen py-[24px] xl:py-[70px] pt-[70px] text-p_black">
        <div className="">
          <div className="">
            {" "}
            <div className="mb-4 xl:hidden pt-2">
              <SearchBar />
            </div>
            {/* <SectionScroller
              sections={sections}
              setActiveFilter={state.setActiveFilter}
            /> */}
            <CategorySelector
              categories={state.categories}
              selectedCategory={state.selectedCategory}
              setSelectedCategory={state.setSelectedCategory}
              selectedCategoryName={setSelectedCategoryName}
              closeMenu={() => state.setIsCOpen(false)}
            />
            <div className="flex w-full justify-between items-center mb-4">
              <div>
                <Header4>{selectedCategoryName || "All Products"}</Header4>
              </div>{" "}
              <FilterMenu
                isOpen={state.isOpen}
                setIsOpen={state.setIsOpen}
                filters={filters}
                setActiveFilter={state.setActiveFilter}
              />
            </div>
            <ProductGrid
              displayedProducts={state.displayedProducts}
              searchQuery={searchQuery || ""}
              isLoadingMore={state.isLoadingMore}
              observerRef={state.observerRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
