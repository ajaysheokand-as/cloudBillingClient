import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { baseUrl } from '../../utils/Const';

const SuperAdminTable = () => {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      if (decodedToken.user) {
        const userId = decodedToken.user.id;
        console.log("Extracted UserId:", userId);

        setUserId(userId);
        if (userId) {
          axios.get(`${baseUrl}superadmin/${userId}`)
            .then(response => {
              console.log("API Response:", response);
              setUsers(response.data);  // Assuming response.data is an array of users
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
            });
        } else {
          console.error('Error: userId is missing in the decoded token');
        }
      } else {
        console.error('Error: user object is missing in the decoded token');
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
            {users.length > 0 ? (
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
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminTable;
