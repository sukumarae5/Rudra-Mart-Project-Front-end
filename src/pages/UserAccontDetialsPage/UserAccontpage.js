import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

const UserAccountPage = () => {
  const navigate = useNavigate();
  const { data = {} } = useSelector((state) => state.users);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Email Display */}
      <div className="text-right">
        <p>
          <span className="text-purple-500 font-medium">Your Email:</span>{" "}
          {data.email}
        </p>
      </div>
      <hr className="my-4" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Navigation */}
        <div className="lg:w-1/4 bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Manage My Account
          </h2>
          <ul className="text-gray-600 space-y-2">
            <li
              className="cursor-pointer hover:text-purple-600"
              onClick={() => navigate("userprofile")}
            >
              My Profile
            </li>
            <li>Address Book</li>
            <li>My Payment Options</li>
            
          </ul>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
            My Orders
          </h2>
          <ul className="text-gray-600 space-y-2">
          <li className="cursor-pointer hover:text-purple-600"
            onClick={()=>navigate("usercheckoutpage")}>Order History</li>
            <li>My Returns</li>
            <li>My Cancellations</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
            My Wishlist
          </h2>
          <ul className="text-gray-600">
            <li className="cursor-pointer hover:text-purple-600"
            onClick={()=>navigate()}>Wishlisted Products</li>
          </ul>
        </div>

        
        <div className="flex-1 bg-gray-100 p-6 shadow rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserAccountPage;
