import {
  FETCH_SUBCATEGORY_REQUEST,
  FETCH_SUBCATEGORY_SUCCESS,
  FETCH_SUBCATEGORY_FAILURE,
} from "./subcategoryAction";

const initialState = {
  subcategories: [],
  loading: false,
  error: null,
};

const subcategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUBCATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        subcategories: action.payload,
      };
    case FETCH_SUBCATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default subcategoryReducer;
