// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { baseUrl } from "../utils/Const";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     emailOrMobile: "",
//     password: "",
//   });
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${baseUrl}login`, formData);
//       const { token, registrationType } = response.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("registrationType", registrationType);
//       console.log("Login successful");
//       if (registrationType === "store") {
//         navigate("/home");
//       } else {
//         navigate("/table");
//       }
//     } catch (error) {
//       setError("Invalid credentials");
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="img2">
//       <div className="flex justify-center z-[1] items-center h-screen">
//         <div className="backdrop-blur-[2px]">
//           <form
//             onSubmit={handleSubmit}
//             className="bg-[#a2999984] z-[3] max-w-[450px] rounded px-8 pt-6 pb-8 mb-4"
//           >
//             <p className="text-2xl font-bold mb-6 text-center text-black">
//               Login
//             </p>
//             <input
//               type="text"
//               name="emailOrMobile"
//               placeholder="Enter Your Email & Mobile No."
//               onChange={handleChange}
//               className="appearance-none border-2 border-gray-300 rounded-md bg-transparent py-2 px-4 mb-4 w-full transform transition duration-500 hover:scale-105 focus:outline-none focus:border-[#000000d0] focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               onChange={handleChange}
//               className="appearance-none border-2 border-gray-300 rounded-md bg-transparent py-2 px-4 mb-4 w-full transform transition duration-500 hover:scale-105 focus:outline-none focus:border-[#000000d0] focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
//             />
//             <button
//               type="submit"
//               className="bg-[#383636c8] hover:bg-[#262525] transform transition duration-500 hover:scale-105 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
//             >
//               Login
//             </button>
//             <p className="capitalize mt-4 text-black">
//               If you have no account
//               <Link to="/register" className="text-[blue] ms-1">
//                 register
//               </Link>{" "}
//               here
//             </p>
//           </form>
//         </div>
//       </div>
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default Login;
