"use client";

import Link from "next/link";
import ProductCard from "../ProductCard";

export default function ProductGrid({
  displayedProducts,
  searchQuery,
  isLoadingMore,
  observerRef,
}: {
  displayedProducts: any[];
  searchQuery: any;
  isLoadingMore: boolean;
  observerRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 xl:gap-4">
        {displayedProducts.length > 0 ? (
          <>
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.productImageURL1}
                title={product.name}
                price={product.currentPrice}
                product={product}
              />
            ))}

            {/* ✅ Show "other products" link after the grid items */}
            {searchQuery && (
              <div className="col-span-full text-center mt-4">
                <button
                  onClick={() => {
                    // Remove search params but stay on same page
                    const url = new URL(window.location.href);
                    url.searchParams.delete("search");
                    window.history.replaceState({}, "", url.toString());

                    // Reload to re-fetch products
                    window.location.reload();
                  }}
                  className="text-primary font-medium underline"
                >
                  Browse other products
                </button>
              </div>
            )}
          </>
        ) : searchQuery ? (
          <div className="col-span-full mt-6 text-center p-4">
            <p className="text-gray-500 text-lg pb-4">
              No products found for "
              <span className="font-semibold">{searchQuery}</span>"
            </p>
            <button
              onClick={() => {
                // Remove search params but stay on same page
                const url = new URL(window.location.href);
                url.searchParams.delete("search");
                window.history.replaceState({}, "", url.toString());

                // Reload to re-fetch products
                window.location.reload();
              }}
              className="text-primary font-medium underline"
            >
              Browse other products
            </button>
          </div>
        ) : (
          Array(8)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="h-[250px] w-full bg-gray-200 rounded-md animate-pulse"
              ></div>
            ))
        )}
      </div>

      {/* Optional loading spinner for infinite scroll */}
      {/* {isLoadingMore && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <div className="w-6 h-6 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      )} */}

      {/* Infinite scroll observer */}
      <div className="observer scrollbar-hide" ref={observerRef} />
    </>
  );
}
