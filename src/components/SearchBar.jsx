import React, { useState, useRef, useEffect } from "react";

const SearchBar = ({
  searchQuery,
  setSearchQuery
}) => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const searchBarRef = useRef(null);

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <div className="hidden lg:flex flex-row items-center space-x-2">
          <input
            type="text"
            className="border border-gray-400 rounded px-4 py-2"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
