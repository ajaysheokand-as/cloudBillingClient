import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomTable = () => {
  const tableData = {
    Table: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    RoomAC: [1, 2, 3, 4, 5, 6],
    CarOrder: [1, 2, 3, 4, 5, 6],
    BasementTable: [1, 2, 3, 4, 5, 6],
  };

  const [activeItems, setActiveItems] = useState([]);
  const navigate = useNavigate();

  const handleItemClick = (section, index) => {
    const itemIdentifier = `${section}-${index}`;
    setActiveItems((prev) =>
      prev.includes(itemIdentifier) ? prev : [...prev, itemIdentifier]
    );
    navigate(`/home?section=${section}&index=${index+1}`);
  };

  return (
    <div className="container mx-auto">
      <div className="p-4 space-y-8">
        {Object.keys(tableData).map((sectionName) => (
          <div key={sectionName} className="pb-4">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">{sectionName}</h2>
            <div className="flex flex-wrap gap-4">
              {tableData[sectionName].map((item, index) => {
                const itemIdentifier = `${sectionName}-${index}`;
                return (
                  <div
                    key={itemIdentifier}
                    className={`p-4 border rounded cursor-pointer flex items-center justify-center ${
                      activeItems.includes(itemIdentifier)
                        ? "bg-green-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() => handleItemClick(sectionName, index)}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTable;
