import { useEffect } from "react";
import { Product } from "./types";

export function useSearchFilter(
  searchQuery: string | null,
  products: Product[],
  setDisplayedProducts: (p: Product[]) => void
) {
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedProducts(filtered);
    } else {
      setDisplayedProducts(products);
    }
  }, [searchQuery, products, setDisplayedProducts]);
}

type UseActiveFilterProps = {
  selectedCategory: string | null;
  activeFilter: string;
  products: Product[];
  setDisplayedProducts: (p: Product[]) => void;
  setLoading: (loading: boolean) => void;
};

export function useActiveFilter({
  selectedCategory,
  activeFilter,
  products,
  setDisplayedProducts,
  setLoading,
}: UseActiveFilterProps) {
  useEffect(() => {
    let filtered = products;
    setLoading(true);

    if (selectedCategory) {
      filtered = filtered.filter(
        (p) =>
          p.category === selectedCategory || p.sub_category === selectedCategory
      );
    }

    switch (activeFilter) {
      case "Trending":
        filtered = filtered.filter((p) => p.isTrending);
        break;
      case "Single Products":
        filtered = filtered.filter((p) => p.isElite);
        break;
      case "Special Products":
        filtered = filtered.filter((p) => p.isSpecial);
        break;
      case "Wholesale and Bulk Products":
        filtered = filtered.filter((p) => p.isBudget);
        break;
      case "Latest":
        filtered = [...filtered].sort(
          (a: Product, b: Product) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case "Price: Low to High":
        filtered = [...filtered].sort(
          (a: Product, b: Product) => a.currentPrice - b.currentPrice
        );
        break;
      case "Price: High to Low":
        filtered = [...filtered].sort(
          (a: Product, b: Product) => b.currentPrice - a.currentPrice
        );
        break;
      case "All":
      default:
        break;
    }

    setDisplayedProducts(filtered);
    setLoading(false);
  }, [
    selectedCategory,
    activeFilter,
    products,
    setDisplayedProducts,
    setLoading,
  ]);
}
