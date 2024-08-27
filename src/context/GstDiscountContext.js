import React, { createContext, useContext, useState } from 'react';


const GstDiscountContext = createContext({
  discount: 0,
  gst: 0,
  setDiscount: () => {},
  setGST: () => {},
});


export const GstDiscountProvider = ({ children }) => {
  const [discount, setDiscount] = useState(0);
  const [gst, setGST] = useState(0);

  return (
    <GstDiscountContext.Provider value={{ discount, gst, setDiscount, setGST }}>
      {children}
    </GstDiscountContext.Provider>
  );
};


export const useGstDiscount = () => {
  const context = useContext(GstDiscountContext);
  if (!context) {
    throw new Error('useGstDiscount must be used within a GstDiscountProvider');
  }
  return context;
};
