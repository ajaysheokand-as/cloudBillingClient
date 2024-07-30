import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/Const';
import upd from "../assets/images/edit.png";
import cross from "../assets/images/svg/crossicon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from 'jwt-decode';

function Products() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 12;
   const [userId, setUserId] = useState("");

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
      if (userId) {
         fetchData();
      }
   }, [userId]);

   const fetchData = async () => {
      try {
         const response = await axios.get(`${baseUrl}get-product-data/${userId}`);
         setProducts(response.data);
         setLoading(false);
      } catch (error) {
         console.error("Error fetching products:", error);
         setError("Error fetching products");
         setLoading(false);
      }
   };



   const handleUpdate = (id) => {
      console.log("Update product with ID:", id);
   };

   const handleDelete = async (id) => {
      toast.info(
         <div>
            <p>Are you sure you want to delete this expens?</p>
            <div className="flex justify-center mt-2">
               <button
                  className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  onClick={async () => {
                     try {
                        await axios.delete(`${baseUrl}category/${id}`);
                        toast.dismiss();
                        toast.success("Product deleted successfully!");
                        fetchData();
                     } catch (error) {
                        toast.dismiss();
                        toast.error("Error deleting Product!");
                        console.error("Error deleting Product:", error);
                     }
                  }}
               >
                  Yes
               </button>
               <button
                  className="bg-gray-300 text-black px-3 py-1 rounded"
                  onClick={() => toast.dismiss()}
               >
                  No
               </button>
            </div>
         </div>,
         {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            draggable: false
         }
      );
   };

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   if (loading) {
      return <p className="text-center text-gray-700">Loading...</p>;
   }

   if (error) {
      return <p className="text-center text-red-500">{error}</p>;
   }

   const startIndex = (currentPage - 1) * itemsPerPage;
   const selectedProducts = products.slice(startIndex, startIndex + itemsPerPage);
   const totalPages = Math.ceil(products.length / itemsPerPage);

   return (
      <div className="container mx-auto px-4 py-8">
         <ToastContainer />
         <h1 className="text-3xl font-bold font-serif mb-6 text-center text-teal-600 bg-gray-100 py-2 px-6 rounded-full shadow-md">
            Products
         </h1>
         <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
               <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                     <th className="py-2 px-4 text-left">Category</th>
                     <th className="px-4 py-2 text-left">Name</th>
                     <th className="px-4 py-2 text-left">Description</th>
                     <th className="px-4 py-2 text-left">Price</th>
                     <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
               </thead>
               <tbody className="text-gray-600 text-sm font-light">
                  {selectedProducts.map(category => (
                     <tr key={category._id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="px-4 py-2 text-left whitespace-nowrap">{category.category}</td>
                        <td className="px-4 py-2 text-left">{category.productName}</td>
                        <td className="px-4 py-2 text-left">{category.description}</td>
                        <td className="px-4 py-2 text-left">{category.price} Rs.</td>
                        <td className="py-2 px-4 text-left">
                           <div className="flex gap-3">
                              <img
                                 className="cursor-pointer"
                                 src={upd}
                                 alt="update icon"
                                 width="20px"
                                 title="Update Your Order"
                                 onClick={() => handleUpdate(category._id)}
                              />
                              <img
                                 className="cursor-pointer"
                                 src={cross}
                                 alt="cross icon"
                                 title="Delete Your Order"
                                 onClick={() => handleDelete(category._id)}
                              />
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="flex justify-center mt-12 mb-4">
            {Array.from({ length: totalPages }, (_, index) => (
               <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-4 py-2 rounded-full transition-colors duration-300 ${currentPage === index + 1
                     ? 'bg-blue-500 text-white'
                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                     }`}
               >
                  {index + 1}
               </button>
            ))}
         </div>
      </div>
   );
}

export default Products;
