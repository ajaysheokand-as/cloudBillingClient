import React, { useState, useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import ItemList from './ItemList';
import BillingDetails from './BillingDetails';
import BillModal from './BillModal';
import { ItemsContext } from '../context/ItemsContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utils/Const';
import { jwtDecode } from 'jwt-decode';

function HomePage() {
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const section = queryParams.get('section');
   const index = queryParams.get('index');
   const orderId = queryParams.get('orderId');

   const [userId, setUserId] = useState('');

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         const decodedToken = jwtDecode(token);
         if (decodedToken.user) {
            setUserId(decodedToken.user.id);
         }
      }
   }, []);

   const [selectedCategory, setSelectedCategory] = useState('All');
   const [searchQuery, setSearchQuery] = useState('');
   const [orderItems, setOrderItems] = useState([]);
   const [billingDetails, setBillingDetails] = useState({
      name: '',
      mobile: '',
   });
   const [billSlip, setBillSlip] = useState('');
   const [isBillModalOpen, setIsBillModalOpen] = useState(false);
   const { items, setItems } = useContext(ItemsContext);
   useEffect(() => {
      if (orderId) {
         fetchOrderDetails(orderId);
      }
   }, [orderId]);

   const fetchOrderDetails = async (orderId) => {
      try {
         const response = await axios.get(`${baseUrl}billss/${orderId}`);
         const order = response?.data;

         setBillingDetails({
            name: order?.name,
            mobile: order?.mobile,
         });
         setOrderItems(order?.orderItems || []);
      } catch (error) {
         console.error('Error fetching order details:', error);
      }
   };

   const removeFromOrder = (itemToRemove) => {
      setOrderItems(orderItems.filter((item) => item !== itemToRemove));
   };

   const allItems = Object.values(items).flat();


   const filteredItems = allItems.filter(
      (item) =>
         item.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
         (selectedCategory === 'All' || item.category === selectedCategory)
   );

   const addToOrder = (item) => {
      const existingItem = orderItems.find(
         (orderItem) => orderItem.productName === item.productName
      );
      if (existingItem) {
         setOrderItems(
            orderItems.map((orderItem) =>
               orderItem.productName === item.productName
                  ? { ...orderItem, quantity: orderItem.quantity + 1 }
                  : orderItem
            )
         );
      } else {
         setOrderItems([...orderItems, { ...item, quantity: 1 }]);
      }
   };
   const addToOrderincrease = (item) => {
      setOrderItems((prevOrderItems) =>
         prevOrderItems.map((orderItem) => {
            if (orderItem.productName === item.productName) {
               return {
                  ...orderItem,
                  quantity: orderItem.quantity + 1,
               };
            }
            return orderItem;
         })
      );
   };

   const addToOrderdecrease = (item) => {
      setOrderItems((prevOrderItems) =>
         prevOrderItems.map((orderItem) => {
            if (orderItem.productName === item.productName) {
               return {
                  ...orderItem,
                  quantity: Math.max(orderItem.quantity - 1, 1),
               };
            }
            return orderItem;
         })
      );
   };


   const calculateTotal = () => {
      return orderItems.reduce(
         (total, item) => total + item.price * item.quantity,
         0
      );
   };

   const handleBillingChange = (e) => {
      const { name, value } = e.target;
      setBillingDetails({ ...billingDetails, [name]: value });
   };

   const generateBillSlip = () => {
      let billText = `Bill Details\n`;
      billText += `Name: ${billingDetails.name}\n`;
      billText += `Mobile: ${billingDetails.mobile}\n`;
      billText += `\nOrder Summary\n`;
      orderItems.forEach((item) => {
         billText += `${item.productName} x ${item.quantity} = ₹${item.price * item.quantity
            }\n`;
      });
      billText += `\nTotal: ₹${calculateTotal()}\n`;

      setBillSlip(billText);
      setIsBillModalOpen(true);
   };

   const shareOnWhatsApp = () => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(billSlip)}`;
      window.open(whatsappUrl, '_blank');
   };

   const closeModal = () => {
      setIsBillModalOpen(false);
   };
   return (
      <div className="flex flex-col h-screen">
         <main className="flex flex-grow bg-gray-200 p-4">
            <div className="flex flex-col md:flex-row w-full">

               <Sidebar
                  setSelectedCategory={setSelectedCategory}
                  setSearchQuery={setSearchQuery}
               />

               <div className="flex flex-col w-full lg:w-1/2 xl:w-2/3">
                  <SearchBar
                     selectedCategory={selectedCategory}
                     setSelectedCategory={setSelectedCategory}
                     searchQuery={searchQuery}
                     setSearchQuery={setSearchQuery}
                     items={items}
                  />
                  <ItemList filteredItems={filteredItems} addToOrder={addToOrder} />
               </div>
               <BillingDetails
                  section={section}
                  index={index}
                  billingDetails={billingDetails}
                  handleBillingChange={handleBillingChange}
                  orderItems={orderItems}
                  calculateTotal={calculateTotal}
                  generateBillSlip={generateBillSlip}
                  removeFromOrder={removeFromOrder}
                  orderId={orderId}
                  addToOrderincrease={addToOrderincrease}
                  addToOrderdecrease={addToOrderdecrease}
               />
            </div>
         </main>

         {isBillModalOpen && (
            <BillModal
               billingDetails={billingDetails}
               orderItems={orderItems}
               calculateTotal={calculateTotal}
               closeModal={closeModal}
               shareOnWhatsApp={shareOnWhatsApp}
            />
         )}
      </div>
   );
}

export default HomePage;