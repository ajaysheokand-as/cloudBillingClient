import React from 'react'
import QRCode from "qrcode.react";

export const QrCode = ({ upiDetails, totalAmount }) => {


  if (!upiDetails || upiDetails === 'UPI not set') {
    return <p className="text-red-500">UPI details are not available!</p>;
  }

  return (
    <div className="text-center">
      <p className="font-bold mb-2">Scan the QR code to pay ₹{totalAmount}</p>
      <div className="flex justify-center items-center my-4">
        <QRCode value={`upi://pay?pa=${upiDetails}&am=${totalAmount}`} size={98} renderAs="svg" />
      </div>
    </div >
  );
};

