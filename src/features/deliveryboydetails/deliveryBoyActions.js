// Action Types
export const FETCH_DELIVERY_BOYS_REQUEST = "FETCH_DELIVERY_BOYS_REQUEST";
export const FETCH_DELIVERY_BOYS_SUCCESS = "FETCH_DELIVERY_BOYS_SUCCESS";
export const FETCH_DELIVERY_BOYS_FAILURE = "FETCH_DELIVERY_BOYS_FAILURE";

export const ADD_DELIVERY_BOY_REQUEST = "ADD_DELIVERY_BOY_REQUEST";
export const ADD_DELIVERY_BOY_SUCCESS = "ADD_DELIVERY_BOY_SUCCESS";
export const ADD_DELIVERY_BOY_FAILURE = "ADD_DELIVERY_BOY_FAILURE";

export const UPDATE_DELIVERY_BOY_REQUEST = "UPDATE_DELIVERY_BOY_REQUEST";
export const UPDATE_DELIVERY_BOY_SUCCESS = "UPDATE_DELIVERY_BOY_SUCCESS";
export const UPDATE_DELIVERY_BOY_FAILURE = "UPDATE_DELIVERY_BOY_FAILURE";

export const DELETE_DELIVERY_BOY_REQUEST = "DELETE_DELIVERY_BOY_REQUEST";
export const DELETE_DELIVERY_BOY_SUCCESS = "DELETE_DELIVERY_BOY_SUCCESS";
export const DELETE_DELIVERY_BOY_FAILURE = "DELETE_DELIVERY_BOY_FAILURE";

// Action Creators
export const fetchDeliveryBoysRequest = () => ({
  type: FETCH_DELIVERY_BOYS_REQUEST,
});
export const fetchDeliveryBoysSuccess = (data) => ({
  type: FETCH_DELIVERY_BOYS_SUCCESS,
  payload: data,
});
export const fetchDeliveryBoysFailure = (error) => ({
  type: FETCH_DELIVERY_BOYS_FAILURE,
  payload: error,
});

export const addDeliveryBoyRequest = (data) => ({
  type: ADD_DELIVERY_BOY_REQUEST,
  payload: data,
});
export const updateDeliveryBoyRequest = (id, data) => ({
  type: UPDATE_DELIVERY_BOY_REQUEST,
  payload: { id, data },
});
export const deleteDeliveryBoyRequest = (id) => ({
  type: DELETE_DELIVERY_BOY_REQUEST,
  payload: id,
});
