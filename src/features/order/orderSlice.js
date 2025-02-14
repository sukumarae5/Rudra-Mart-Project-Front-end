import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE,
  SET_SELECTED_ORDER,
  GET_SEARCH_ORDER,
} from "./orderActions";

const initialState = {
  orders: [],
  searchOrder: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
      return { ...state, loading: true };

    case FETCH_ORDERS_SUCCESS:
      console.log("Orders fetched:", action.payload);
      return { ...state, loading: false, orders: action.payload, error: null };

    case FETCH_ORDERS_FAILURE:
      console.error("Order fetch error:", action.payload);
      return { ...state, loading: false, error: action.payload };

    case SET_SELECTED_ORDER:
      return { ...state, selectedOrder: action.payload };

    case GET_SEARCH_ORDER:
      return { ...state, searchOrder: action.payload };

    default:
      return state;
  }
};

export default orderSlice;
