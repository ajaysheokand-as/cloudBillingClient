// BillContext.js
import React, { createContext, useContext, useState } from 'react';

const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [billData, setBillData] = useState(null);

  return (
    <BillContext.Provider value={{ billData, setBillData }}>
      {children}
    </BillContext.Provider>
  );
};

export const useBill = () => useContext(BillContext);
