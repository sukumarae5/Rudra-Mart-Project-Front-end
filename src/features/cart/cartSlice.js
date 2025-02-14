import {
  FETCH_API_CART_DATA_REQUEST,
  FETCH_API_CART_DATA_SUCCESS,
  FETCH_API_CART_DATA_FAILURE,
} from "../cart/cartActions";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_API_CART_DATA_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_API_CART_DATA_SUCCESS:
      console.log("Fetched Cart Data in Reducer:", action.payload);
      return { ...state, cartItems: action.payload, loading: false, error: null };
    case FETCH_API_CART_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
