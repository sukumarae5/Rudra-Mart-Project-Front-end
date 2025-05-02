import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrderRequst } from "../../features/order/orderActions";
import { Box, CircularProgress } from "@mui/material";

const UserOrderHistory = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrderRequst());
  }, [dispatch]);

  const { userOrders = [], loading = false, error = null } = useSelector(
    (state) => state.orders || {}
  );

  const userorderdata = userOrders.orders;
  console.log(userorderdata);

  const allStatuses = [
    "Pending",
    "Processing",
    "Confirmed",
    "Shipped",
    "Delivered",
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">User Order History</h2>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {userorderdata ? (
          userOrders.orders.map((order) => {
            const currentStatusIndex = allStatuses.indexOf(order.status);
            const isSpecialStatus = order.status === "Cancelled" || order.status === "Returned";

            return (
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
                      order.status === "Cancelled"
                        ? "text-red-500"
                        : order.status === "Returned"
                        ? "text-red-500"
                        : order.status === "Delivered"
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    Status: {order.status}
                  </p>

                  {/* Order Status Timeline */}
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-md font-semibold mb-2 text-gray-700">Order Status History</h4>
                    <div className="relative ml-6 border-l-2 border-gray-300">
                      {allStatuses.map((status, index) => {
                        const isCompleted = index < currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        const isUpcoming = index > currentStatusIndex;
                        const dotColor = isCompleted
                          ? "bg-green-500"
                          : isCurrent
                          ? "bg-orange-500"
                          : "bg-gray-300";
                        const textColor = isCompleted
                          ? "text-green-700"
                          : isCurrent
                          ? "text-orange-700"
                          : "text-gray-400";

                        // Estimated date for upcoming steps
                        const estimatedDate = new Date(order.order_updated_at);
                        estimatedDate.setDate(estimatedDate.getDate() + (index - currentStatusIndex));

                        return (
                          <div key={status} className="relative pl-6 mb-6">
                            <div
                              className={`absolute -left-3 top-1 ${dotColor} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs`}
                            >
                              {index + 1}
                            </div>
                            <p className={`font-semibold ${textColor}`}>{status}</p>
                            <p className={`text-sm ${textColor}`}>
                              {isCompleted || isCurrent
                                ? new Date(order.order_updated_at).toLocaleString()
                                : `Expected: ${estimatedDate.toLocaleDateString()}`}
                            </p>

                            {/* Connector line */}
                            {index !== allStatuses.length - 1 && (
                              <div className="absolute left-2 top-6 h-6 border-l-2 border-dotted border-gray-400" />
                            )}
                          </div>
                        );
                      })}

                      {/* Handle Cancelled or Returned separately */}
                      {isSpecialStatus && (
                        <div className="relative pl-6 mb-6">
                          <div className="absolute -left-3 top-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            ❌
                          </div>
                          <p className="font-semibold text-red-600">{order.status}</p>
                          <p className="text-sm text-red-500">
                            {new Date(order.order_updated_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          !loading && <p className="text-center text-gray-700">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default UserOrderHistory;
