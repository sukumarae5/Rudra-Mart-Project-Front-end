import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrderRequst } from '../../features/order/orderActions';
import CircularProgress from '@mui/material/CircularProgress'; // Import spinner
import Box from '@mui/material/Box';

const UserCancellationProductpage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserOrderRequst());
    }, [dispatch]);

    const { userOrders = [], loading = false, error = null } = useSelector(
        (state) => state.orders || {}
    );

    const ordersdata = userOrders.orders || [];
    const cancelledOrders = ordersdata.filter((product) => product.status === "Cancelled");

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Cancelled Products</h2>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : cancelledOrders.length > 0 ? (
                cancelledOrders.map((order, index) => (
                    <div key={index} className="border rounded-md p-4 mb-4 shadow">
                        <img
                            src={order.image_url}
                            alt={order.product_name}
                            className="w-32 h-32 object-cover rounded mb-2"
                        />
                        <h3 className="text-lg font-semibold">{order.product_name}</h3>
                        <p className="text-gray-600">{order.product_description}</p>
                        <p className="text-sm text-red-600 font-bold mt-2">Status: {order.status}</p>
                        <p className="text-sm text-gray-500">Cancelled on: {new Date(order.order_created_at).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p>No cancelled orders found.</p>
            )}
        </div>
    );
}

export default UserCancellationProductpage;
