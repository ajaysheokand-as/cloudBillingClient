import React, { useEffect, useState } from "react";
import cross from "../assets/images/svg/crossicon.svg";
import axios from "axios";
import { baseUrl } from "../utils/Const";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import update from "../assets/images/svg/updateicon.svg";
import { jwtDecode } from 'jwt-decode';

function Structure() {
  const [formData, setFormData] = useState({
    number: "",
    title: "",
    charge: "",
  });

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  const [data, setData] = useState([]);
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.user) {
        setUserId(decodedToken.user.id);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}getStructure/${userId}`);
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

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this structure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}deleteStructure/${id}`);
          toast.success("Structure deleted successfully!");
          fetchData();
        } catch (error) {
          toast.error("Error deleting structure!");
          console.error("Error deleting structure:", error);
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${baseUrl}structure/${userId}`, formData);
      toast.success("Structure added successfully!");
      setFormData({
        number: "",
        title: "",
        charge: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error adding structure:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="container-fluid mx-auto px-4">
        <ToastContainer />
        <form
          className="form-wrapper flex flex-col md:flex-row mt-12"
          onSubmit={handleSubmit}
        >
          <div className="form-column w-full md:w-1/3 px-4">
            <div className="mb-2 flex flex-wrap justify-between">
              <div className="input-group w-full mb-4">
                <label htmlFor="title" className="block font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-input mt-1 w-full"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-2 flex flex-wrap justify-between">
              <div className="input-group w-full mb-4">
                <label htmlFor="number" className="block font-medium">
                  Number
                </label>
                <input
                  type="text"
                  id="number"
                  className="form-input mt-1 w-full"
                  value={formData.number}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-2 flex flex-wrap justify-between">
              <div className="input-group w-full mb-4">
                <label htmlFor="chargeAmount" className="block font-medium">
                  Charge Amount
                </label>
                <input
                  type="text"
                  id="charge"
                  className="form-input mt-1 w-full"
                  value={formData.charge}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4 flex justify-center">
              <button
                type="submit"
                className="submit-button bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Add'}
              </button>
            </div>
          </div>

          <div className="w-full md:w-2/3 px-4 mt-4 md:mt-0">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-start border-b">S.No.</th>
                    <th className="py-2 px-4 border-b text-start">Date</th>
                    <th className="py-2 px-4 border-b text-start">Title</th>
                    <th className="py-2 px-4 border-b text-start">Number</th>
                    <th className="py-2 px-4 border-b text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b text-start">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border-b text-start">
                        {formatDate(item.timestamp)}
                      </td>
                      <td className="py-2 px-4 border-b text-start">
                        {item.title}
                      </td>
                      <td className="py-2 px-4 border-b text-start">
                        {item.number}
                      </td>
                      <td className="py-2 px-4 border-b text-start">
                        <div className="flex gap-3">
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
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Structure;
