export const FETCH_DELIVERIES_REQUEST = "FETCH_DELIVERIES_REQUEST";
export const FETCH_DELIVERIES_SUCCESS = "FETCH_DELIVERIES_SUCCESS";
export const FETCH_DELIVERIES_FAILURE = "FETCH_DELIVERIES_FAILURE";

export const CREATE_DELIVERY_REQUEST = "CREATE_DELIVERY_REQUEST";
export const CREATE_DELIVERY_SUCCESS = "CREATE_DELIVERY_SUCCESS";
export const CREATE_DELIVERY_FAILURE = "CREATE_DELIVERY_FAILURE";

export const UPDATE_DELIVERY_REQUEST = "UPDATE_DELIVERY_REQUEST";
export const UPDATE_DELIVERY_SUCCESS = "UPDATE_DELIVERY_SUCCESS";
export const UPDATE_DELIVERY_FAILURE = "UPDATE_DELIVERY_FAILURE";

export const DELETE_DELIVERY_REQUEST = "DELETE_DELIVERY_REQUEST";
export const DELETE_DELIVERY_SUCCESS = "DELETE_DELIVERY_SUCCESS";
export const DELETE_DELIVERY_FAILURE = "DELETE_DELIVERY_FAILURE";

// Action Creators
export const fetchDeliveriesRequest = (status = "All") => ({
  type: FETCH_DELIVERIES_REQUEST,
  payload: status,
});

export const fetchDeliveriesSuccess = (data) => ({
  type: FETCH_DELIVERIES_SUCCESS,
  payload: data,
});

export const fetchDeliveriesFailure = (error) => ({
  type: FETCH_DELIVERIES_FAILURE,
  payload: error,
});

export const createDeliveryRequest = (data) => ({
  type: CREATE_DELIVERY_REQUEST,
  payload: data,
});

export const createDeliverySuccess = (data) => ({
  type: CREATE_DELIVERY_SUCCESS,
  payload: data,
});

export const createDeliveryFailure = (error) => ({
  type: CREATE_DELIVERY_FAILURE,
  payload: error,
});

export const updateDeliveryRequest = (id, data) => ({
  type: UPDATE_DELIVERY_REQUEST,
  payload: { id, data },
});


export const updateDeliverySuccess = (data) => ({
  type: UPDATE_DELIVERY_SUCCESS,
  payload: data,
});

export const updateDeliveryFailure = (error) => ({
  type: UPDATE_DELIVERY_FAILURE,
  payload: error,
});

export const deleteDeliveryRequest = (id) => ({
  type: DELETE_DELIVERY_REQUEST,
  payload: id,
});

export const deleteDeliverySuccess = (id) => ({
  type: DELETE_DELIVERY_SUCCESS,
  payload: id,
});

export const deleteDeliveryFailure = (error) => ({
  type: DELETE_DELIVERY_FAILURE,
  payload: error,
});
