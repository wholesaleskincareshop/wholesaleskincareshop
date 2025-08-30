import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {}

function SearchBar({}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-2 px-3 bg-white rounded-lg w-full max-w-[250px] cursor-pointer border">
        <input
          type="text"
          placeholder="Search for a product..."
          className="flex-grow outline-none bg-white text-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        {searchQuery.trim() ? (
          <button
            onClick={handleSearch}
            className="ml-2 px-3 py-1 text-white bg-primary rounded-lg text-sm hover:bg-primary/80 transition"
          >
            Find
          </button>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 
                 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
