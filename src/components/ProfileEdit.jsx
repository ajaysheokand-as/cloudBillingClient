import React from 'react';

const ProfileEdit = ({ isOpen, onClose, onSubmit, adminDetails, handleInputChange, onImageChange, isSubmitting }) => {
   return (
      <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center overflow-auto`}>
         <div className="absolute inset-0 bg-gray-600 bg-opacity-50"></div>
         <div className="relative bg-white px-8 py-2 rounded-lg shadow-lg z-50 max-w-lg w-full overflow-auto max-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-teal-600 font-serif text-center">Edit Admin Details</h2>
            <form onSubmit={onSubmit}>
               <div className="flex flex-wrap -mx-4">
                  <div className="w-full md:w-1/2 px-4 mb-4">
                     <label className="block text-gray-700 font-semibold font-serif mb-2">Rastaurant's Name</label>
                     <input
                        type="text"
                        name="name"
                        value={adminDetails.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-4">
                     <label className="block text-gray-700 font-semibold font-serif mb-2">Address</label>
                     <input
                        type="text"
                        name="address"
                        value={adminDetails.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-4">
                     <label className="block text-gray-700 font-semibold font-serif mb-2">Name</label>
                     <input
                        type="text"
                        name="owner"
                        value={adminDetails.owner}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                  </div>
                  <div className="w-full md:w-1/2 px-4 mb-4">
                     <label className="block text-gray-700 font-semibold font-serif mb-2">Mobile</label>
                     <input
                        type="text"
                        name="mobile"
                        value={adminDetails.mobile}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                  </div>
                  <div className="w-full md:w-1/2 px-4">
                     <label className="block text-gray-700 font-semibold font-serif mb-2">Email</label>
                     <input
                        type="email"
                        name="email"
                        value={adminDetails.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                  </div>

                  <div className="w-full md:w-1/2 px-4">
                     <label className="block text-gray-700 font-semibold font-serif mb-2">Upload QR Code</label>
                     <input
                        type="file"
                        name="qrCodeImageUrl"
                        onChange={onImageChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                  </div>

                  <div className="w-full px-4">
                     <h3 className="text-center text-xl my-2 text-teal-700 font-semibold font-serif">Opening Hours 🕜</h3>
                     <div className="flex flex-wrap -mx-4">
                        <div className="w-full md:w-1/2 px-4 mb-4">
                           <label className="block text-gray-700 font-semibold font-serif mb-2">Monday-Friday</label>
                           <input
                              type="text"
                              name="openingHours.mondayFriday"
                              value={adminDetails.openingHours?.mondayFriday}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                           />
                        </div>
                        <div className="w-full md:w-1/2 px-4">
                           <label className="block text-gray-700 font-semibold font-serif mb-2">Saturday-Sunday</label>
                           <input
                              type="text"
                              name="openingHours.saturdaySunday"
                              value={adminDetails.openingHours?.saturdaySunday}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-around items-center w-full">
                     <div className="w-full md:w-1/2 px-4 mb-4">
                        <label className="block text-gray-700 font-semibold font-serif mb-2">UPI ID</label>
                        <input
                           type="text"
                           name="upiId"
                           value={adminDetails.upiId}
                           onChange={handleInputChange}
                           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                     </div>
                  </div>




               </div>
               <div className="flex justify-end mt-4">
                  <button
                     type="button"
                     onClick={onClose}
                     className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="bg-teal-500 text-white px-4 py-2 rounded-lg"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Processing...' : 'Save'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ProfileEdit;
