import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../utils/Const";
import { QrCode } from "./QrCode";
import { useBill } from "../context/BillContext";
import { useGstDiscount } from "../context/GstDiscountContext";

const BillModal = ({
    billingDetails,
    orderItems,
    calculateTotal,
    closeModal,
    billIdOld,
    wtspId,
}) => {
    const { discount: contextDiscount, gst: contextGst } = useGstDiscount();
    const [userId, setUserId] = useState();
    const [rastroDetails, setRastroDetails] = useState({});
    const billRef = useRef(null);
    const {billData} = useBill();

    useEffect(() => {
        const fetchUserData = async (userId) => {
            try {
                const response = await axios.get(`${baseUrl}user/${userId}`);
                setRastroDetails(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);

            if (decodedToken?.user?.id) {
                const User = decodedToken.user.id;
                setUserId(User);
                fetchUserData(User);
            } else {
                console.error("Error: userId is missing in the decoded token");
            }
        } else {
            console.error("Error: token not found");
        }
    }, [userId]);

    const gst = billingDetails.gstAmount || contextGst || 0;
    const discount = billingDetails.discountAmount || contextDiscount || 0;

    const subTotal = calculateTotal();
    const discountAmount = subTotal * (discount / 100);
    const totalWithDiscount = subTotal - discountAmount;
    const gstAmount = totalWithDiscount * (gst / 100);
    const totalWithGST = totalWithDiscount + gstAmount;

    const handlePrint = () => {
        const printContents = billRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const billIdToShow = billIdOld || billData?.billId;

    const handleWhatsAppShare = () => {
        const uniqueId = wtspId || billData?._id;
        const billUrl = `${window.location.origin}/#/bill/${uniqueId}`;
        const whatsappUrl = `https://wa.me/${billingDetails?.mobile}?text=Your%20bill%20link:%20${encodeURIComponent(billUrl)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="bg-white p-4 md:p-6 rounded shadow-md w-full max-w-[450px] mx-2 sm:mx-4">
                <div className="bill-slip bg-gray-100 p-4 rounded" ref={billRef}>
                    <div className="print:max-w-[250px] ">
                        <div className="bill">
                            <h2 className="text-center text-2xl font-bold">
                                {rastroDetails.shop_type}
                            </h2>
                            <div className="address print:border-b-2 border-dotted border-gray-500 print:py-2">
                                <p className="text-center ">
                                    <span className="block">{rastroDetails.address}</span>
                                </p>
                            </div>
                            <div className="bill-details mt-3 print:border-b-2 border-dotted border-gray-500 print:py-1">
                                <p className="flex justify-between">
                                    <span>Bill No:</span> <span>{billIdToShow}</span>
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
                                    <span>Item</span>
                                    <div className="flex justify-between w-28">
                                        <span>QTY</span>
                                        <span>Price</span>
                                    </div>
                                </li>
                            </ul>
                            <ul className="list-disc list-inside mb-2 max-h-[100px] overflow-auto print:max-h-full">
                                {orderItems.map((item, index) => (
                                    <li key={item.productName} className="flex justify-between w-full">
                                        <span>{item.productName}</span>
                                        <div className="flex justify-between w-24">
                                            <span>{item.quantity}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="flex justify-between bill-total text-lg font-semibold mt-4">
                                <span>Sub Total:</span> <span>₹{subTotal}</span>
                            </p>
                            <p className="flex justify-between bill-total text-lg font-semibold">
                                <span>Discount ({discount}%):</span> <span>₹{discountAmount.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between bill-total text-lg font-semibold">
                                <span>GST ({gst}%):</span> <span>₹{gstAmount.toFixed(2)}</span>
                            </p>

                            <p className="flex justify-between bill-total text-xl font-bold mt-3 print:border-y-2 border-dashed border-gray-500 print:py-2">
                                <span>Total:</span> <span>₹{totalWithGST.toFixed(2)}</span>
                            </p>
                        </div>

                        <div className='thanks my-3 text-center'>

                            {rastroDetails.upiId && (
                                <div className="mt-4">
                                    <QrCode upiDetails={rastroDetails.upiId} totalAmount={totalWithGST.toFixed(2)} />
                                    <p className='text-xl'>Thanks for visiting !!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-4">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2"
                        onClick={handleWhatsAppShare}
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
