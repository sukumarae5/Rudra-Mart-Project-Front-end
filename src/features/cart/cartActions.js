// Cart Action Types
export const FETCH_API_CART_DATA_REQUEST = "FETCH_API_CART_DATA_REQUEST";
export const FETCH_API_CART_DATA_SUCCESS = "FETCH_API_CART_DATA_SUCCESS";
export const FETCH_API_CART_DATA_FAILURE = "FETCH_API_CART_DATA_FAILURE";

// Fetch Cart Data Actions
export const fetchApiCartDataRequest = () => ({
  type: FETCH_API_CART_DATA_REQUEST,
});

export const fetchApiCartDataSuccess = (cartData) => ({
  type: FETCH_API_CART_DATA_SUCCESS,
  payload: cartData,
});

export const fetchApiCartDataFailure = (error) => ({
  type: FETCH_API_CART_DATA_FAILURE,
  payload: error,
});
