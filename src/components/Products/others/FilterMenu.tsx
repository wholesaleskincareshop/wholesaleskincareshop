"use client";

import { Paragraph1 } from "@/components/Text";

export default function FilterMenu({
  isOpen,
  setIsOpen,
  filters,
  setActiveFilter,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  filters: string[];
  setActiveFilter: (filter: string) => void;
}) {
  return (
    <div className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex gap-4 bg-white w-fit cursor-pointer rounded-lg p-2"
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
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {filters.map((filter) => (
              <div
                key={filter}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => setActiveFilter(filter)}
              >
                <Paragraph1> {filter} </Paragraph1>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
