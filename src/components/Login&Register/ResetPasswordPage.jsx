import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../utils/Const';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}reset-password/${token}`, { password })
      .then(() => {
        toast.success('Password has been reset successfully!');
        navigate('/');
      })
      .catch((err) => {
        toast.error('Failed to reset password. Please try again.');
        console.error('Error resetting password:', err);
      });
  };

  return (
    <div className="flex items-center justify-center  mt-5 min-h-screen ">
      <div className="w-4 max-w-sm p-6  rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Reset Your Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <button
            type="submit"
            className="min-w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Reset Password
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
