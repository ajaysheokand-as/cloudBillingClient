import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/Const";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Process = () => {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

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
      const response = await axios.get(`${baseUrl}bills/${userId}`);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleAddItem = (section, index, orderId) => {
    navigate(`/home?section=${section}&index=${index}&orderId=${orderId}`);
  };

  // Calculate the items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = data.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mt-4 text-center font-serif text-teal-600 bg-200 py-2 px-6">
        Process
      </h1>
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                OrderId
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Grand Total
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {itemsToDisplay.map((item, index) => (
              <tr key={startIndex + index} className="hover:bg-gray-100">
                <td className="px-6 py-4 border-b border-gray-300">
                  {item.section + " " + item.index}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {formatDate(item.timestamp)}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {item.name}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {"₹"+item.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <div className="flex">
                    <button className="flex items-center px-2 py-1 bg-yellow-500 text-white rounded">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 9V3h12v6M6 9v6a2 2 0 002 2h8a2 2 0 002-2V9M6 9h12M6 15h12m-6 0v4m0 0H9m3 0h3"
                        ></path>
                      </svg>
                      Print
                    </button>
                    <button
                      className="flex items-center mx-3 px-2 py-1 bg-green-500 text-white rounded"
                      onClick={() =>
                        handleAddItem(item.section, item.index, item._id)
                      }
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                      Add Item
                    </button>
                    <button className="flex items-center px-2 py-1 bg-blue-500 text-white rounded">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.5 4.5m0 0L15 19m4.5-4.5H3m16.5 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v2a2 2 0 002 2h9"
                        ></path>
                      </svg>
                      Preview
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center">
      <div className="flex justify-between w-72 mt-4">
        <button
          className="px-2 py-2 bg-gray-200 text-gray-700 rounded"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mt-2">
          Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
        </span>
        <button
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded"
          onClick={handleNextPage}
          disabled={endIndex >= data.length}
        >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};

export default Process;
