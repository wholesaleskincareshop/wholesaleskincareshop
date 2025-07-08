import React, { useState } from "react";

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string; // Ensure this matches the main Order type
}

interface SearchInputProps {
  orders: Order[];
  onSearchResults: (results: Order[]) => void;
}

const SearchBar: React.FC<SearchInputProps> = ({ orders, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // If no search term, reset to all orders
    if (!value) {
      onSearchResults(orders);
      return;
    }

    // Filter orders based on search term
    const filteredResults = orders.filter((order) =>
      [
        order.firstName.toLowerCase(),
        order.lastName.toLowerCase(),
        order.email.toLowerCase(),
        order.phoneNumber.toLowerCase(),
        order.address.toLowerCase(),
        order.city.toLowerCase(),
        order.state.toLowerCase(),
        order.zipCode.toLowerCase(),
        order.country.toLowerCase(),
      ].some((field) => field.includes(value))
    );

    // Update search results in the parent component
    onSearchResults(filteredResults);
  };

  return (
    <div className="flex border w-full max-w-full  items-center gap-3 rounded-full px-4 py-3 bg-white text-sm sm:text-base">
      <img src="/icons/search.svg" alt="search-icon" className="w-5 h-5" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search orders (name, email, address...)"
        className="w-full outline-none text-gray-600 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
