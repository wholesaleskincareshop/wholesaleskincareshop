import { useState, useEffect } from "react";
import { useExchangeRateStore } from "@/stores/exchangeRateStore"; // Adjust the path if needed
import { Paragraph1, ParagraphLink1 } from "@/components/Text";

interface CategoryCardProps {
  category: any;
}

function CategoryCard({ category }: CategoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div key={category.id} className="relative">
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <ParagraphLink1>{category.name}</ParagraphLink1>

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
        <div className="absolute left-0 top-[40px] gap-2 flex flex-col bg-white p-2 px-4 rounded-lg sm:shadow-md w-[250px]">
          <button className=" flex w-full">
            <ParagraphLink1 className="cursor-pointer hover:text-primary">
              Sub Category 1
            </ParagraphLink1>
          </button>

          <button className=" flex w-full">
            <ParagraphLink1 className="cursor-pointer hover:text-primary">
              Sub Category 2
            </ParagraphLink1>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
