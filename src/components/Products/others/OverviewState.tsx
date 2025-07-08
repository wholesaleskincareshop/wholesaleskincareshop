import { useState, useRef } from "react";
import { Category, Product } from "./types";

export function useOverviewState() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isCOpen, setIsCOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [pageCount, setPageCount] = useState(1);

  return {
    categories,
    setCategories,
    loading,
    setLoading,
    isOpen,
    setIsOpen,
    isCOpen,
    setIsCOpen,
    products,
    setProducts,
    displayedProducts,
    setDisplayedProducts,
    selectedCategory,
    setSelectedCategory,
    activeFilter,
    setActiveFilter,
    lastDoc,
    setLastDoc,
    observerRef,
    isLoadingMore,
    setIsLoadingMore,
    // currentPage,
    // setCurrentPage,
    // pageCount,
    // setPageCount,
  };
}
