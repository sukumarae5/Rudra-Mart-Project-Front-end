import { FETCH_USERS_REQUEST } from "../user/userActions";
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_USER_ORDER_REQUEST,
  FETCH_USER_ORDER_SUCCESS,
  FETCH_USER_ORDER_FAILURE,
  FETCH_ALL_ORDER_REQUEST,
  FETCH_ALL_ORDER_SUCCESS,
  FETCH_ALL_ORDER_FAILURE,
  DELETE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILURE,
  DELETE_ORDER_FAILURE,
  UPDATE_ORDER_SUCCESS,
} from "./orderActions";

const initialState = {

  orders: [],
  userOrders:[],
  allOrders: [],
  loading: false,
  error: null,
};
const orderReducer = (state = initialState, action) => {
  console.log(state.userOrders)
  console.log(state.allOrders)
  console.log(action.payload)
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
    case FETCH_USERS_REQUEST:
    case FETCH_USER_ORDER_REQUEST:
    case FETCH_ALL_ORDER_REQUEST:
      return { ...state, loading: true, error: null };
    
      case FETCH_ORDERS_SUCCESS:
        return { ...state, loading: false, orders: action.payload };
  
      case FETCH_USER_ORDER_SUCCESS:
        return { ...state, loading: false, userOrders: action.payload };
  
      case FETCH_ALL_ORDER_SUCCESS:
        return { ...state, loading: false, allOrders: action.payload };

      case FETCH_ORDERS_FAILURE:
      case FETCH_USER_ORDER_FAILURE:
      case FETCH_ALL_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

      case UPDATE_ORDER_SUCCESS:
  return {
    ...state,
    loading: false,
    allOrders: state.allOrders.map((order) =>
      order.id === action.payload.id ? action.payload : order
    ),
  };

case DELETE_ORDER_SUCCESS:
  return {
    ...state,
    loading: false,
    allOrders: state.allOrders.filter(
      (order) => order.id !== action.payload
    ),
  };

case UPDATE_ORDER_FAILURE:
case DELETE_ORDER_FAILURE:
  return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default orderReducer;
