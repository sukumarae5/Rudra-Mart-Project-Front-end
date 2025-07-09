import {
  FETCH_SUBCATEGORY_REQUEST,
  FETCH_SUBCATEGORY_SUCCESS,
  FETCH_SUBCATEGORY_FAILURE,
  ADD_SUBCATEGORY_REQUEST,
  ADD_SUBCATEGORY_SUCCESS,
  ADD_SUBCATEGORY_FAILURE,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_SUBCATEGORY_BY_ID_REQUEST,
  FETCH_SUBCATEGORY_BY_ID_SUCCESS,
  FETCH_SUBCATEGORY_BY_ID_FAILURE,
  UPDATE_SUBCATEGORY_REQUEST,
  UPDATE_SUBCATEGORY_SUCCESS,
  UPDATE_SUBCATEGORY_FAILURE,
  DELETE_SUBCATEGORY_FAILURE,
  DELETE_SUBCATEGORY_SUCCESS,
} from "../subcategories/subcategoryAction";

const initialState = {
  subcategories: [],
  categories: [],
  selectedSubcategory: null,
  loading: false,
  error: null,
  success: false,
};

const subcategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUBCATEGORY_REQUEST:
    case ADD_SUBCATEGORY_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case FETCH_SUBCATEGORY_SUCCESS:
      return { ...state, loading: false, subcategories: action.payload };

    case ADD_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        subcategories: [...state.subcategories, action.payload],
        success: true,
      };

    case FETCH_SUBCATEGORY_FAILURE:
    case ADD_SUBCATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload };

    case FETCH_SUBCATEGORY_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SUBCATEGORY_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedSubcategory: action.payload };
    case FETCH_SUBCATEGORY_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_SUBCATEGORY_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_SUBCATEGORY_SUCCESS:
      return { ...state, loading: false, success: true };
    case UPDATE_SUBCATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

      case DELETE_SUBCATEGORY_SUCCESS:
  return {
    ...state,
    subcategories: state.subcategories.filter(
      (sub) => sub.id !== action.payload
    ),
    error: null,
  };

case DELETE_SUBCATEGORY_FAILURE:
  return {
    ...state,
    error: action.payload,
  };

    default:
      return state;
  }
};

export default subcategoryReducer;
