import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import QrCodeImg from '../assets/images/Qrcode 1.png';
import edit from "../assets/images/update-profile.gif";
import emailIcon from "../assets/images/email.png";
import { baseUrl } from '../utils/Const';
import ProfileEdit from './ProfileEdit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';


const Profile = () => {
   const [isPopupOpen, setIsPopupOpen] = useState(false);
   const [adminDetails, setAdminDetails] = useState({});

   const [userId, setUserId] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [image, setImage] = useState("")

   const handleImageChange = (e) => {
      setImage(e.target.files[0]);
   }

   useEffect(() => {
      AOS.init({
         duration: 1000,
         once: true,
         mirror: false,
      });
   }, []);

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
               axios.get(`${baseUrl}user/${userId}`)
                  .then(response => {
                     setAdminDetails(response.data);
                     console.log("Admin Details:", response.data);
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

   const handleEditClick = () => {
      setIsPopupOpen(true);
   };

   const handleClosePopup = () => {
      setIsPopupOpen(false);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      const keys = name.split('.');
      if (keys.length > 1) {
         setAdminDetails(prevDetails => ({
            ...prevDetails,
            [keys[0]]: {
               ...prevDetails[keys[0]],
               [keys[1]]: value
            }
         }));
      } else {
         setAdminDetails({ ...adminDetails, [name]: value });
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         const token = localStorage.getItem('token');
         if (!token) {
            throw new Error('Token not found. Please log in.');
         }

         let secureUrl = adminDetails.qrCodeImageUrl;

         if (image) {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "cloudBill");

            const cloudinaryResponse = await axios.post(
               "https://api.cloudinary.com/v1_1/drpwwh9rm/image/upload",
               formData
            );

            const result = cloudinaryResponse.data;
            if (!result.secure_url) {
               throw new Error('Image upload failed');
            }
            secureUrl = result.secure_url;
         }

         const updatedAdminDetails = {
            ...adminDetails,
            qrCodeImageUrl: secureUrl,
         };

         const response = await axios.put(
            `${baseUrl}user/${userId}`,
            updatedAdminDetails,
            { headers: { Authorization: `Bearer ${token}` } }
         );

         setAdminDetails(updatedAdminDetails);
         setIsPopupOpen(false);
         toast.success('User updated successfully!');
         console.log('User updated successfully:', response.data);

      } catch (error) {
         console.error('Error updating user data:', error);
         toast.error('Error updating user data');
      }
      setIsSubmitting(false);
   };


   return (
      <div className="container-fluid bg-gray-100 py-4 mb-6">
         <div className={`bg-white rounded-lg shadow-md mb-6 pb-2 transition ${isPopupOpen ? 'blur' : ''}`}>
            <div className='flex justify-end items-center pt-3 mr-5'>
               <button className='text-2xl font-bold text-gray-700' onClick={handleEditClick} >Edit</button>
               <img
                  className="cursor-pointer ml-2"
                  src={edit}
                  alt="update icon"
                  width="34px"
                  title="Update Your Profile"
                  onClick={handleEditClick}
               />
            </div>

            <div className="flex max-md:block justify-around">

               <div className="flex max-md:justify-around max-sm:block mb-4 md:mb-0"
                  data-aos="fade-right">

                  <div className=" max-sm:grid mt-2 justify-center">
                     <div className='flex items-center'>
                        <h2 className="text-3xl font-semibold text-teal-600 font-serif">{adminDetails.name}</h2>
                     </div>
                     <p className="text-gray-800 font-serif font-bold flex items-center pt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32" className="mr-2">
                           <path fill="#e3e2e1" d="M54.01 58.74C54.01 61.65 44.15 64 32 64c-12.15 0-22.01-2.35-22.01-5.26 0-2.6 7.9-4.74 18.26-5.18h7.5c10.37.44 18.26 2.58 18.26 5.18z"></path>
                           <path fill="#e82327" d="M32 0C20.7 0 11.54 9.15 11.54 20.45 11.54 31.75 32 58.74 32 58.74s20.45-26.99 20.45-38.29S43.3 0 32 0zm0 33.99c-7.48 0-13.54-6.06-13.54-13.54S24.52 6.91 32 6.91c7.48 0 13.54 6.06 13.54 13.54S39.48 33.99 32 33.99z"></path>
                        </svg>
                        {adminDetails.address}
                     </p>
                     <p className="text-gray-800 font-serif font-bold flex items-center pt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64" className="mr-2">
                           <path fill="#76ABC4" d="M64 32c0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32"></path>
                           <path fill="#638DA0" d="M43.17 50a1.04 1.04 0 0 1-.336-.052c-.228-.075-.526-.155-.889-.256-4.704-1.302-19.016-5.263-25.903-26.629a1.081 1.081 0 0 1-.021-.589c.035-.14.903-3.5 6.677-4.458a1.064 1.064 0 0 1 .635.085c.211.096 5.212 2.448 5.629 7.242.029.306-.076.611-.283.836-1.639 1.776-3.064 3.96-2.988 4.582.131 1.106 3.603 6.939 9.82 9.979.927-.147 3.076-1.563 4.632-2.892a1.08 1.08 0 0 1 .7-.263c.088 0 .177.011.264.034 4.932 1.196 6.71 4.58 6.784 4.724.105.205.142.441.105.668-.831 5.224-4.231 6.825-4.375 6.891a1.087 1.087 0 0 1-.451.098"></path>
                           <path fill="#FFFFFE" d="M28.962 23.343c-.417-4.794-5.418-7.146-5.629-7.242a1.063 1.063 0 0 0-.635-.085c-5.774.958-6.642 4.318-6.677 4.458-.048.196-.04.399.021.589 6.887 21.366 21.199 25.327 25.903 26.629.363.101.661.181.889.256a1.087 1.087 0 0 0 .787-.046c.144-.066 3.544-1.667 4.375-6.891.037-.227 0-.463-.105-.668-.074-.144-1.852-3.528-6.784-4.724a1.066 1.066 0 0 0-.964.229c-1.556 1.329-3.705 2.745-4.632 2.891-6.217-3.039-9.689-8.872-9.82-9.978-.076-.622 1.349-2.806 2.988-4.582.207-.225.312-.53.283-.836"></path>
                        </svg>
                        {adminDetails.mobile}
                     </p>
                     <p className="text-gray-800 font-serif font-bold pt-2 flex">
                        <img src={emailIcon} alt="email" width="30px" className='mr-2' />
                        {adminDetails.email}
                     </p>
                  </div>

               </div>

               <div className="mb-4 max-md:grid justify-center md:mb-0" data-aos="fade-left">
                  <div className="mb-6">
                     <h3 className="text-2xl text-center font-semibold text-teal-600 font-serif">Opening Hours</h3>
                     <p className="mt-2 text-gray-600 font-serif">Monday - Friday: {adminDetails.openingHours?.mondayFriday}</p>
                     <p className="text-gray-600 font-serif">Saturday - Sunday: {adminDetails.openingHours?.saturdaySunday}</p>
                  </div>
               </div>

            </div>

            <div className="flex justify-around items-center max-sm:block mt-4">
               <div className="admin my-4 mr-32 ml-4 md:mb-0" data-aos="flip-right">
                  <div className="flex items-center max-sm:justify-center">
                     <h1 className="mb-2 text-teal-600 font-bold text-2xl font-serif">Admin</h1>
                  </div>

                  <div className=' max-sm:grid justify-center'>
                     <h1 className="font-serif">Name : <span className="font-bold">{adminDetails.owner}</span></h1>
                     <h1 className="font-serif">Mobile : <span className="font-bold">{adminDetails.mobile}</span></h1>
                     <h1 className="font-serif">Mail :<span className="font-bold"> {adminDetails.email}</span></h1>
                  </div>
               </div>

               <div data-aos="flip-up " className='mr-40' >
                  <h1 className="mb-3 text-teal-600 font-bold text-2xl font-serif">UPI ID</h1>
                  <h1 className="font-serif">
                     {adminDetails.upiId}
                  </h1>
               </div>


               {/* <div className="mb-4 md:mb-0 max-sm:flex justify-center" data-aos="flip-left">
                  <img
                     src={adminDetails.qrCodeImageUrl || QrCodeImg}
                     alt="QR Code"
                     width="150px"
                     className="mt-2"
                  />
               </div> */}

            </div>

         </div>

         <div>
            <ProfileEdit
               isOpen={isPopupOpen}
               onClose={handleClosePopup}
               onSubmit={handleSubmit}
               adminDetails={adminDetails}
               handleInputChange={handleInputChange}
               onImageChange={handleImageChange}
               isSubmitting={isSubmitting}
            />
            <ToastContainer />
         </div>

      </div>
   );
};

export default Profile;
