import { FETCH_USERS_REQUEST } from "../user/userActions";
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_USER_ORDER_SUCCESS,
  FETCH_USER_ORDER_FAILURE,
} from "./orderActions";

const initialState = {

  orders: [],
  userorders:[],
  loading: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload };

    case FETCH_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_USERS_REQUEST:
      return{...state,loading:true ,error:null} ;
      case FETCH_USER_ORDER_SUCCESS:
       return {...state, loading:false,userorders:action.payload.orders} ;
      case FETCH_USER_ORDER_FAILURE:
        return{...state,loading:false,error:action.payload} 

    default:
      return state;
  }
};

export default orderReducer;
