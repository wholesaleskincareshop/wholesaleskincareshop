import { ParagraphLink1, ParagraphLink2 } from "@/components/Text";
import React from "react";

interface Category {
  id: string;
  name: string;
  parentId?: string; // Optional for main categories
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: any;
  setSelectedCategory: any;
  selectedCategoryName: any;
  closeMenu: any;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedCategoryName,
  closeMenu,
}) => {
  // Only include root-level categories
  const mainCategories = categories.filter((category) => !category.parentId);

  return (
    <div className=" font-bold py-2 sm:py-4">
      {/* <div className="">
        <ParagraphLink2 className="text-[16px] font-semibold pb-2">
          Categories
        </ParagraphLink2>
      </div> */}
      <div className="flex overflow-x-auto gap-2 sm:gap-4   rounded-lg whitespace-nowrap scrollbar-hide">
        <button
          className={`flex gap-4 w-full  rounded-lg px-4 sm:py-2 xl:py-0 ${
            !selectedCategory
              ? "bg-primary text-white"
              : "bg-white text-black border hover:bg-gray-100"
          }`}
          onClick={() => {
            setSelectedCategory(null);
            selectedCategoryName(null);
            closeMenu();
          }}
        >
          <ParagraphLink2 className="py-2">All</ParagraphLink2>
        </button>
        {mainCategories.map((category) => (
          <button
            key={category.id}
            className={`flex w-full items-center rounded-lg px-4 sm:py-2 xl:py-0  ${
              selectedCategory === category.id
                ? "bg-primary text-white"
                : "bg-white text-black border hover:bg-gray-100"
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              selectedCategoryName(category.name);

              closeMenu();
            }}
          >
            <ParagraphLink2 className="whitespace-nowrap text-[14px] capitalize xl:w-[100px] py-2 truncate">
              {category.name}
            </ParagraphLink2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
