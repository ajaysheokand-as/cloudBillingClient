import { Routes, Route } from "react-router-dom";
import "./App.css";
import AddProduct from "./components/AddProduct";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import OrderHistory from "./components/OrderHistory";
import Login from "./components/Login&Register/Login";
import Register from "./components/Login&Register/Register";
import Expensises from "./components/Expensises";
import Categories from "./components/Categories";
import AdminPanel from "./components/Admin/AdminPanel";
import Products from "./components/Products";
import Profile from "./components/Profile";
import CustomTable from "./components/CustomTable";
import Structure from "./components/Structure";
import Process from "./components/Process";
import RequireAuth from "./components/authentication/PrivateRoute";
import BillView from "./components/BillView";
import ForgotPassword from "./components/Login&Register/ForgotPassword";
import ResetPasswordPage from "./components/Login&Register/ResetPasswordPage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SuperAdminTable from "./components/Tables/SuperAdminTable";


function App() {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage/>} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/add-product"
          element={
            <RequireAuth>
              <AddProduct />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <OrderHistory />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            // <RequireAuth>
              <AdminPanel />
            // </RequireAuth>
          }
        />
        <Route
          path="/expensises"
          element={
            <RequireAuth>
              <Expensises />
            </RequireAuth>
          }
        />
        <Route
          path="/categories"
          element={
            <RequireAuth>
              <Categories />
            </RequireAuth>
          }
        />
        <Route
          path="/products"
          element={
            <RequireAuth>
              <Products />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/table"
          element={
            <RequireAuth>
              <CustomTable />
            </RequireAuth>
          }
        />
        <Route
          path="/process"
          element={
            <RequireAuth>
              <Process />
            </RequireAuth>
          }
        />
        <Route
          path="/structure"
          element={
            <RequireAuth>
              <Structure />
            </RequireAuth>
          }
        />
        <Route 
        path="/superadmin"
        element={
          // <RequireAuth>
            <SuperAdminTable/>
          // {/* </RequireAuth> */}
        }
        />  
        <Route path="/bill/:orderId" element={<BillView />} />
      </Routes>
    </>
  );
}

export default App;
