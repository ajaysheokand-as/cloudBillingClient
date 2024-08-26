import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ItemList = ({ filteredItems, addToOrder }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);


  if (filteredItems.length === 0) {
    return (
      <div className='mb-2'>
        <p className="text-center text-2xl font-bold text-gray-600 mb-3">
          No products available
        </p>

        <Link to="/add-product"
          className='flex justify-center items-center max-[]px-2 text-[17px] font-semibold text-gray-600 font-serif hover:underline underline-offset-4 hover:text-teal-600'
        >
          Add Products
          <span>
            <svg className="w-6 h-6 text-teal-600 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clip-rule="evenodd" />
            </svg>
          </span>
        </Link>

      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div data-aos="flip-right"
            key={item.productName}
            className="relative bg-white p-4 rounded shadow-md overflow-hidden group"
          >
            <div className="absolute inset-0 bg-teal-500 transform -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"></div>
            <div className="relative z-10 " data-aos="zoom-in">
              <p className="text-base font-bold font-serif group-hover:text-white">{item.productName}</p>
              <p className="text-sm group-hover:text-white font-serif">{item.description}</p>
              <div className="flex flex-row justify-between mt-2 font-serif">
                <p className="text-sm group-hover:text-white">₹ {item.price}</p>
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold font-serif px-2 py-1 rounded"
                  onClick={() => addToOrder(item)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
