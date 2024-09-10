import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/Const";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${baseUrl}forgot-password`, { email });
      console.log(response);
      setMessage("Password reset link has been sent to your email.");
    } catch (error) {
      setError("Failed to send password reset link. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center  items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-gray-800 mt-2 mb-6 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700  text-xl font-medium ml-2 mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="ml-2 mr-2">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none border border-gray-300 rounded-md w-full bg-gray-100 py-2 px-2 w-s focus:outline-none focus:border-blue-500 focus:bg-white"
              required
            />
            </div>
          </div>
          {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-700 text-white font-bold py-2 px-3 mb-2 rounded-md w-44 focus:outline-none hover:bg-blue-700 transition duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
