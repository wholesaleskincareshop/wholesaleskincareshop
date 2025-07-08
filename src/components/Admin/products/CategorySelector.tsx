import { ParagraphLink2 } from "@/components/Text";
import React, { useState } from "react";

interface Category {
  id: string;
  name: string;
  parentId?: string; // Optional for main categories
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
  const [isSubCategoryOpen, setSubCategoryOpen] = useState<string | null>(null);

  // Separate main categories and subcategories
  const mainCategories = categories.filter((category) => !category.parentId);
  const subCategories = (parentId: string) =>
    categories.filter((category) => category.parentId === parentId);

  return (
    <div className="flex flex-col w-full min-h-screen min-w-fit overflow-y-auto scrollbar-hide  pr-4 xl:pl-0 p-4">
      <div className=" xl:block hidden">
        <ParagraphLink2 className=" text-[16px] font-semibold pb-2">
          Categories
        </ParagraphLink2>
        <hr />
      </div>

      <div
        onClick={closeMenu} // Trigger the close function
        className="mb-4 p-2 cursor-pointer text-gray-600  xl:hidden block hover:text-gray-800 w-fit border rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>
      <button
        className={`flex gap-4  w-full mt-4 py-2  rounded-lg px-4 py- ${
          !selectedCategory
            ? "bg-black text-white"
            : "bg-white xl:bg-bg_gray text-black  hover:bg-gray-100"
        }`}
        onClick={() => {
          setSelectedCategory(null);
          closeMenu();
        }}
      >
        {" "}
        <ParagraphLink2 className=" ">All </ParagraphLink2>
      </button>
      {mainCategories.map((category) => (
        <div key={category.id} className="">
          {/* Main Category Button */}
          <button
            className={`flex w-full rounded-lg px-4 py-2  ${
              selectedCategory === category.id
                ? "bg-black text-white"
                : "bg-white xl:bg-bg_gray text-black hover:bg-gray-100 "
            }`}
            onClick={() =>
              setSubCategoryOpen((prev) =>
                prev === category.id ? null : category.id
              )
            }
          >
            <ParagraphLink2 className="whitespace-nowrap ">
              {category.name}
            </ParagraphLink2>
          </button>

          {/* Subcategory Dropdown */}
          {isSubCategoryOpen === category.id && (
            <div className=" mt-2 flex flex-col gap-2  bg-white  rounded-lg w-full">
              <button
                className={`text-left flex gap-2 px-4 py-1 items-center rounded-lg ${
                  selectedCategory === category.id
                    ? "bg-gray-200 text-black"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSubCategoryOpen(null);
                  closeMenu();
                }}
              >
                <p>-</p>
                <ParagraphLink2 className="whitespace-nowrap">
                  {category.name}
                </ParagraphLink2>
              </button>
              {subCategories(category.id).map((subCategory) => (
                <button
                  key={subCategory.id}
                  className={`text-left flex gap-2 px-4 py-1 items-center rounded-lg ${
                    selectedCategory === subCategory.id
                      ? "bg-gray-200 text-black"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedCategory(subCategory.id);
                    setSubCategoryOpen(null);
                    closeMenu();
                  }}
                >
                  <p>-</p>
                  <ParagraphLink2 className="whitespace-nowrap">
                    {subCategory.name}
                  </ParagraphLink2>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
