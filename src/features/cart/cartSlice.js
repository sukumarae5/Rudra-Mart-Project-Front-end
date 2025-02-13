import {
  FETCH_API_CART_DATA_REQUEST,
  FETCH_API_CART_DATA_SUCCESS,
  FETCH_API_CART_DATA_FAILURE,
} from "./cartActions";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_API_CART_DATA_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_API_CART_DATA_SUCCESS:
      console.log("cart items fetched:", action.payload);
      return { ...state, cartItems: action.payload, loading: false };
    case FETCH_API_CART_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default cartReducer;
