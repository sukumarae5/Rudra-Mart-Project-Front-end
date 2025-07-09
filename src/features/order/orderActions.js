// Action Types
export const FETCH_ORDERS_REQUEST = "FETCH_ORDERS_REQUEST";
export const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS";
export const FETCH_ORDERS_FAILURE = "FETCH_ORDERS_FAILURE";

export const FETCH_USER_ORDER_REQUEST="FETCH_USER_ORDER_REQUEST";
export const FETCH_USER_ORDER_SUCCESS="FETCH_USER_ORDER_SUCCESS";
export const FETCH_USER_ORDER_FAILURE="FETCH_USER_ORDER_FAILUER";

export const FETCH_ALL_ORDER_REQUEST = "FETCH_ALL_ORDER_REQUEST";
export const FETCH_ALL_ORDER_SUCCESS = "FETCH_ALL_ORDER_SUCCESS";
export const FETCH_ALL_ORDER_FAILURE = "FETCH_ALL_ORDER_FAILURE";   

// Update
export const UPDATE_ORDER_REQUEST = "UPDATE_ORDER_REQUEST";
export const UPDATE_ORDER_SUCCESS = "UPDATE_ORDER_SUCCESS";
export const UPDATE_ORDER_FAILURE = "UPDATE_ORDER_FAILURE";

// Delete
export const DELETE_ORDER_REQUEST = "DELETE_ORDER_REQUEST";
export const DELETE_ORDER_SUCCESS = "DELETE_ORDER_SUCCESS";
export const DELETE_ORDER_FAILURE = "DELETE_ORDER_FAILURE";

// Action Creators
export const fetchOrdersRequest = () => ({
  type: FETCH_ORDERS_REQUEST,
});

export const fetchOrdersSuccess = (orders) => ({
  type: FETCH_ORDERS_SUCCESS,
  payload: orders,
});
export const fetchOrdersFailure = (error) => ({
  type: FETCH_ORDERS_FAILURE,
  payload: error,
});
 export const fetchUserOrderRequst=()=>({
  type:FETCH_USER_ORDER_REQUEST
  
 })
 export const fetchUserOrderSuccess=(userorder)=>({
  type:FETCH_USER_ORDER_SUCCESS,
  payload:userorder
 })
 export const fetchUserOrderFailure=(error)=>({
  type:FETCH_USER_ORDER_FAILURE,
  payload:error
 })
 export const fetchAllOrderRequest = () => ({
  type: FETCH_ALL_ORDER_REQUEST,
});

export const fetchAllOrderSuccess = (allOrders) => ({
  type: FETCH_ALL_ORDER_SUCCESS,
  payload: allOrders,
});

export const fetchAllOrderFailure = (error) => ({
  type: FETCH_ALL_ORDER_FAILURE,
  payload: error,
});

// Update
export const updateOrderRequest = (orderId, status) => ({
  type: UPDATE_ORDER_REQUEST,
  payload: { orderId, status },
});

export const updateOrderSuccess = (updatedOrder) => ({
  type: UPDATE_ORDER_SUCCESS,
  payload: updatedOrder,
});

export const updateOrderFailure = (error) => ({
  type: UPDATE_ORDER_FAILURE,
  payload: error,
});

// Delete
export const deleteOrderRequest = (orderId) => ({
  type: DELETE_ORDER_REQUEST,
  payload: orderId,
});

export const deleteOrderSuccess = (orderId) => ({
  type: DELETE_ORDER_SUCCESS,
  payload: orderId,
});

export const deleteOrderFailure = (error) => ({
  type: DELETE_ORDER_FAILURE,
  payload: error,
});
