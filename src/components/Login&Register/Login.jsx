import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../utils/Const";
import { useAuth } from "../authentication/AuthContext";
import "../Login&Register/LoginRegister.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${baseUrl}login`, formData);
      const { token, registrationType } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("registrationType", registrationType);
      login(token);
      console.log("Login successful");
      if (registrationType === "store") {
        navigate("/home");
      } else if(registrationType==='superadmin') {
        navigate("/superadmin");
      }else{
        navigate('/table')
      }
    } catch (error) {
      setError("Invalid credentials");
      console.error("Error:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="img2">
      <div className="flex justify-center z-[1] items-center h-screen">
        <div className="backdrop-blur-[2px]">
          <form
            onSubmit={handleSubmit}
            className="bg-[#a2999984] z-[3] max-w-[450px] rounded px-8 pt-6 pb-8 mb-4"
          >
            <p className="text text-2xl font-bold mb-6 text-center text-black">
              Login
            </p>
            <input
              type="text"
              name="emailOrMobile"
              placeholder="Enter Your Email or Mobile No."
              onChange={handleChange}
              className="inputtext appearance-none border-2 border-gray-300 rounded-md bg-transparent py-2 px-4 mb-4 w-full focus:outline-none focus:border-[#000000d0]"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="inputtext appearance-none border-2 border-gray-300 rounded-md bg-transparent py-2 px-4 mb-2 w-full focus:outline-none focus:border-[#000000d0]"
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            
            {/* Forgot Password Button */}
            <div className="mb-4 text-right">
              <Link to="/ForgotPassword" className="text-[blue] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="bg-[#383636c8] hover:bg-[#262525] transform transition duration-500 hover:scale-105 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Login'}
            </button>
            <p className="text capitalize mt-4">
              Not have an account?
              <Link
                to="/register"
                className="text-[blue] hover:underline underline-offset-2 ms-1 font-bold"
              >
                Register
              </Link>{" "}
              here
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
