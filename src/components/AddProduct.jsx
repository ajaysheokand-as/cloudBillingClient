import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "./Product.css";
import { baseUrl } from "../utils/Const";
import update from "../assets/images/edit.png";
import cross from "../assets/images/svg/crossicon.svg";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    type: "",
    category: "",
    unit: "",
    stock: "",
    price: "",
    description: "",
  });

  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // form validation
    if (!formData.productName.trim()) {
      toast.error("Product name is required!");
      setIsSubmitting(false);
      return;
    }

    if (formData.category === "Select" || !formData.category.trim()) {
      toast.error("Please select a category of food!");
      setIsSubmitting(false);
      return;
    }

    if (!formData.price) {
      toast.error("Product price is required!");
      setIsSubmitting(false);
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error("Price must be a positive number!");
      setIsSubmitting(false);
      return
    }
    if (isUpdateMode) {
      try {
        await axios.put(`${baseUrl}product/${updateId}`, formData);
        toast.success("Data updated successfully!");
        setFormData({
          productName: "",
          type: "",
          category: "",
          unit: "",
          stock: "",
          price: "",
          description: "",
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
        await axios.post(`${baseUrl}product/${userId}`, formData);
        toast.success("Product added successfully!");
        setFormData({
          productName: "",
          type: "",
          category: "",
          unit: "",
          stock: "",
          price: "",
          description: "",
        });
        fetchData();
      } catch (error) {
        if (
          error.response &&
          error.response.data.message === "Product ID already exists"
        ) {
          toast.error("Product ID already exists!");
        } else {
          toast.error("Error adding Product!");
        }
        console.error("Error adding Product:", error);
      }
    }
    setIsSubmitting(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}get-products/${userId}`);
      setData(response.data);
      // Reset to the first page if data changes
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}newcategories/${userId}`);
      setCategory(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCategories();
    }
  }, [userId]);

  const handleUpdateClick = (item) => {
    setFormData(item);
    setIsUpdateMode(true);
    setUpdateId(item._id);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}product/${id}`);
          toast.success("Product deleted successfully!");
          fetchData();
        } catch (error) {
          toast.error("Error deleting product!");
          console.error("Error deleting product:", error);
        }
      }
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container-fluid mt-4 mx-auto px-4 max-[375px]:px-0">
      <ToastContainer />
      <h1 className="text-3xl font-bold mt-1 text-center font-serif text-teal-600 bg-200 py-1 px-6">
        Add Products
      </h1>
      <form
        className="form-wrapper flex flex-col md:flex-row md:px-0 bg-white py-2 shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
        <div
          className="form-column bg-gray-100 w-full mt-3 rounded-lg pt-2 md:w-1/3 md:px-3 max-[767px]:grid justify-center"
          data-aos="fade-right"
        >
          <div className="mb-0 flex w-full px-4 justify-evenly">
            <div className="input-group block md:w-1/2 pr-2">
              <label htmlFor="productName" className="block font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                className="form-input mt-1 w-full p-2"
                value={formData.productName}
                onChange={handleChange}
              />
            </div>

            <div className="block md:w-1/2 pl-2">
              <div className="flex justify-between">
                <label htmlFor="category" className="block font-medium text-gray-700">
                  Category
                </label>
                <Link to="/categories">
                  <svg
                    className="w-6 h-6 text-teal-600 mr-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              <select
                id="category"
                className="form-select mt-1 w-full p-2"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Select</option>
                {category.map((cat) => (
                  <option key={cat._id} value={cat.newTitle}>
                    {cat.newTitle}
                  </option>
                ))}
              </select>
            </div>

          </div>
          <div className="flex flex-wrap justify-evenly -mt-2">
          <div className="input-group w-full md:w-5/12">
              <label
                htmlFor="price"
                className="block font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                className="form-input mt-1 h-7 w-full p-1"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="input-group w-full md:w-5/12">
              <label
                htmlFor="type"
                className="block font-medium text-gray-700"
              >
                Type
              </label>
              <input
                type="text"
                id="type"
                className="form-input mt-1 w-full p-1"
                value={formData.type}
                onChange={handleChange}
              />
            </div>
            
          </div>
          <div className="flex flex-wrap justify-evenly -mt-2">
            <div className="input-group w-full md:w-5/12 mb-4 md:mb-0">
              <label htmlFor="unit" className="block font-medium text-gray-700">
                Unit
              </label>
              <select
                id="unit"
                className="form-input mt-1 w-full p-1"
                value={formData.unit}
                onChange={handleChange}
              >
                <option>Select</option>
                <option value="pieces">Pieces</option>
                <option value="grams">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="mg">Milligrams (mg)</option>
                <option value="pound">Pounds (lb)</option>
                <option value="lit">Litres (l)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="dozens">Dozens</option>
                <option value="cup">Cups</option>
              </select>
            </div>
            <div className="input-group w-full md:w-5/12">
              <label
                htmlFor="stock"
                className="block font-medium text-gray-700"
              >
                Stock
              </label>
              <input
                type="text"
                id="stock"
                className="form-input mt-1 h-7 w-full p-1"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3 flex flex-wrap justify-between">
            <div className="input-group w-full">
              <label
                htmlFor="description"
                className="block font-medium text-gray-700 ml-6"
              >
                Description
              </label>
              <textarea
                id="description"
                className="form-textarea mt-1 w-[90%] m-auto"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="mb-4 flex justify-center">
            <button
              type="submit"
              className="submit-button bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : isUpdateMode
                  ? "Update"
                  : "Submit"}
            </button>
          </div>
        </div>

        <div
          className="product_table w-full md:w-2/3 md:mt-0 md:p-4"
          data-aos="fade-left"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-100">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-3 text-start border-b rounded-tl-lg">
                    Product ID
                  </th>
                  <th className="py-2 px-3 border-b text-start">Name</th>
                  <th className="py-2 px-3 border-b text-start">Type</th>
                  <th className="py-2 px-3 border-b text-start">Category</th>
                  <th className="py-2 px-3 border-b text-start">Unit</th>
                  <th className="py-2 px-3 border-b text-start">Stock</th>
                  <th className="py-2 px-3 border-b text-start">Price</th>
                  <th className="py-2 px-3 border-b text-start">Description</th>
                  <th className="py-2 px-3 border-b text-start">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length ? (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-3 border-b text-start">
                        {item.productid || "NA"}
                      </td>
                      <td className="py-2 px-3 border-b text-start">
                        {item.productName || "NA"}
                      </td>
                      <td className="py-2 px-3 border-b text-start">
                        {item.type || "NA"}
                      </td>
                      <td className="py-2 px-3 border-b text-start">
                        {item.category || "NA"}
                      </td>
                      <td className="py-2 px-3 border-b text-start">
                        {item.unit || "NA"}
                      </td>
                      <td className="py-2 px-3 border-b text-start">
                        {item.stock || "NA"}
                      </td>
                      <td className="py-2 px-3 border-b text-start">
                        {item.price || "NA"}
                      </td>
                      <td className="py-2 px-3 border-b text-start">
                        {item.description || "NA"}
                      </td>
                      <td className="py-2 px-3 border-b text-start">
                        <div className="flex gap-3">
                          <img
                            className="cursor-pointer h-6"
                            src={update}
                            alt="update icon"
                            title="Update Your Product"
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-2 px-3 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-2 px-4 py-2  text-gray-500 border rounded "
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-2 px-4 py-2 ${currentPage === index + 1
                      ? "bg-blue-700 text-white"
                      : "bg-blue-500 text-white"
                    } rounded hover:bg-blue-700`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="mx-2 px-4 py-2  text-gray-500 rounded border"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
