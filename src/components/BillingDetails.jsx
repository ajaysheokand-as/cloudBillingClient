import React, { useState, useEffect } from "react";
import { baseUrl } from "../utils/Const";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

import { QrCode } from "./QrCode";
import { useBill } from "../context/BillContext";



const BillingDetails = ({
  section,
  index,
  billingDetails,
  handleBillingChange,
  orderItems,
  calculateTotal,
  generateBillSlip,
  removeFromOrder,
  orderId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [upiDetails, setUpiDetails] = useState(null);
  const { setBillData } = useBill();



  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.user) {
        setUserId(decodedToken.user.id);
      }
    }
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);


  useEffect(() => {
    if (paymentMethod === 'UPI') {
      axios.get(`${baseUrl}user/${userId}`)
        .then(response => {
          setUpiDetails(response.data.upiId);
        })
        .catch(error => {
          console.error("Error fetching UPI details:", error);
        });
    }
  }, [paymentMethod, userId]);


  const handlePlaceOrder = async () => {
    if (!orderItems || orderItems.length === 0) {
      toast.error("Add items to your order !!");
      return;
    }   

    const totalAmount = calculateTotal();
    const billData = {
      name: billingDetails.name,
      mobile: billingDetails.mobile,
      orderItems: orderItems.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      section,
      index,
      totalAmount,
      paymentMethod,
    };

    try {
      if (orderId) {
        await axios.put(`${baseUrl}updateBill/${orderId}`, billData);
        toast.success("Order Updated successfully!");
      } else {
        const response = await axios.post(`${baseUrl}bill/${userId}`, billData);
        const Bill = response?.data?.bill
        setBillData(Bill);
        toast.success(`Order placed successfully! Bill ID: ${response.data.bill.billId}`);
        
      }
      generateBillSlip();


    } catch (error) {
      toast.error("Error placing order!");
      console.error("Error placing order:", error);
    }
  };




  return (
    <> <ToastContainer />

      <div className="bill flex flex-col md:w-1/3 w-full xl:w-1/3 lg:w-1/3 bg-white px-4 pt-2 rounded shadow-md md:ml-4"
        data-aos="fade-left">

          <p className="text-lg text-teal-600 font-bold font-serif mb-4">Billing Details</p>
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex items-center">
              <label className="w-1/4 text-right pr-4 xl:block hidden">Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name..."
                value={billingDetails.name}
                onChange={handleBillingChange}
                className="border border-gray-400 rounded px-2 py-1 flex-grow"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/4 text-right pr-4 xl:block hidden">Mobile:</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter Mobile No..."
                value={billingDetails.mobile}
                onChange={handleBillingChange}
                className="border border-gray-400 rounded px-2 py-1 flex-grow"
                required
              />
            </div>

          </div>

          <p className="text-lg font-bold mb-4 text-teal-600 font-serif">Order Summary</p>
          <div className="overflow-x-auto overflow-auto max-h-[200px] example">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="py-1 px-3 bg-gray-50">Item</th>
                  <th className="py-1 px-3 bg-gray-50">Quantity</th>
                  <th className="py-1 px-3 bg-gray-50">Price</th>
                  <th className="py-1 px-3 bg-gray-50">Cancel</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {orderItems?.map((item) => (
                  <tr key={item.productName}>
                    <td className="py-1 px-3">{item.productName}</td>
                    <td className="py-1 px-3 text-center">{item.quantity}</td>
                    <td className="py-1 px-3 text-center">₹{item.price * item.quantity}</td>
                    <td className="py-1 px-8">
                      <button
                        onClick={() => removeFromOrder(item)}
                        className="text-red-500 hover:text-red-700 flex justify-center"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row justify-between mt-4">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold">₹ {calculateTotal()}</p>
          </div>

          <div className="my-4">
            <label className="font-bold">Choose Payment Method:</label>
            <div>
              <input
                type="radio"
                name="paymentmethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")} />
              <label className="ml-2">Cash on Delivery</label>
            </div>
            <div>
              <input
                type="radio"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
              <label className="ml-2">UPI</label>
            </div>
          </div>

          {paymentMethod === "UPI" && upiDetails && (
            <div className="flex justify-center items-center my-4">
              <QrCode upiDetails={upiDetails} totalAmount={calculateTotal()} />
            </div>
          )}

          <button
            className="bg-teal-600 w-full hover:bg-teal-700 text-white font-bold font-serif py-2 px-4 rounded-full my-2"
            onClick={handlePlaceOrder}
          >
            {orderId ? "Update Order" : "Place Order"}
          </button>
      </div>

    </>
  );
};

export default BillingDetails;