import React, { useState } from "react";

interface Submission {
  id: string;
  name: string;
  productDetail: string;
}

interface SearchInputProps {
  submissions: Submission[];
  onSearchResults: (results: Submission[]) => void;
}

const SearchBar: React.FC<SearchInputProps> = ({
  submissions,
  onSearchResults,
}) => {

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter submissions based on search term
    const filteredResults = submissions.filter(
      (submission) =>
        submission.name.toLowerCase().includes(value.toLowerCase()) ||
        submission.productDetail.toLowerCase().includes(value.toLowerCase())
    );

    // Call the parent component's function to update search results
    onSearchResults(filteredResults);
  };

  return (
    <div className="flex border w-full max-w-full sm:max-w-md- md:max-w-lg- lg:max-w-xl- items-center gap-3 rounded-full px-4 py-3 bg-white text-sm sm:text-base">
      <img src="/icons/search.svg" alt="search-icon" className="w-5 h-5" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for a name"
        className="w-full outline-none text-gray-600 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
