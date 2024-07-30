import React from 'react';
import structure from "../assets/images/structure.gif";
import historyIcon from "../assets/images/order.gif";
import productIcon from '../assets/images/add-product.png';
import offer from '../assets/images/offer.png';
import customer from '../assets/images/customer.png';
import customers from '../assets/images/customers.gif';
import invoice from '../assets/images/invoice.gif';
import expense from '../assets/images/expense.gif';
import analytics from '../assets/images/analytics.gif';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
   return (
      <div className="container mx-auto px-4 py-2 bg-gray-100">
         <h1 className="text-3xl font-bold font-serif mb-6 text-center text-teal-600 bg-gray-200 py-2 px-6 rounded-full shadow-md">
            Admin Panel
         </h1>

         <div className="row gap-6 items-center justify-center">

            <div className='col-md-2 mb-6'>
               <Link
                  to=""
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Structure" src={structure} alt="Structure" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Structure</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to=""
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Offer" src={offer} alt="Offer" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Add Offer</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to="/history"
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Add Category" src={historyIcon} alt="Category" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Add Category</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to="/add-product"
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Add Product" src={productIcon} alt="product" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Add Product</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to="/products"
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Products" src={productIcon} alt="product" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">All Products</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to=""
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Invoice" src={invoice} alt="Invoice" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Invoice</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to=""
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Add Customer" src={customer} alt="Customer" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Add Customer</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to=""
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Customers" src={customers} alt="Customer" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">All Customers</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to="/expensises"
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Expenses" src={expense} alt="Expenses" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Expenses</h2>
               </Link>
            </div>

            <div className='col-md-2 mb-6'>
               <Link
                  to=""
                  className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md mt-5"
               >
                  <img title="Analytics" src={analytics} alt="Expenses" width="50px" />
                  <h2 className="pt-2 text-center text-lg font-semibold text-gray-800">Analytics</h2>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default AdminPanel;
