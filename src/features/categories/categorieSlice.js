// --- reducers/categoryproductReducer.js ---
import {
  FETCH_PRODUCTS_CATEGORY_REQUEST,
  FETCH_PRODUCTS_CATEGORY_SUCCESS,
  FETCH_PRODUCTS_CATEGORY_FAILURE,
} from "./categoriesAction";

const initialState = {
  categoryproduct: [],
  loading: false,
  error: null,
  products: [],
  selectedproduct: [],
};

const categoryproductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PRODUCTS_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryproduct: action.payload,
        error: null,
      };

    case FETCH_PRODUCTS_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SET_SELECTED_PRODUCT":
      return {
        ...state,
        selectedproduct: action.payload,
      };

    default:
      return state;
  }
};

export default categoryproductReducer;
