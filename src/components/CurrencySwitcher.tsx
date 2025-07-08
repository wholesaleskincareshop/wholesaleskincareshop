import { useState, useEffect } from "react";
import { useExchangeRateStore } from "@/stores/exchangeRateStore"; // Adjust the path if needed
import { Paragraph1, ParagraphLink1 } from "@/components/Text";

const CurrencySwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCurrency, setSelectedCurrency, fetchExchangeRate } =
    useExchangeRateStore();

  useEffect(() => {
    fetchExchangeRate(); // Fetch exchange rate once when the component mounts
  }, [fetchExchangeRate]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectCurrency = (currency: string) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <ParagraphLink1>{selectedCurrency}</ParagraphLink1>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute bg-white p-2 px-4 rounded-lg shadow-md">
          <button onClick={() => handleSelectCurrency("NGN")}>
            <ParagraphLink1 className="cursor-pointer hover:text-primary">
              NGN
            </ParagraphLink1>
          </button>

          <button onClick={() => handleSelectCurrency("USD")}>
            <ParagraphLink1 className="cursor-pointer hover:text-primary">
              USD
            </ParagraphLink1>
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
