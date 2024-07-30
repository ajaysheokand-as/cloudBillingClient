import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
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
      } else {
        navigate("/table");
      }
    } catch (error) {
      setError("Invalid credentials");
      console.error("Error:", error);
    }
    setIsSubmitting(false);
  };

  // const handleGoogleSuccess = async (response) => {
  //   try {
  //     const res = await axios.post(`${baseUrl}auth/google/callback`, {
  //       token: response.credential,
  //     });
  //     localStorage.setItem("token", res.data.token);
  //     navigate("/home");
  //   } catch (error) {
  //     setError("Google login failed");
  //     console.error("Error:", error);
  //   }
  // };

  // const handleGoogleFailure = (error) => {
  //   console.error("Google login error:", error);
  //   setError("Google login failed");
  // };

  return (
    // <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <div className="img2">
      <div className="flex justify-center z-[1] items-center h-screen">
        <div className="backdrop-blur-[2px]">
          <form
            onSubmit={handleSubmit}
            className="bg-[#a2999984] z-[3] max-w-[450px] rounded px-8 pt-6 pb-8 mb-4"
          >
            <p className="text text-2xl font-bold mb-6 text-center text-black ">
              Login
            </p>
            <input
              type="text"
              name="emailOrMobile"
              placeholder="Enter Your Email & Mobile No."
              onChange={handleChange}
              className="inputtext appearance-none border-2 border-gray-300 rounded-md bg-transparent py-2 px-4 mb-4 w-full transform transition duration-500 hover:scale-105 focus:outline-none focus:border-[#000000d0] focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="inputtext appearance-none border-2 border-gray-300 rounded-md bg-transparent py-2 px-4 mb-2 w-full transform transition duration-500 hover:scale-105 focus:outline-none focus:border-[#000000d0] focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              type="submit"
              className="bg-[#383636c8] hover:bg-[#262525] transform transition duration-500 hover:scale-105 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Login'}
            </button>
            <p className=" text capitalize mt-4">
              Not have an account ?
              <Link to="/register" className="text-[blue] hover:underline underline-offset-2 ms-1 font-bold">
                Register
              </Link>{" "}
              here
            </p>
          </form>
        </div>
      </div>
    </div>
    // </GoogleOAuthProvider>
  );
};

export default Login;