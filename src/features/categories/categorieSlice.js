import {
  FETCH_PRODUCTS_CATEGORY_REQUEST,
  FETCH_PRODUCTS_CATEGORY_SUCCESS,
  FETCH_PRODUCTS_CATEGORY_FAILURE,
  ADD_CATEGORY_SUCCESS,
  SET_SELECTED_PRODUCT,
  ADD_CATEGORY_FAILURE,
  ADD_CATEGORY_REQUEST,
  FETCH_CATEGORY_BY_ID_REQUEST,
  FETCH_CATEGORY_BY_ID_SUCCESS,
  FETCH_CATEGORY_BY_ID_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  DELETE_CATEGORY_FAILURE,
  DELETE_CATEGORY_SUCCESS,
} from "../categories/categoriesAction";

const initialState = {
  categoryproduct: [],
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null,
  selectedproduct: [],
};

const categoryproductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_CATEGORY_REQUEST:

    case FETCH_PRODUCTS_CATEGORY_SUCCESS:
      return { ...state, loading: false, categoryproduct: action.payload };

    case FETCH_PRODUCTS_CATEGORY_FAILURE:

    case ADD_CATEGORY_REQUEST:
      return { ...state, loading: true, success: false };

    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true, // ✅ set on success
        categories: [...state.categories, action.payload],
      };

    case ADD_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case SET_SELECTED_PRODUCT:
      return { ...state, selectedproduct: action.payload };

    case FETCH_CATEGORY_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CATEGORY_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedCategory: action.payload };
    case FETCH_CATEGORY_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_CATEGORY_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_CATEGORY_SUCCESS:
      return { ...state, loading: false, success: true };
    case UPDATE_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };
      case DELETE_CATEGORY_SUCCESS:
  return {
    ...state,
    categoryproduct: state.categoryproduct.filter(
      (cat) => cat.id !== action.payload
    ),
    error: null,
  };
case DELETE_CATEGORY_FAILURE:
  return {
    ...state,
    error: action.payload,
  };

    default:
      return state;
  }
};
export default categoryproductReducer;
