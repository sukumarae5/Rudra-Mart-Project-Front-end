import {
  FETCH_DELIVERIES_REQUEST,
  FETCH_DELIVERIES_SUCCESS,
  FETCH_DELIVERIES_FAILURE,
  CREATE_DELIVERY_SUCCESS,
  UPDATE_DELIVERY_SUCCESS,
  DELETE_DELIVERY_SUCCESS,
} from "./deliveryActions";

const initialState = {
  deliveries: [],
  loading: false,
  error: null,
};

const deliveryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DELIVERIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DELIVERIES_SUCCESS:
      return { ...state, loading: false, deliveries: action.payload };
    case FETCH_DELIVERIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_DELIVERY_SUCCESS:
      return {
        ...state,
        deliveries: [...state.deliveries, action.payload],
      };

    case UPDATE_DELIVERY_SUCCESS:
      return {
        ...state,
        deliveries: state.deliveries.map((d) =>
          d.delivery_id === action.payload.delivery_id ? { ...d, ...action.payload } : d
        ),
      };

    case DELETE_DELIVERY_SUCCESS:
      return {
        ...state,
        deliveries: state.deliveries.filter((d) => d.delivery_id !== action.payload),
      };

    default:
      return state;
  }
};

export default deliveryReducer;
