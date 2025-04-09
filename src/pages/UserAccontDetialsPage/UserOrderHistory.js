import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrderRequst } from "../../features/order/orderActions";
import { Box, CircularProgress } from "@mui/material";

const UserOrderHistory = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    {
     dispatch(fetchUserOrderRequst());
   }
 }, [dispatch]);

  const { userOrders = [], loading = false, error = null } = useSelector(
    (state) => state.orders || {}
  );
  const userorderdata=userOrders.orders
  // Remove duplicate orders by order_id
   
  useEffect(() => {
     {
      dispatch(fetchUserOrderRequst());
    }
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">User Order History</h2>

      {loading && <p className="text-center text-gray-600">
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                          <CircularProgress />
                      </Box></p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {userorderdata ? (
          userOrders. orders.map((order) => (
            <div key={order.order_id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={order.image_url}
                alt={order.product_name}
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{order.product_name}</h3>
                <p className="text-gray-500 text-sm">{order.category_name}</p>
                <p className="text-gray-700 text-sm mt-1">{order.product_description}</p>
                <p className="text-gray-800 font-medium mt-2">Price: ₹{order.product_price}</p>
                <p className="text-gray-600 text-sm">
                  Order Date: {new Date(order.order_created_at).toLocaleString()}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Address:</span> {order.street_address},{" "}
                    {order.city}, {order.state} - {order.postal_code}
                  </p>
                </div>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    order.status === "Pending" ? "text-yellow-500" : "text-green-500"
                  }`}
                >
                  Status: {order.status} 
                </p>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-gray-700">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default UserOrderHistory;
