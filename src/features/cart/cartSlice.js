import {
  FETCH_API_CART_DATA_SUCCESS,
  FETCH_API_CART_DATA_FAILURE,
} from "../cart/cartActions";

const initialState = {
  cartItems: [],
  error: null,
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_API_CART_DATA_SUCCESS:
      console.log(action.payload)
      return { ...state, cartItems: action.payload, error: null };
    case FETCH_API_CART_DATA_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
