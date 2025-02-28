// Action Types
export const FETCH_ADDRESSES_REQUEST = "FETCH_ADDRESSES_REQUEST";
export const FETCH_ADDRESSES_SUCCESS = "FETCH_ADDRESSES_SUCCESS";
export const FETCH_ADDRESSES_FAILURE = "FETCH_ADDRESSES_FAILURE";

export const ADD_ADDRESS_REQUEST = "ADD_ADDRESS_REQUEST";
export const ADD_ADDRESS_SUCCESS = "ADD_ADDRESS_SUCCESS";
export const ADD_ADDRESS_FAILURE = "ADD_ADDRESS_FAILURE";

export const UPDATE_ADDRESS_REQUEST = "UPDATE_ADDRESS_REQUEST";
export const UPDATE_ADDRESS_SUCCESS = "UPDATE_ADDRESS_SUCCESS";
export const UPDATE_ADDRESS_FAILURE = "UPDATE_ADDRESS_FAILURE";

export const DELETE_ADDRESS_REQUEST = "DELETE_ADDRESS_REQUEST";
export const DELETE_ADDRESS_SUCCESS = "DELETE_ADDRESS_SUCCESS";
export const DELETE_ADDRESS_FAILURE = "DELETE_ADDRESS_FAILURE";

// Action Creators
export const fetchAddressesRequest = () => ({ type: FETCH_ADDRESSES_REQUEST });
export const fetchAddressesSuccess = (addresses) => ({
  type: FETCH_ADDRESSES_SUCCESS,
  payload: addresses,
});
export const fetchAddressesFailure = (error) => ({
  type: FETCH_ADDRESSES_FAILURE,
  payload: error,
});

export const addAddressRequest = (newAddress) => ({
  type: ADD_ADDRESS_REQUEST,
  payload: newAddress,
});
export const addAddressSuccess = (address) => ({
  type: ADD_ADDRESS_SUCCESS,
  payload: address,
});
export const addAddressFailure = (error) => ({
  type: ADD_ADDRESS_FAILURE,
  payload: error,
});

export const updateAddressRequest = (addressId, updatedAddress) => ({
  type: UPDATE_ADDRESS_REQUEST,
  payload: { addressId, updatedAddress },
});
export const updateAddressSuccess = (updatedAddress) => ({
  type: UPDATE_ADDRESS_SUCCESS,
  payload: updatedAddress,
});
export const updateAddressFailure = (error) => ({
  type: UPDATE_ADDRESS_FAILURE,
  payload: error,
});

export const deleteAddressRequest = (addressId) => ({
  type: DELETE_ADDRESS_REQUEST,
  payload: addressId,
});
export const deleteAddressSuccess = (addressId) => ({
  type: DELETE_ADDRESS_SUCCESS,
  payload: addressId,
});
export const deleteAddressFailure = (error) => ({
  type: DELETE_ADDRESS_FAILURE,
  payload: error,
});
