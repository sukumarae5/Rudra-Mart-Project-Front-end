import {
  FETCH_API_CART_DATA_REQUEST,
  FETCH_API_CART_DATA_SUCCESS,
  FETCH_API_CART_DATA_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_QUANTITY_REQUEST,
  UPDATE_CART_ITEM_QUANTITY_SUCCESS,
  UPDATE_CART_ITEM_QUANTITY_FAILURE,
} from "../cart/cartActions";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_API_CART_DATA_REQUEST:
      return { ...state, loading: true };

    case FETCH_API_CART_DATA_SUCCESS:
      return { ...state, loading: false, cartItems: action.payload };

    case FETCH_API_CART_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case REMOVE_CART_ITEM_REQUEST:
      return { ...state, loading: true };

    case REMOVE_CART_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };

    case REMOVE_CART_ITEM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_CART_ITEM_QUANTITY_REQUEST:
      return { ...state, loading: true };

    case UPDATE_CART_ITEM_QUANTITY_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.cartItemId ? { ...item, quantity: action.payload.quantity } : item
        ),
      };

    case UPDATE_CART_ITEM_QUANTITY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default cartReducer;
