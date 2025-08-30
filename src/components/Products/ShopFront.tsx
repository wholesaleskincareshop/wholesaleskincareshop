"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoaderOverlay from "./others/LoaderOverlay";
import FilterMenu from "./others/FilterMenu";
import ProductGrid from "./others/ProductGrid";
import CategorySelector from "./CategorySelector";
import { useOverviewState } from "./others/OverviewState";
import { useCategoryFetch, useProductFetch } from "./others/OverviewFetch";
import { useActiveFilter } from "./others/OverviewFilters";
import AOS from "aos";
import "aos/dist/aos.css";
import { filters } from "./others/constants";
import { Header4 } from "../Text";

export default function Overview() {
  const state = useOverviewState();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const fetchProducts = useProductFetch(state);
  useCategoryFetch(state.setCategories);

  const searchQuery = searchParams.get("search");

  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);

  // ✅ Run when query or path changes
  useEffect(() => {
    fetchProducts(true, searchQuery);
  }, [pathname, searchParams]);

  // ✅ Run when category changes
  useEffect(() => {
    fetchProducts(true, searchQuery);
  }, [state.selectedCategory, searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchProducts(false, searchQuery);
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (state.observerRef.current) observer.observe(state.observerRef.current);

    return () => {
      if (state.observerRef.current)
        observer.unobserve(state.observerRef.current);
    };
  }, [fetchProducts, state.observerRef, searchQuery]);

  useActiveFilter(state);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative">
      <LoaderOverlay loading={state.loading} />
      <div className="container1 min-h-screen py-[24px] xl:py-[70px] pt-[70px] text-p_black">
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
  );
}
