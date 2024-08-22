import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../utils/Const";
import { QrCode } from "./QrCode";

const BillModal = ({
   billingDetails,
   orderItems,
   calculateTotal,
   closeModal,
   shareOnWhatsApp,
}) => {
   const [discount, setDiscount] = useState(0);
   const [userId, setUserId] = useState();
   const [rastroDetails, setRastroDetails] = useState({});
   const [gst, setGST] = useState(0);
   const billRef = useRef(null);

   useEffect(() => {
      const fetchUserData = async (userId) => {
         try {
            const response = await axios.get(`${baseUrl}user/${userId}`);
            setRastroDetails(response.data);
            console.log("UPI is this:", response.data.upiId);
         } catch (error) {
            console.error("Error fetching user data:", error);
         }
      };

      const token = localStorage.getItem("token");
      if (token) {
         const decodedToken = jwtDecode(token);
         console.log("Decoded Token:", decodedToken);

         if (decodedToken?.user?.id) {
            const User = decodedToken.user.id;
            console.log("User", User);
            setUserId(User);
            fetchUserData(User);
         } else {
            console.error("Error: userId is missing in the decoded token");
         }
      } else {
         console.error("Error: token not found");
      }
   }, [userId]);

   const handleDiscountChange = (e) => {
      const value = parseFloat(e.target.value);
      setDiscount(isNaN(value) ? 0 : value);
   };

   const handleGSTChange = (e) => {
      const value = parseFloat(e.target.value);
      setGST(isNaN(value) ? 0 : value);
   };

   const tota = calculateTotal();
   console.log("total =", tota);
   const totalWithDiscount = calculateTotal() - discount;
   const totalWithGST = totalWithDiscount * (1 + gst / 100);

   const handlePrint = () => {
      const printContents = billRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
   };

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
         <div className="bg-white p-4 md:p-6 rounded shadow-md w-full max-w-[450px] mx-2 sm:mx-4">

            <div className="bill-slip bg-gray-100 p-4 rounded" ref={billRef}>
               <div className="print:max-w-[250px] ">
                  <div className="bill">
                     <h2 className="text-center text-2xl font-bold">
                        {rastroDetails.name}
                     </h2>
                     <div className="address print:border-b-2 border-dotted border-gray-500 print:py-2">
                        <p className="text-center ">
                           <span className="block">{rastroDetails.address}</span>
                        </p>
                     </div>
                     <div className="bill-details mt-3 print:border-b-2 border-dotted border-gray-500 print:py-1">
                        <p className="flex justify-between">
                           <span>Bill No:</span> <span>12345</span>
                        </p>
                        <p className="flex justify-between">
                           <span>Date:</span>{" "}
                           <span>{new Date().toLocaleDateString()}</span>
                        </p>

                        <div className="mt-2">
                           {billingDetails.name && (
                              <p className="flex justify-between">
                                 <span>Name:</span> <span>{billingDetails.name}</span>
                              </p>
                           )}
                           {billingDetails.mobile && (
                              <p className="flex justify-between">
                                 <span>Mobile:</span> <span>{billingDetails.mobile}</span>
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
                        {orderItems.map((item, index) => (
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
                     <p className="flex justify-between bill-total text-lg font-semibold mt-4">
                        <span>Sub Total :</span> <span>₹{calculateTotal()}</span>
                     </p>

                     <div className="discount flex flex-col sm:flex-row sm:justify-between print:hidden">
                        <div className="mt-2 sm:mt-0">
                           <label htmlFor="discount" className="font-semibold pl-1">
                              Discount:
                           </label>
                           <input
                              type="number"
                              id="discount"
                              className="border border-gray-300 rounded p-1 max-w-[150px] print:border-none"
                              value={discount}
                              onChange={handleDiscountChange}
                           />
                        </div>
                        <div className="mt-2 sm:mt-0">
                           <label htmlFor="gst" className="font-semibold pl-1">
                              GST (%):
                           </label>
                           <input
                              type="number"
                              id="gst"
                              className="border border-gray-300 rounded p-1 max-w-[150px] print:border-none"
                              value={gst}
                              onChange={handleGSTChange}
                           />
                        </div>
                     </div>

                     <p className="flex justify-between bill-total text-xl font-bold mt-3 print:border-y-2 border-dashed border-gray-500 print:py-2">
                        <span>Total :</span> <span>₹{totalWithGST.toFixed(2)}</span>
                     </p>
                  </div>



                  <div className='thanks my-3 text-center'>
                     <p className='text-xl'>Thanks for visiting !!</p>


                     {rastroDetails.upiId && (
                        <div className="mt-4">
                           <QrCode upiDetails={rastroDetails.upiId} totalAmount={tota} />
                           <p className='text-lg'> Scan to pay your bill </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-4">
               <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2"
                  onClick={shareOnWhatsApp}
               >
                  Share on WhatsApp
               </button>
               <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2"
                  onClick={handlePrint}
               >
                  Print
               </button>
               <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2"
                  onClick={closeModal}
               >
                  Close
               </button>
            </div>
         </div>
      </div>
   );
};

export default BillModal;