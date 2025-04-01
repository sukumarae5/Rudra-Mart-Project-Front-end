import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SET_SELECTED_PRODUCT,
  GET_SEARCH_PRODUCT,
  ADD_TO_WISHlIST,
  REMOVE_FROM_WISHLIST,
  
} from "./productActions";

const initialState = {
  products: [],
  searchproduct: [],
  selectedProduct: [],
  addToWishlist: [],
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: null };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SET_SELECTED_PRODUCT:
      return { ...state, selectedProduct: action.payload };
    case GET_SEARCH_PRODUCT:
      return { ...state, searchproduct: action.payload };
   
    case ADD_TO_WISHlIST:
      // Avoid duplicate wishlist items
      const itemExists = state.addToWishlist.some(
        (item) => item.id === action.payload.id
      );
      if (itemExists) return state;
      return {
        ...state,
        addToWishlist: [...state.addToWishlist, action.payload],
      };
    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        addToWishlist: state.addToWishlist.filter(
          (item) => item.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default productReducer;