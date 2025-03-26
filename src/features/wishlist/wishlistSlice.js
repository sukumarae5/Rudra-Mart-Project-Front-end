import {
  FETCH_WISHLIST_REQUEST,
  FETCH_WISHLIST_SUCCESS,
  FETCH_WISHLIST_FAILURE,
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_SUCCESS,
  ADD_TO_WISHLIST_FAILURE,
  REMOVE_WISHLIST_PRODUCT_REQUEST,
  REMOVE_WISHLIST_PRODUCT_SUCCESS,
  REMOVE_WISHLIST_PRODUCT_FAILURE,
} from "../wishlist/wishlistAction";

const initialState = {
  wishlistData: [], // ✅ Ensuring correct key is used
  loading: false,
  error: null,
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WISHLIST_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_WISHLIST_SUCCESS:
      return { ...state, loading: false, wishlistData: action.payload };

    case FETCH_WISHLIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_TO_WISHLIST_REQUEST:
      return { ...state, loading: true };

    case ADD_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        wishlistData: [...state.wishlistData, action.payload], // ✅ Correct key name
      };

    case ADD_TO_WISHLIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case REMOVE_WISHLIST_PRODUCT_REQUEST:
      return { ...state, loading: true };

    case REMOVE_WISHLIST_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        wishlistData: state.wishlistData.filter((item) => item.product_id !== action.payload),
      };

    case REMOVE_WISHLIST_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default wishlistReducer;
