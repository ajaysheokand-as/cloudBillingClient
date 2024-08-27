import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../utils/Const";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import upd from "../assets/images/edit.png";
import cross from "../assets/images/svg/crossicon.svg";
import { jwtDecode } from 'jwt-decode';
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Categories = () => {
   const [form, setForm] = useState({
      srNo: "",
      newTitle: "",
      newStatus: "",
      newDescription: ""
   });

   const [data, setData] = useState([]);
   const [isUpdateMode, setIsUpdateMode] = useState(false);
   const [updateId, setUpdateId] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [filter, setFilter] = useState("All Transactions");
   const [userId, setUserId] = useState("");

   const [currentPage, setCurrentPage] = useState(1);
   const CategoryesPerPage = 10;
   const totalPages = Math.ceil(data.length / CategoryesPerPage);

   const indexOfLastCategorye = currentPage * CategoryesPerPage;
   const indexOfFirstCategorye = indexOfLastCategorye - CategoryesPerPage;

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         const decodedToken = jwtDecode(token);
         if (decodedToken.user) {
            setUserId(decodedToken.user.id);
         }
      }
   }, []);

   const Pagination = ({ totalPages, currentPage, onPageChange }) => (
      <div className="flex justify-center my-4">
         <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
         >
            Previous
         </button>
         {Array.from({ length: totalPages }, (_, index) => (
            <button
               key={index}
               onClick={() => onPageChange(index + 1)}
               className={`mx-1 px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
            >
               {index + 1}
            </button>
         ))}
         <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
         >
            Next
         </button>
      </div>
   );

   const handleChange = (e) => {
      const { id, value } = e.target;
      setForm((prevData) => ({
         ...prevData,
         [id]: value,
      }));
   };

   const fetchData = async () => {
      try {
         const response = await axios.get(`${baseUrl}newcategories/${userId}`);
         setData(response.data);
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   };

   useEffect(() => {
      if (userId) {
         fetchData();
      }
   }, [userId]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      if (isUpdateMode) {
         try {
            await axios.put(`${baseUrl}newcategories/${updateId}`, form);
            toast.success("Data updated successfully!");
            setForm({
               srNo: "",
               newTitle: "",
               newStatus: "",
               newDescription: ""
            });
            setIsUpdateMode(false);
            setUpdateId(null);
            fetchData();
         } catch (error) {
            toast.error("Error updating data!");
            console.error("Error updating category:", error);
         }
      } else {
         try {
            const newForm = { ...form, srNo: data.length + 1 };
            await axios.post(`${baseUrl}newcategories/${userId}`, newForm);
            toast.success("Category added successfully!");
            setForm({
               srNo: "",
               newTitle: "",
               newStatus: "",
               newDescription: ""
            });
            fetchData();
         } catch (error) {
            if (error.response && error.response.data.message === "Category already exists") {
               toast.error("Category already exists!");
            } else {
               toast.error("Error adding Category!");
            }
            console.error("Error adding Category:", error);
         }
      }
      setIsSubmitting(false);
   };

   const handleUpdateClick = (item) => {
      setForm(item);
      setIsUpdateMode(true);
      setUpdateId(item._id);
   };

   const handleDelete = async (id) => {
      toast.info(
         <div>
            <div>
               <p>Are you sure you want to delete this Categories?</p>
            </div>
            <div className="flex justify-center mt-2">
               <button
                  className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  onClick={async () => {
                     try {
                        await axios.delete(`${baseUrl}newcategories/${id}`);
                        toast.dismiss(); // Dismiss the toast after deletion
                        toast.success("Category deleted successfully!");
                        fetchData();
                     } catch (error) {
                        toast.dismiss(); // Dismiss the toast if error occurs
                        toast.error("Error deleting Catogory!");
                        console.error("Error deleting Catogory:", error);
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

   const filterData = (data) => {
      const now = new Date();
      switch (filter) {
         case "7 Days":
            return data.filter((item) => {
               const itemDate = new Date(item.timestamp);
               return (now - itemDate) / (1000 * 60 * 60 * 24) <= 7;
            });
         case "1 Month":
            return data.filter((item) => {
               const itemDate = new Date(item.timestamp);
               return (now - itemDate) / (1000 * 60 * 60 * 24) <= 30;
            });
         case "3 Months":
            return data.filter((item) => {
               const itemDate = new Date(item.timestamp);
               return (now - itemDate) / (1000 * 60 * 60 * 24) <= 90;
            });
         case "All Transactions":
         default:
            return data;
      }
   };

   const handleFilterChange = (event) => {
      setFilter(event.target.value);
   };

   const getChartData = (data) => {
      const labels = data.map(item => item.date);
      const prices = data.map(item => parseFloat(item.price));
      return {
         labels,
         datasets: [
            {
               label: 'Categoryes',
               data: prices,
               borderColor: 'rgba(75, 192, 192, 1)',
               backgroundColor: 'rgba(75, 192, 192, 0.2)',
               fill: true,
               tension: 0.4,
            }
         ],
      };
   };

   const filteredData = filterData(data);
   const totalPrice = filteredData.reduce((total, item) => total + parseFloat(item.price || 0), 0);
   const currentCategoryesToShow = filteredData.slice(indexOfFirstCategorye, indexOfLastCategorye);

   return (
      <div className="container-fluid mx-auto px-4 py-8 max-[425px]:px-0 max-[1023px]:mx-0">
         <div>
            <div className=" flex justify-between items-center max-[430px]:flex-col-reverse text-center max-[425px]:px-5 ">
               <div className="max-[370px]:flex max-[370px]:justify-center">
                  <select
                     id="type"
                     className=" w-[200px] p-2 border border-gray-300 rounded-md shadow-sm"
                     onChange={handleFilterChange}
                  >
                     <option>All Transactions</option>
                     <option>7 Days</option>
                     <option>1 Month</option>
                     <option>3 Months</option>
                  </select>
               </div>
               <div className="flex justify-center items-center max-[370px]:flex max-[370px]:justify-center max-[430px]:pb-3">
                  <Link to="/add-product">
                     <p className="flex items-center text-xl text-teal-600 hover:underline underline-offset-2 font-semibold">
                        Add Product
                        <span className="ml-2">
                           <svg className="w-6 h-6 text-teal-600 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />
                           </svg>
                        </span>
                     </p>
                  </Link>
               </div>
            </div>
         </div>
         <ToastContainer />
         <form
            className="form-wrapper flex flex-col md:flex-row mt-12 bg-white shadow-md rounded-lg max-[425px]:p-0"
            onSubmit={handleSubmit}>

            <div className="form-column w-full md:w-1/3 md:px-4 max-[767px] justify-center text-center">
               <div className="mb-4 flex items-center max-[1023px]:block">
                  <label htmlFor="newTitle" className="block text-gray-700 font-medium mb-1 md:w-24">
                     Category
                  </label>
                  <input
                     id="newTitle"
                     type="text"
                     className="flex-1 border border-gray-300 rounded-md p-2 block w-0 max-[1023px]:w-52 mx-auto"
                     value={form.newTitle}
                     onChange={handleChange}
                     required
                  />
               </div>
               {/*<div className="mb-4 flex items-center max-[1023px]:block">
                  <label htmlFor="newStatus" className="block text-gray-700 font-medium mb-1 md:w-24">
                     Status
                  </label>
                  <input
                     id="newStatus"
                     type="text"
                     className="flex-1 border border-gray-300 rounded-md p-2 no-spinner block w-0 max-[1023px]:w-52 mx-auto"
                     value={form.newStatus}
                     onChange={handleChange}
                     //required
                  />
               </div>*/}
               <div className="mb-4 flex items-center max-[1023px]:block">
                  <label htmlFor="newDescription" className="block text-gray-700 font-medium mb-1 md:w-24">
                     Description
                  </label>
                  <textarea
                     id="newDescription"
                     className="flex-1 border border-gray-300 rounded-md p-2 resize-none"
                     rows="4"
                     value={form.newDescription}
                     onChange={handleChange}
                     //required
                  ></textarea>
               </div>
               <div className="mb-4 flex justify-center md:justify-center">
                  <button
                     type="submit"
                     className="submit-button bg-blue-500 text-white py-2 px-20 rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Processing...' : isUpdateMode ? 'Update' : 'Add'}
                  </button>

               </div>

               {/* Render chart only if there is data */}
               {filteredData.length > 0 && (
                  <div className=" flex justify-center items-center h-[35vh]">
                     <Line data={getChartData(filteredData)} />
                  </div>
               )}
            </div>

            <div className="w-full md:w-2/3 px-4 md:mt-0 max-[425px]:px-0">
               <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                     <thead>
                        <tr className="bg-gray-200">
                           <th className="py-2 px-4 text-start border-b rounded-tl-md">Sr. No.</th>
                           <th className="py-2 px-4 border-b text-start">Title</th>
                           {/*<th className="py-2 px-4 border-b text-start">Status</th>*/}
                           <th className="py-2 px-4 border-b text-start">Description</th>
                           <th className="py-2 px-4 border-b text-start rounded-tr-md">Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {currentCategoryesToShow.map((item, index) => (
                           <tr key={index}>
                              <td className="py-2 px-4 border-b text-start">
                                 {item.srNo}
                              </td>
                              <td className="py-2 px-4 border-b text-start">
                                 {item.newTitle}
                              </td>
                              {/*<td className="py-2 px-4 border-b text-start">
                                 {item.newStatus}
                              </td>*/}
                              <td className="py-2 px-4 border-b text-start">
                                 {item.newDescription}
                              </td>
                              <td className="py-2 px-4 border-b text-start">
                                 <div className="flex gap-3">
                                    <img
                                       className="cursor-pointer"
                                       src={upd}
                                       alt="update icon"
                                       width="20px"
                                       title="Update Your Order"
                                       onClick={() => handleUpdateClick(item)}
                                    />
                                    <img
                                       className="cursor-pointer"
                                       src={cross}
                                       alt="cross icon"
                                       title="Delete Your Order"
                                       onClick={() => handleDelete(item._id)}
                                    />
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  <Pagination
                     totalPages={totalPages}
                     currentPage={currentPage}
                     onPageChange={setCurrentPage}
                  />
               </div>
            </div>
         </form>
      </div>
   );
};

export default Categories;
