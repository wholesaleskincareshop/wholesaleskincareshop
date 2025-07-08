"use client";

import React from "react";
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


export default function Overview() {
  const state = useOverviewState();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  useCategoryFetch(state.setCategories);
  const fetchProducts = useProductFetch(state);

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
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-4">
          <div className="xl:flex hidden border-r">
            <CategorySelector
              categories={state.categories}
              selectedCategory={state.selectedCategory}
              setSelectedCategory={state.setSelectedCategory}
              closeMenu={() => state.setIsCOpen(false)}
            />
          </div>
          <div className="xl:col-span-5">
            <div className="mb-4 xl:hidden pt-2">
              <SearchBar />
            </div>
            <SectionScroller
              sections={sections}
              setActiveFilter={state.setActiveFilter}
            />
            <div className="flex w-full justify-between items-center mb-4">
              <div className="relative xl:hidden">
                <button
                  onClick={() => state.setIsCOpen(!state.isCOpen)}
                  className="w-fit px-2 py-1 border rounded-lg"
                >
                  Categories
                </button>
                <div
                  className={`fixed top-0 left-0 h-full z-20 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                    state.isCOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                  style={{ width: "300px" }}
                >
                  <CategorySelector
                    categories={state.categories}
                    selectedCategory={state.selectedCategory}
                    setSelectedCategory={state.setSelectedCategory}
                    closeMenu={() => state.setIsCOpen(false)}
                  />
                </div>
              </div>
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
