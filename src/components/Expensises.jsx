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


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Expensises = () => {
   const [form, setForm] = useState({
      srno: "",
      date: new Date().toISOString().split('T')[0],
      title: "",
      price: "",
      description: ""
   });

   const [data, setData] = useState([]);
   const [isUpdateMode, setIsUpdateMode] = useState(false);
   const [updateId, setUpdateId] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [filter, setFilter] = useState("All Transactions");
   const [userId, setUserId] = useState("");

   const [currentPage, setCurrentPage] = useState(1);
   const expensesPerPage = 15;
   const totalPages = Math.ceil(data.length / expensesPerPage);

   const indexOfLastExpense = currentPage * expensesPerPage;
   const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;

   // const [currentExpenses, setCurrentExpenses] = useState([]);

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

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         const decodedToken = jwtDecode(token);
         if (decodedToken.user) {
            setUserId(decodedToken.user.id);
         }
      }
   }, []);

   const fetchData = async () => {
      try {
         const response = await axios.get(`${baseUrl}expenses/${userId}`);
         setData(response.data);
         // console.log(response.data)
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   };

   useEffect(() => {
      if (userId) {
         fetchData();
      }
   }, [userId]);

   const handleChange = (e) => {
      const { id, value } = e.target;
      setForm((prevData) => ({
         ...prevData,
         [id]: value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
         if (isUpdateMode) {
            const response = await axios.put(`${baseUrl}expens/${updateId}`, form);
            setData(prevData =>
               prevData.map(item => item._id === updateId ? { ...item, ...form } : item)
            );
            toast.success("Data updated successfully!");
         } else {
            const newForm = { ...form, srno: data.length + 1 };
            const response = await axios.post(`${baseUrl}expenses/${userId}`, newForm);
            setData(prevData => [...prevData, response.data]);
            toast.success("Expens added successfully!");
         }
         setForm({
            srno: "",
            date: new Date().toISOString().split('T')[0],
            title: "",
            price: "",
            description: ""
         });
         setIsUpdateMode(false);
         setUpdateId(null);
      } catch (error) {
         const errorMessage = isUpdateMode ? "Error updating data!" : "Error adding expens!";
         toast.error(errorMessage);
         console.error(errorMessage, error);
      }
      setIsSubmitting(false);
      fetchData();
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
               <p>Are you sure you want to delete this expens?</p>
            </div>
            <div className="flex justify-center mt-2">
               <button
                  className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  onClick={async () => {
                     try {
                        await axios.delete(`${baseUrl}expens/${id}`);
                        setData(prevData => prevData.filter(item => item._id !== id));
                        toast.dismiss();
                        toast.success("Expensises deleted successfully!");
                     } catch (error) {
                        toast.dismiss();
                        toast.error("Error deleting expens!");
                        console.error("Error deleting expens:", error);
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
               const itemDate = new Date(item.date);
               return (now - itemDate) / (1000 * 60 * 60 * 24) <= 7;
            });
         case "1 Month":
            return data.filter((item) => {
               const itemDate = new Date(item.date);
               return (now - itemDate) / (1000 * 60 * 60 * 24) <= 30;
            });
         case "3 Months":
            return data.filter((item) => {
               const itemDate = new Date(item.date);
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
               label: 'Expenses',
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
   const currentExpensesToShow = filteredData.slice(indexOfFirstExpense, indexOfLastExpense);

   return (
      <div className="container-fluid mx-auto px-4 py-8 max-[425px]:px-0 max-[1023px]:mx-0">
         <div>
            <div className=" flex justify-between items-center max-[370px]:block max-[425px]:px-5 ">
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
               <div className="max-[370px]:flex max-[370px]:justify-center max-[370px]:pt-5">
                  <p className="text-lg font-semibold">
                     Total Price: <span className="text-blue-600 max-[425px]:block">₹ {totalPrice.toFixed(2)}</span>
                  </p>
               </div>
            </div>
         </div>
         <ToastContainer />
         <form
            className="form-wrapper flex flex-col md:flex-row mt-12 bg-white shadow-md rounded-lg max-[425px]:p-0"
            onSubmit={handleSubmit}>

            <div className="form-column w-full md:w-1/3 md:px-4 max-[767px] justify-center text-center">
               <div className="mb-4 flex items-center max-[1023px]:block">
                  <label htmlFor="date" className="block text-gray-700 font-medium mb-1 md:w-24">
                     Date
                  </label>
                  <input
                     id="date"
                     type="date"
                     className="flex-1 border border-gray-300 rounded-md p-2 max-[1023px]:w-52"
                     value={form.date}
                     onChange={handleChange}
                     disabled
                  />
               </div>
               <div className="mb-4 flex items-center max-[1023px]:block">
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-1 md:w-24">
                     Title
                  </label>
                  <input
                     id="title"
                     type="text"
                     className="flex-1 border border-gray-300 rounded-md p-2 block w-0 max-[1023px]:w-52 mx-auto"
                     value={form.title}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div className="mb-4 flex items-center max-[1023px]:block">
                  <label htmlFor="price" className="block text-gray-700 font-medium mb-1 md:w-24">
                     Amount
                  </label>
                  <input
                     id="price"
                     type="number"
                     className="flex-1 border border-gray-300 rounded-md p-2 no-spinner block w-0 max-[1023px]:w-52 mx-auto"
                     value={form.price}
                     onChange={handleChange}
                     required
                  />
               </div>
               <div className="mb-4 flex items-center max-[1023px]:block">
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-1 md:w-24">
                     Description
                  </label>
                  <textarea
                     id="description"
                     className="flex-1 border border-gray-300 rounded-md p-2 resize-none"
                     rows="4"
                     value={form.description}
                     onChange={handleChange}
                     required
                  ></textarea>
               </div>
               <div className="mb-4 flex justify-center md:justify-center">
                  <button
                     type="Add"
                     className="submit-button bg-blue-500 text-white py-2 px-20 rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Processing...' : isUpdateMode ? 'Update' : 'Add'}
                  </button>

               </div>

               <div className=" flex justify-center items-center h-[35vh]">
                  <Line data={getChartData(filteredData)} />
               </div>
            </div>

            <div className="w-full md:w-2/3 px-4 md:mt-0 max-[425px]:px-0">
               <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                     <thead>
                        <tr className="bg-gray-200">
                           <th className="py-2 px-4 text-start border-b rounded-tl-md">Sr. No.</th>
                           <th className="py-2 px-4 border-b text-start">Date</th>
                           <th className="py-2 px-4 border-b text-start">Title</th>
                           <th className="py-2 px-4 border-b text-start">Price</th>
                           <th className="py-2 px-4 border-b text-start">Description</th>
                           <th className="py-2 px-4 border-b text-start rounded-tr-md">Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {currentExpensesToShow.map((item, index) => (
                           <tr key={index}>
                              <td className="py-2 px-4 border-b text-start">
                                 {item.srno || "NA"}
                              </td>
                              <td className="py-2 px-4 border-b text-start">
                                 {item.date || "NA"}
                              </td>
                              <td className="py-2 px-4 border-b text-start">
                                 {item.title || "NA"}
                              </td>
                              <td className="py-2 px-4 border-b text-start">
                                 {item.price || "NA"}
                              </td>
                              <td className="py-2 px-4 border-b text-start">
                                 {item.description || "NA"}
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

export default Expensises;