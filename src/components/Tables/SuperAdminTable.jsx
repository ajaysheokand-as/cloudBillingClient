import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../../utils/Const";

const SuperAdminTable = () => {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [tableData, setTableData] = useState();
  const [currentpage, setCurrenPage] = useState(1);

  const itemperPage = 10;
  const totalpage = tableData?.length / itemperPage;

  const userData = async () => {
    const mainData = await axios.get("https://dummyjson.com/users");
    setTableData(mainData.data.users);
    console.log(mainData.data.users);
  };

  const firstIndex = (currentpage - 1) * itemperPage;
  const lastIndex = firstIndex + itemperPage;

  useEffect(() => {
    userData();
  }, []);

  const numberOfBtn = [];

  for (let i = 1; i <= totalpage; i++) {
    numberOfBtn.push(i);
  }

  const handler1 = () => {
    setCurrenPage(currentpage - 1);
  }

  const handler2 = () => {
    setCurrenPage(currentpage + 1);
  }

  const mainhandler = (e) => {
      setCurrenPage(e);
  }



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      if (decodedToken.user) {
        const userId = decodedToken.user.id;
        console.log("Extracted UserId:", userId);

        setUserId(userId);
        if (userId) {
          axios
            .get(`${baseUrl}superadmin/${userId}`)
            .then((response) => {
              console.log("API Response:", response);
              setUsers(response.data); // Assuming response.data is an array of users
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        } else {
          console.error("Error: userId is missing in the decoded token");
        }
      } else {
        console.error("Error: user object is missing in the decoded token");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold text-center mb-8">Super Admin Page</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Mobile Number</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Account Status</th>
            </tr>
          </thead>
          <tbody>
            {/* {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="py-3 px-6 border-b border-gray-200">{user.owner || 'N/A'}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{user.mobile || 'N/A'}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{user.address || 'N/A'}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{user.type || 'N/A'}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{user.account || 'Unknown'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center">No data available</td>
              </tr>
            )} */}
            {tableData?.slice(firstIndex, lastIndex).map((item, index) => {
              return (
                <tr className="border">
                  <td className="py-3 px-6 text-left">{item.firstName}</td>
                  <td className="py-3 px-6 text-left">{item.phone}</td>
                  <td className="py-3 px-6 text-left">
                    {item.address.address} [{item.address.city}]
                  </td>
                  <td className="py-3 px-6 text-left">{item.role}</td>
                  <td>{item.bank.cardNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
            <div  className="flex justify-center items-center p-4 gap-2">

                <button disabled={currentpage <= 1} onClick={() => handler1()} className="px-6 py-2 bg-blue-500 text-white text-xs font-bold rounded">PREV</button>

                {numberOfBtn?.map((item, index) => {
                  return(
                    <button onClick={() => mainhandler(item)} className={`px-6 py-2 bg-blue-500 text-white text-xs font-sembiled rounded ${currentpage == item ? "bg-blue-300" : ""}`}>{item}</button>
                  )
                })}

                <button disabled={currentpage >= 3} onClick={() => handler2()} className="px-6 py-2 bg-blue-500 text-white text-xs font-bold rounded">NEXT</button>


        </div>
      </div>
    </div>
  );
};

export default SuperAdminTable;



// className="bg-blue-600 px-8 py-2 rounded-md m-2 text-white font-bold outline-none hover:bg-blue-500"