import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../utils/Const";
import { jwtDecode } from "jwt-decode";
import { Line } from 'react-chartjs-2';
import AOS from 'aos';
import 'aos/dist/aos.css';

const OrderHistory = () => {
   const [data, setData] = useState([]);
   const [filter, setFilter] = useState("All Transactions");
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
      if (userId) {
         fetchData();
      }
   }, [userId]);

   const fetchData = async () => {
      try {
         const response = await axios.get(`${baseUrl}bills/${userId}`);
         setData(response.data);

         console.log("Bills :", data)

      } catch (error) {
         console.error("Error fetching data:", error);
      }
   };


   function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
   }

   function filterData(data) {
      const now = new Date();
      let filteredData = data;

      switch (filter) {
         case "7 Days":
            filteredData = data.filter((item) => {
               const itemDate = new Date(item.timestamp);
               return (now - itemDate) / (1000 * 60 * 60 * 24) <= 7;
            });
            break;
         case "1 Month":
            filteredData = data.filter((item) => {
               const itemDate = new Date(item.timestamp);
               return (now - itemDate) / (1000 * 60 * 60 * 24) <= 30;
            });
            break;
         case "3 Months":
            filteredData = data.filter((item) => {
               const itemDate = new Date(item.timestamp);
               return (now - itemDate) / (1000 * 60 * 60 * 24) <= 90;
            });
            break;
         case "All Transactions":
         default:
            break;
      }

      return filteredData;
   }

   function calculateTotalPrice(filteredData) {
      return filteredData.reduce((total, item) => {
         return total + item.orderItems.reduce((subTotal, orderItem) => {
            return subTotal + orderItem.price * orderItem.quantity;
         }, 0);
      }, 0);
   }

   const handleFilterChange = (event) => {
      setFilter(event.target.value);
   };

   const getChartData = (filteredData) => {
      const labels = filteredData.map(item => formatDate(item.timestamp));
      const amounts = filteredData.map(item => item.totalAmount);

      return {
         labels,
         datasets: [
            {
               label: 'Total Amount',
               data: amounts,
               borderColor: 'rgba(75, 192, 192, 1)',
               backgroundColor: 'rgba(75, 192, 192, 0.2)',
               fill: true,
               tension: 0.4,
            },
         ],
      };
   };


   const filteredData = filterData(data);
   console.log("Filtered data :", filteredData)
   const totalPrice = calculateTotalPrice(filteredData);

   return (
      <div className="container py-3">
         <div className="px-3 pt-2 pb-5 bg-gray-100">
            <h1 className="text-3xl font-bold font-serif mt-2 text-center text-teal-600 bg-gray-200 py-2 px-6 rounded-full shadow-md">
               Order History
            </h1>
            <div data-aos="fade-up">

               <div className="flex justify-between items-center my-3">
                  <select
                     id="type"
                     className="form-select w-[200px] p-2 border border-gray-300 rounded-md shadow-sm"
                     onChange={handleFilterChange}
                  >
                     <option>7 Days</option>
                     <option>1 Month</option>
                     <option>3 Months</option>
                     <option>All Transactions</option>
                  </select>
                  <p className="text-lg font-semibold">
                     Total Price: <span className="text-blue-600">₹ {totalPrice.toFixed(2)}</span>
                  </p>
               </div>

               <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mt-4">

                  {/* Chart Section */}
                  <div className="flex justify-center items-center h-[35vh] w-full lg:w-2/5 p-4 bg-white shadow-md rounded-lg">
                     <Line data={getChartData(filteredData)} />
                  </div>

                  {/* Table Section */}
                  <div className="w-full lg:w-3/5 px-4 max-md:px-0 mt-6 lg:mt-0">
                     <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                           <thead>
                              <tr className="bg-gray-200">
                                 <th className="py-2 px-4 text-start border-b">Date</th>
                                 <th className="py-2 px-4 border-b text-start">Name</th>
                                 <th className="py-2 px-4 border-b text-start">Mobile</th>
                                 <th className="py-2 px-4 border-b text-start">Total</th>
                              </tr>
                           </thead>
                           <tbody>
                              {filteredData.map((item) => (
                                 <tr key={item._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-start">
                                       {formatDate(item.timestamp)}
                                    </td>
                                    <td className="py-2 px-4 border-b text-start">
                                       {item.name}
                                    </td>
                                    <td className="py-2 px-4 border-b text-start">
                                       {item.mobile}
                                    </td>
                                    <td className="py-2 px-4 border-b text-start">
                                       ₹ {item.totalAmount}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default OrderHistory;