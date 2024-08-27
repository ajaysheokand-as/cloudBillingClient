import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import { baseUrl } from '../utils/Const';
import "aos/dist/aos.css";
import { useGstDiscount } from "../context/GstDiscountContext";

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
  addToOrderincrease,
  addToOrderdecrease,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { discount, gst, setDiscount, setGST } = useGstDiscount();
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


  // on X button 
  useEffect(() => {
    if (!orderItems || orderItems.length === 0) {
      setDiscount(0);
      setGST(0);
    }
  }, [orderItems, setDiscount, setGST]);

  const calculateFinalAmount = () => {
    const totalAmount = calculateTotal();
    const discountAmount = (totalAmount * discount) / 100;
    const subtotal = totalAmount - discountAmount;
    const gstAmount = (subtotal * gst) / 100;
    return subtotal + gstAmount;
  };

  const handlePlaceOrder = async () => {
    if (!orderItems || orderItems.length === 0) {
      toast.error("Add items to your order !!");
      return;
    }   

    const finalAmount = calculateFinalAmount();
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
      totalAmount: finalAmount,
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
        <div className="overflow-x-auto overflow-auto max-h-[500px] example">
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
                  <td className="py-1 px-3 text-center flex justify-center items-center space-x-2">
                    <button
                      onClick={() => addToOrderdecrease(item)}
                      className="bg-red-500 text-white text-4xl float-none px-2 h-7 w-7 flex items-center rounded-full pb-1.5"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-3xl">{item.quantity}</span>
                    <button
                      onClick={() => addToOrderincrease(item)}
                      className="bg-green-500 text-white text-4xl flex items-center justify-center px-2 h-7 w-7 rounded-full"
                    >
                      +
                    </button>
                  </td>
                  <td className="py-1 px-3 text-center">
                    ₹{item.price * item.quantity}
                  </td>
                  <td className="py-1 px-8">
                    <button
                      onClick={() => removeFromOrder(item)}
                      className="text-red-500 hover:text-red-700 h-7 w-7 text-4xl border items-center flex justify-center"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="discount flex flex-col sm:flex-row sm:justify-between mt-3 print:hidden">
            <div className="mt-2 sm:mt-0">
              <label htmlFor="discount" className="font-semibold pl-1">
                Discount(%):
              </label>
              <input
                type="number"
                id="discount"
                className="border border-gray-300 rounded p-1 max-w-[150px] print:border-none"
                value={discount || ""}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
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
                value={gst || ""}
                onChange={(e) => setGST(parseFloat(e.target.value) || 0)}
              />
            </div>
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

          <div className="flex flex-row justify-between mt-4">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold">₹ {calculateFinalAmount().toFixed(2)}</p>
          </div>
        </div>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold font-serif py-2 px-4 rounded-full my-2"
          onClick={handlePlaceOrder}
        >
          {orderId ? "Update Order" : "Place Order"}
        </button>
      </div>

    </>
  );
};

export default BillingDetails;