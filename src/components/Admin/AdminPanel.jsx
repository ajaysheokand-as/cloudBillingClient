import React, { useEffect, useState } from 'react';
import structure from "../../assets/images/structure.gif";
import historyIcon from "../../assets/images/order.gif";
import process from "../../assets/images/loading.gif";
import productIcon from "../../assets/images/add-product.png";
import customer from "../../assets/images/customer.png";
import customers from "../../assets/images/customers.gif";
import invoice from "../../assets/images/invoice.gif";
import expense from "../../assets/images/expense.gif";
import analytics from "../../assets/images/analytics.gif";
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminPanel = () => {

   const [registrationType, setRegistrationType] = useState(null);


   useEffect(() => {
      AOS.init({
         duration: 1000,
         mirror: false,
      });
   }, []);

   useEffect(() => {
      const type = localStorage.getItem("registrationType");
      setRegistrationType(type);
   }, []);

   return (
      <div className=' container mx-auto '>
         <div className=" px-4 py-4 my-3 bg-gray-100 adminepanel">
            <h1 className="text-3xl font-bold font-serif mb-6 text-center text-teal-600 bg-200 py-2 px-6 ">
               Admin Panel
            </h1>

            <div className="row gap-6 items-center justify-center">

               {registrationType === "restaurant" && (

                  <div className='col-md-2 mb-6' data-aos="zoom-in">
                     <Link
                        to="/structure"
                        className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                     >
                        <img title="Structure" src={structure} alt="Structure" width="50px" />
                        <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Structure</h2>

                     </Link>
                  </div>
               )}

               {registrationType === "restaurant" && (

                  <div className='col-md-2 mb-6' data-aos="zoom-in">
                     <Link
                        to="/process"
                        className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                     >
                        <img title="Process" src={process} alt="Offer" width="50px" />
                        <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Process</h2>
                     </Link>
                  </div>
               )}

               <div className='col-md-2 mb-6' data-aos="zoom-in">
                  <Link
                     to="/categories"
                     className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                  >
                     <img title="Add Category" src={historyIcon} alt="Category" width="50px" />
                     <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Add Category</h2>
                  </Link>
               </div>

               <div className='col-md-2 mb-6' data-aos="zoom-in">
                  <Link
                     to="/add-product"
                     className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                  >
                     <img title="Add Product" src={productIcon} alt="product" width="50px" />
                     <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Add Product</h2>
                  </Link>
               </div>

               {/*<div className='col-md-2 mb-6' data-aos="zoom-in">
                  <Link
                     to="/products"
                     className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                  >
                     <img title="Products" src={productIcon} alt="product" width="50px" />
                     <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">All Products</h2>
                  </Link>
               </div>*/}

               <div className='col-md-2 mb-6' data-aos="zoom-in">
                  <Link
                     to="/history"
                     className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                  >
                     <img title="Invoice" src={invoice} alt="Invoice" width="50px" />
                     <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Invoice</h2>
                  </Link>
               </div>

               <div className='col-md-2 mb-6' data-aos="zoom-in">
                  <Link
                     to=""
                     className="relative flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                  >
                     <img title="Add Customer" src={customer} alt="Customer" width="50px" />
                     <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Add Customer</h2>
                     <span className="beta absolute bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">beta</span>

                  </Link>
               </div>

               <div className='col-md-2 mb-6' data-aos="zoom-in">
                  <Link
                     to=""
                     className="relative flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                  >
                     <img title="Customers" src={customers} alt="Customer" width="50px" />
                     <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">All Customers</h2>
                     <span className="beta absolute bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">beta</span>

                  </Link>
               </div>

               <div className='col-md-2 mb-6' data-aos="zoom-in">
                  <Link
                     to="/expensises"
                     className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
                  >
                     <img title="Expenses" src={expense} alt="Expenses" width="50px" />
                     <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Expenses</h2>
                  </Link>
               </div>

               <div className='col-md-2 mb-6' data-aos="zoom-in">
                  <Link
                     to=""
                     className="flex flex-col relative items-center bg-white p-4 rounded-lg shadow-md mt-5"
                  >
                     <img
                        title="Analytics"
                        src={analytics}
                        alt="Analytics"
                        width="50px"
                        className=''
                     />
                     <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Analytics</h2>
                     <span className="beta absolute bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">beta</span>
                  </Link>
               </div>

            </div>
         </div>
      </div>
   );
};

export default AdminPanel;
