import {
  FETCH_DELIVERY_BOYS_REQUEST,
  FETCH_DELIVERY_BOYS_SUCCESS,
  FETCH_DELIVERY_BOYS_FAILURE,
  ADD_DELIVERY_BOY_REQUEST,
  ADD_DELIVERY_BOY_SUCCESS,
  ADD_DELIVERY_BOY_FAILURE,
  UPDATE_DELIVERY_BOY_REQUEST,
  UPDATE_DELIVERY_BOY_SUCCESS,
  UPDATE_DELIVERY_BOY_FAILURE,
  DELETE_DELIVERY_BOY_REQUEST,
  DELETE_DELIVERY_BOY_SUCCESS,
  DELETE_DELIVERY_BOY_FAILURE,
} from "./deliveryBoyActions";

const initialState = {
  deliveryBoys: [],
  loading: false,
  error: null,
};

const deliveryBoyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DELIVERY_BOYS_REQUEST:
    case ADD_DELIVERY_BOY_REQUEST:
    case UPDATE_DELIVERY_BOY_REQUEST:
    case DELETE_DELIVERY_BOY_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_DELIVERY_BOYS_SUCCESS:
      return { ...state, loading: false, deliveryBoys: action.payload };

    case ADD_DELIVERY_BOY_SUCCESS:
      return {
        ...state,
        loading: false,
        deliveryBoys: [...state.deliveryBoys, action.payload],
      };

    case UPDATE_DELIVERY_BOY_SUCCESS:
      return {
        ...state,
        loading: false,
        deliveryBoys: state.deliveryBoys.map((boy) =>
          boy.id === action.payload.id ? action.payload : boy
        ),
      };

    case DELETE_DELIVERY_BOY_SUCCESS:
      return {
        ...state,
        loading: false,
        deliveryBoys: state.deliveryBoys.filter((boy) => boy.id !== action.payload),
      };

    case FETCH_DELIVERY_BOYS_FAILURE:
    case ADD_DELIVERY_BOY_FAILURE:
    case UPDATE_DELIVERY_BOY_FAILURE:
    case DELETE_DELIVERY_BOY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default deliveryBoyReducer;
