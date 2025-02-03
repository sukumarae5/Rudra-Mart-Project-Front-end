import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_PRODUCT_QUANTITY } from "./cartActions";

const initialState = {
  cartProducts: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingProduct = state.cartProducts.find((item) => item.id === action.payload.id);
      if (existingProduct) {
        return {
          ...state,
          cartProducts: state.cartProducts.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cartProducts: [...state.cartProducts, { ...action.payload, quantity: 1 }],
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartProducts: state.cartProducts.filter((item) => item.id !== action.payload),
      };

    case UPDATE_CART_PRODUCT_QUANTITY:
      return {
        ...state,
        cartProducts: state.cartProducts.map((item) =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    default:
      return state;
  }
};

export default cartReducer;
