import { ParagraphLink1, ParagraphLink2 } from "@/components/Text";
import React from "react";

interface Category {
  id: string;
  name: string;
  parentId?: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: any;
  setSelectedCategory: any;
  closeMenu: any;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  closeMenu,
}) => {
  const mainCategories = categories.filter((category) => !category.parentId);

  return (
    <div className="w-full">
      <div className=" ">
        <ParagraphLink1 className="text-[16px] font-semibold pb-2">
          Categories
        </ParagraphLink1>
      </div>

      <div className="flex overflow-x-auto gap-4 p-2 border rounded-lg whitespace-nowrap scrollbar-hide">
        <button
          className={`flex gap-4 w-full  py-2 rounded-lg px-4 ${
            !selectedCategory
              ? "bg-black text-white"
              : "bg-white xl:bg-bg_gray text-black hover:bg-gray-100"
          }`}
          onClick={() => {
            setSelectedCategory(null);
            closeMenu();
          }}
        >
          <ParagraphLink1>All</ParagraphLink1>
        </button>

        {mainCategories.map((category) => (
          <button
            key={category.id}
            className={`flex w-full rounded-lg px-4 py-2 ${
              selectedCategory === category.id
                ? "bg-black text-white"
                : "bg-white xl:bg-bg_gray text-black hover:bg-gray-100"
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              closeMenu();
            }}
          >
            <ParagraphLink1 className="whitespace-nowrap">
              {category.name}
            </ParagraphLink1>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
