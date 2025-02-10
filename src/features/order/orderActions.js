export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';
export const GET_SEARCH_ORDER = 'GET_SEARCH_ORDER';
export const SET_SELECTED_ORDER = 'SET_SELECTED_ORDER';

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

export const searchQueryOrder = (searchOrder) => ({
  type: GET_SEARCH_ORDER,
  payload: searchOrder,
});

export const setSelectedOrder = (selectedOrder) => ({
  type: SET_SELECTED_ORDER,
  payload: selectedOrder,
});
