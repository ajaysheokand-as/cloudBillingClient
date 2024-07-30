import React from "react";
import { Link } from "react-router-dom";

const RegistationType = () => {
  return (
    <div className="flex gap-3 justify-center z-[1] items-center h-screen">
      <Link to="/register?type=restaurant">
        <button className="common_btn">Restaurant</button>
      </Link>
      <Link to="/register?type=store">
        <button className="common_btn">Store</button>
      </Link>
    </div>
  );
};

export default RegistationType;
