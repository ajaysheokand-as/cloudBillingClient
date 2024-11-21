import React from 'react'
import QRCode from "qrcode.react";

export const QrCode = ({ upiDetails, totalAmount }) => {


  if (!upiDetails || upiDetails === 'UPI not set') {
    return ;
  }
  return (
    <div className="text-center">
      <p className="font-bold mb-2">Scan the QR code to pay ₹{totalAmount}</p>
      <div className="flex justify-center items-center my-3">
        <QRCode value={`upi://pay?pa=${upiDetails}&am=${totalAmount}`} size={98} renderAs="svg" />
      </div>
    </div >
  );
};

