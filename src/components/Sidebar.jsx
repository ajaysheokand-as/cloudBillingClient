import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/Const';
import { ItemsContext } from '../context/ItemsContext';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Sidebar = ({ setSelectedCategory, setSearchQuery }) => {
   const [categories, setCategories] = useState([]);
   const { setItems } = useContext(ItemsContext);
   const [userId, setUserId] = useState("");

   useEffect(() => {
      AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
      });
    }, []);

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         const decodedToken = jwtDecode(token);
         if (decodedToken.user) {
            setUserId(decodedToken.user.id);
         }
      }
   }, []);

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await axios.get(`${baseUrl}categories/${userId}`);
            const uniqueCategories = [...new Set(response.data.map(item => item.category))];
            setCategories(uniqueCategories);

            // Set default selected category and fetch its products
            if (uniqueCategories.includes('Beverages')) {
               setSelectedCategory('Beverages');
               fetchProducts('Beverages');
            } else if (uniqueCategories.length > 0) {
               setSelectedCategory(uniqueCategories[0]);
               fetchProducts(uniqueCategories[0]);
            }

         } catch (error) {
            console.error('Error fetching categories:', error);
         }
      };

      if (userId) {
         fetchCategories();
      }

   }, [userId]);

   const fetchProducts = async (category) => {
      try {
         const response = await axios.get(`${baseUrl}products/${userId}`, {
            params: { category }
         });
         setItems(response.data);
         setSearchQuery("");
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   const fetchAllProducts = async () => {
      try {
         const response = await axios.get(`${baseUrl}get-product-data/${userId}`);
         setItems(response.data);
         setSearchQuery("");  
      } catch (error) {
         console.error("Error fetching all products:", error);
      }
   };

   return (
      <div className="flex flex-col lg:max-w-[210px] min-[767px]:max-w-[150px] w-full bg-white p-4 rounded shadow-md mb-4 md:mb-0 md:mr-4" 
      data-aos="fade-right">
         <div className="sticky top-0 bg-white z-10">
            <p className="md:text-[22px] sticky top-0 text-teal-600 bg-white font-serif z-10 text-[20px] md:block hidden font-bold mb-4">
               Categories
            </p>
         </div>

         {categories.length === 0 ? (
            <div>
               <p className="mt-2 mb-4 text-center max-[]px-2 text-[17px] font-semibold text-gray-600 font-serif">
                  No categories found
               </p>
               <Link to="/categories"
                  className='flex items-center max-[]px-2 text-[17px] font-semibold text-gray-600 font-serif hover:underline underline-offset-4 hover:text-teal-600'
               >
                  Add Category
                  <span>
                     <svg className="w-6 h-6 text-teal-600 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clip-rule="evenodd" />
                     </svg>
                  </span>
               </Link>
            </div>
         ) : (

            <div className="flex overflow-x-auto md:overflow-y-auto">
               <ul className="flex md:flex-col space-x-4">
                  <li className="mt-2 max-[]px-2 sidebar-item md:pb-2 md:ms-0 md:text-[20px] text-[17px] font-semibold font-serif">
                     <button
                        className="text-canter w-full"
                        onClick={() => {
                           setSelectedCategory('All'); 
                           setSearchQuery(""); 
                           fetchAllProducts(); 
                        }}
                     >
                        All Categories
                     </button>
                  </li>
                  {categories?.map((category, index) => (
                     <li
                        key={index}
                        className="mt-2 max-[]px-2 sidebar-item md:pb-2 md:ms-0 md:text-[20px] text-[17px] font-semibold font-serif"
                     >
                        <button
                           className="text-left w-full"
                           onClick={() => {
                              setSelectedCategory(category);
                              setSearchQuery("");
                              fetchProducts(category);
                           }}
                        >
                           {category}
                        </button>
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   );
};

export default Sidebar;
