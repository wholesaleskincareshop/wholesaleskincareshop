import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface ExchangeRateState {
  selectedCurrency: string;
  exchangeRate: number;
  setSelectedCurrency: (currency: string) => void;
  fetchExchangeRate: () => Promise<void>;
}

export const useExchangeRateStore = create(
  persist<ExchangeRateState>(
    (set) => ({
      selectedCurrency: "NGN",
      exchangeRate: 0,
      setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
      fetchExchangeRate: async () => {
        try {
          const exchangeRateDoc = doc(db, "ExchangeRate", "rateId"); // Replace "rateId" with your actual ID
          const docSnapshot = await getDoc(exchangeRateDoc);
          if (docSnapshot.exists()) {
            set({ exchangeRate: docSnapshot.data().rate });
          } else {
            console.warn("Exchange rate document does not exist!");
          }
        } catch (error) {
          console.error("Error fetching exchange rate: ", error);
        }
      },
    }),
    {
      name: "exchange-rate-store", // Key to store data in localStorage
    }
  )
);
