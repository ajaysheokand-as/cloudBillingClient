import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import historyIcon from "../assets/images/order.gif";
import gif from "../assets/images/webp/giphy.webp";
import process from "../assets/images/loading.gif";
import callIcon from "../assets/images/customer-service.gif";
import productIcon from "../assets/images/add-product.png";
import logout from "../assets/images/log-out.gif";
import admin from "../assets/images/admin.gif";
import profile from "../assets/images/profile.gif";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [registrationType, setRegistrationType] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("registrationType");
    setIsLoggedOut(true);
  };

  const handleLogoClick = () => {
    
    !registrationType && setRegistrationType(localStorage.getItem("registrationType"));

    if (registrationType === "restaurant") {
      navigate("/table"); // Redirect to table page for restaurant
    } else {
      navigate("/home"); // Redirect to home page for other types
    }
  };

  useEffect(() => {
    if (isLoggedOut) {
      navigate("/");
      window.location.reload();
    }
  }, [isLoggedOut, navigate]);

  useEffect(() => {
    const type = localStorage.getItem("registrationType");
    setRegistrationType(type);
  }, []);
  
  return (
    <div>
      <nav className="bg-white w-full shadow-md py-1 px-4 flex items-center justify-between fixed top-0 z-40">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            className="mr-4 text-xl block lg:hidden"
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>
          <button onClick={handleLogoClick} className="focus:outline-none">
            <img width={100} height={100} src={gif} alt="Logo" />
          </button>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Always show Login and Register buttons */}
          {(location.pathname === "/" || location.pathname === "/register") && (
            <>

              <div className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">Help Line:- 1234567890</div>

              {/* here Rohit's modification */}


              {/* <Link to="/register">
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
                  Register Now
                </button>
              </Link>
              <Link to="/">
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
                  Login
                </button>
              </Link> */}
            </>
          )}
          {/* Conditional rendering for other links */}
          {!(
            location.pathname === "/" || location.pathname === "/register"
          ) && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span>
                    <img src={callIcon} alt="Call Icon" width="36" height="36" />
                  </span>
                  <span className="font-bold">8570996916</span>
                </div>
                
                <Link
                  to="/add-product"
                  className="flex items-center space-x-1 hover:text-red-600 transition duration-300"
                >
                  <img
                    title="Add Product"
                    src={productIcon}
                    alt="Add Product Icon"
                    width="30"
                  />
                </Link>
                <Link to="/history">
                  <img
                    title="Order History"
                    src={historyIcon}
                    alt="Order History Icon"
                    width="30"
                  />
                </Link>

                {registrationType === "restaurant" && (
                  <Link to="/process" className="flex items-center space-x-2">
                    <img
                      title="Process"
                      src={process}
                      alt="Process"
                      width="28"
                    />
                  </Link>
                )}

                <Link to="/admin" className="flex items-center space-x-2">
                  <img
                    title="Admin Panel"
                    src={admin}
                    alt="Admin Panel Icon"
                    width="28"
                  />
                </Link>

                <Link to="/profile" className="flex items-center space-x-2">
                  <img
                    title="Profile"
                    src={profile}
                    alt="Profile Icon"
                    width="30"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <img title="Logout" src={logout} alt="Logout Icon" width="28" />
                </button>
              </div>
            )}
        </div>
      </nav>

      {/* Sidebar for mobile and tablet screens */}
      <div className={`fixed top-0 z-50 right-0 h-full bg-white shadow-md transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 lg:hidden`}>
        <div className="p-4">
          <button className="text-xl mb-4" onClick={toggleSidebar}>
            <i className="fas fa-times hover:text-red-600 transition duration-300"></i>
          </button>
          <div className="flex flex-col space-y-4">
            {/* Always show Login and Register buttons */}
            {(location.pathname === "/" ||
              location.pathname === "/register") && (
                <>
                  <Link to="/register">Register Now</Link>
                  <Link to="/">Login</Link>
                </>
              )}
            {/* Conditional rendering for other links */}
            {!(
              location.pathname === "/" || location.pathname === "/register"
            ) && (
                <div>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <img
                      title="Profile"
                      src={profile}
                      alt="Profile Icon"
                      width="30"
                    />
                    <span>Profile </span>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span>
                      <img
                        src={callIcon}
                        alt="Call Icon"
                        width="36"
                        height="36"
                      />
                    </span>
                    <span className="font-bold">9099012488</span>
                  </div>
                  <Link to="/add-product" className="flex items-center space-x-2">
                    <img
                      src={productIcon}
                      alt="Add Product Icon"
                      width="40"
                      height="40"
                    />
                    <span>Add Product</span>
                  </Link>
                  <Link to="/history" className="flex items-center space-x-2">
                    <img
                      src={historyIcon}
                      alt="Order History Icon"
                      width="40"
                      height="40"
                    />
                    <span>Order History</span>
                  </Link>

                  {registrationType === "restaurant" && (
                    <Link to="/process" className="flex items-center space-x-2">
                      <img
                        src={process}
                        alt="Process"
                        width="40"
                        height="40"
                      />
                      <span>Process</span>
                    </Link>
                  )}

                  <Link to="/admin" className="flex items-center space-x-2">
                    <img
                      src={admin}
                      alt="Admin Panel Icon"
                      width="40"
                      height="40"
                    />
                    <span>Admin Panel</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                  >
                    <img src={logout} alt="Logout Icon" width="40" height="40" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
