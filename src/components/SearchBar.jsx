import React, { useState, useRef, useEffect, useContext } from "react";
import { ItemsContext } from "../context/ItemsContext";
import { baseUrl } from "../utils/Const";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { debounce } from "lodash";

const SearchBar = ({
  selectedCategory,
  searchQuery,
  setSearchQuery,
  setSelectedCategory,
}) => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [shouldClearSearch, setShouldClearSearch] = useState(false);
  const searchBarRef = useRef(null);

  const [userId, setUserId] = useState("");
  const { setItems } = useContext(ItemsContext);

  // Decode the token and get the user ID on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.user) {
        setUserId(decodedToken.user.id);
      }
    }
  }, []);


  const fetchAllProducts = async () => {
    try {
      if (!userId) return;
      const response = await axios.get(`${baseUrl}get-product-data/${userId}`);
      setItems(response.data);
      if (shouldClearSearch) {
        setSearchQuery("");
      }
      setShouldClearSearch(false);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  // Debounced version of fetchAllProducts
  const debouncedFetch = debounce(() => {
    fetchAllProducts();
  }, 300);

 
  const toggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };


  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setIsSearchBarOpen(false);
    }
  };

  useEffect(() => {
    if (isSearchBarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchBarOpen]);



  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (selectedCategory !== "All") {
      setSelectedCategory("All");
      setShouldClearSearch(true);
    }

    // Call debounced fetch function
    debouncedFetch();
  };

  return (
    <div
      ref={searchBarRef}
      className="flex relative flex-row justify-between items-center bg-white px-4 py-3 mb-4"
    >
      <p
        className={`text-lg font-bold font-serif ${isSearchBarOpen ? "hidden" : "block"}`}
      >
        Search Items
      </p>
      <div className="flex items-center space-x-2">
        <div className="lg:hidden">
          <button
            onClick={toggleSearchBar}
            className={`text-2xl ${isSearchBarOpen ? "hidden" : "block"}`}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
        {isSearchBarOpen && (
          <div className="flex flex-col lg:hidden lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-2">
            <input
              type="text"
              className="border border-gray-400 rounded px-4 py-2"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        )}
        <div className="hidden lg:flex flex-row items-center space-x-2">
          <input
            type="text"
            className="border border-gray-400 rounded px-4 py-2"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
