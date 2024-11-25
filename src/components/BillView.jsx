import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseUrl } from '../utils/Const';
import { QrCode } from "./QrCode";



const BillView = () => {
   const { orderId } = useParams();
   const [bill, setBill] = useState(null);
   const [userId, setUserId] = useState(null);
   const [restroDetails, setRestroDetails] = useState({});

   const fetchBill = async () => {
      try {
         const response = await axios.get(`${baseUrl}billss/${orderId}`);
         setBill(response?.data);
         setUserId(response?.data?.userId);
      } catch (error) {
         console.error("Error fetching bill:", error);
      }
   };

   const fetchRestroDetails = async (userId) => {
      try {
         const response = await axios.get(`${baseUrl}user/${userId}`);
         setRestroDetails(response?.data);
      } catch (error) {
         console.error("Error fetching user data:", error);
      }
   };

   useEffect(() => {
      
      fetchRestroDetails(userId);
      fetchBill();
   }, [orderId,userId]);
   

   // useEffect(() => {
      
      
   // }, [userId]);

   const handleUPIPayment = () => {
      const upiUrl = `upi://pay?pa=${restroDetails.upiId}&am=${bill.totalAmount}&cu=INR`;
      window.location.href = upiUrl;
   };

   if (!bill) {
      return <h1 className="mt-50 text-center h-1">Your Bill is Loading...</h1>;
   }

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
         <div className="mt-32 mb-10 bg-white p-3 md:p-6 rounded shadow-md w-full max-w-[450px] mx-2 sm:mx-4">

            <div className="bill-slip bg-gray-100 p-3 rounded">
               <div className="max-w-[400px] ">
                  <div className="bill">
                     <h2 className="text-center text-2xl font-bold">
                        {restroDetails.shop_type}
                     </h2>
                     <div className="border-b-2 border-dotted border-gray-500 py-2">
                        <p className="text-center ">
                           {restroDetails.address}
                        </p>
                     </div>
                     <div className="bill-details mt-3 print:border-b-2 border-dotted border-gray-500 print:py-1">
                        <p className="flex justify-between">
                           <span>Bill No:</span> <span>{bill.billId}</span>
                        </p>
                        <p className="flex justify-between">
                           <span>Date:</span>{" "}
                           <span>{new Date().toLocaleDateString()}</span>
                        </p>

                        <div className="mt-2">
                           {bill.name && (
                              <p className="flex justify-between">
                                 <span>Name:</span> <span>{bill.name}</span>
                              </p>
                           )}
                           {bill.mobile && (
                              <p className="flex justify-between">
                                 <span>Mobile:</span> <span>{bill.mobile}</span>
                              </p>
                           )}
                        </div>
                     </div>

                     <h3 className="text-lg font-semibold mt-2 text-center">
                        Order Details :
                     </h3>
                     <ul className="list-disc list-inside mb-2 max-h-[100px] overflow-auto print:max-h-full">
                        <li className="flex justify-between">
                           <span>
                              Item
                           </span>
                           <div className="flex justify-between w-28">
                              <span>
                                 QTY
                              </span>
                              <span>
                                 Price
                              </span>
                           </div>
                        </li>
                     </ul>
                     <ul className="list-disc list-inside mb-2 max-h-[100px] overflow-auto print:max-h-full">
                        {bill.orderItems && bill.orderItems.map((item, index) => (
                           <li key={item.productName} className="flex justify-between w-full">
                              <span>
                                 {item.productName}
                              </span>
                              <div className="flex justify-between w-24">
                                 <span>
                                    {item.quantity}
                                 </span>
                                 <span>
                                    ₹{item.price * item.quantity}
                                 </span>
                              </div>
                           </li>
                        ))}
                     </ul>
                     <p className="flex justify-between bill-total text-lg font-semibold mt-2">
                        <span>Sub Total :</span> <span>₹{bill.subtotal}</span>
                     </p>
                     <div className="discount flex flex-col sm:flex-row sm:justify-between print:hidden">
                        <div className="mt-2 sm:mt-0">
                           <label className="font-semibold pl-1">
                              Discount:
                           </label>
                           <span className="pl-1">{bill.discount}%</span>
                        </div>
                        <div className="mt-2 sm:mt-0">
                           <label className="font-semibold pl-1">
                              GST (%):
                           </label>
                           <span className="pl-1">{bill.gst}%</span>
                        </div>
                     </div>

                     <p className="flex justify-between bill-total text-xl font-bold mt-2 print:border-y-2 border-dashed border-gray-500 print:py-2">
                        <span>Total :</span> <span>₹{bill.totalAmount.toFixed(2)}</span>
                     </p>
                  </div>



                  <div className='my-3 text-center'>

                     {restroDetails.upiId && (
                        <div className="mt-[-4]">
                           <QrCode upiDetails={restroDetails.upiId} totalAmount={bill.totalAmount} />
                           <p className="mb-1 font-bold"
                           >Or</p>
                           <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2"
                              onClick={handleUPIPayment}
                           >
                              Pay Now
                           </button>
                           <p className='text-xl'>Thanks for visiting !!</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default BillView;
