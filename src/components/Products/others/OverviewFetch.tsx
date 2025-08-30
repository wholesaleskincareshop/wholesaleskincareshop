import { useCallback, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PRODUCTS_PER_PAGE } from "./constants";
import { Product, Category } from "./types";

export function useCategoryFetch(setCategories: (cats: Category[]) => void) {
  useEffect(() => {
    async function fetchCategories() {
      try {
        const snapshot = await getDocs(collection(db, "category"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, [setCategories]);
}

export function useProductFetch({
  selectedCategory,
  lastDoc,
  isLoadingMore,
  setIsLoadingMore,
  setProducts,
  setDisplayedProducts,
  setLastDoc,
  setHasMore,
}: any) {
  const fetchProducts = useCallback(
    async (isInitialLoad = false, searchQuery: string | null = null) => {
      if (isLoadingMore) return;
      setIsLoadingMore(true);

      try {
        // 🟢 Normal category/infinite scroll query
        const productsQuery = query(
          collection(db, "products"),
          ...(selectedCategory
            ? [where("category", "==", selectedCategory)]
            : []),
          orderBy("createdAt", "desc"),
          ...(lastDoc && !isInitialLoad ? [startAfter(lastDoc)] : []),
          limit(PRODUCTS_PER_PAGE)
        );

        const snapshot = await getDocs(productsQuery);

        let productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() ?? null,
        })) as Product[];

        // 🔎 Client-side search by letters (case-insensitive)
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          productsData = productsData.filter((p) =>
            p.name?.toLowerCase().includes(q)
          );
        }

        if (isInitialLoad) {
          setProducts(productsData);
          setDisplayedProducts(productsData);
        } else {
          setProducts((prev: Product[]) => [...prev, ...productsData]);
          setDisplayedProducts((prev: Product[]) => [...prev, ...productsData]);
        }

        if (snapshot.docs.length > 0) {
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }

        if (snapshot.docs.length < PRODUCTS_PER_PAGE) {
          setHasMore?.(false);
        } else {
          setHasMore?.(true);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoadingMore(false);
      }
    },
    [
      selectedCategory,
      lastDoc,
      isLoadingMore,
      setIsLoadingMore,
      setProducts,
      setDisplayedProducts,
      setLastDoc,
      setHasMore,
    ]
  );

  return fetchProducts;
}
