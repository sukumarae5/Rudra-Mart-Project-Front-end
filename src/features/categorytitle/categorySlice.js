import {
  FETCH_CATEGORY_TITLES_REQUEST,
  FETCH_CATEGORY_TITLES_SUCCESS,
  FETCH_CATEGORY_TITLES_FAILURE,
  ADD_CATEGORY_TITLE_SUCCESS,
  UPDATE_CATEGORY_TITLE_SUCCESS,
  DELETE_CATEGORY_TITLE_SUCCESS,
} from "./categoryActions";

const initialState = {
  loading: false,
  titles: [],
  error: null,
};

const categoryTitleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_TITLES_REQUEST:
      return { ...state, loading: true };
    case FETCH_CATEGORY_TITLES_SUCCESS:
      return { ...state, loading: false, titles: action.payload };
    case FETCH_CATEGORY_TITLES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_CATEGORY_TITLE_SUCCESS:
      return { ...state, titles: [action.payload, ...state.titles] };
    case UPDATE_CATEGORY_TITLE_SUCCESS:
      return {
        ...state,
        titles: state.titles.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case DELETE_CATEGORY_TITLE_SUCCESS:
      return {
        ...state,
        titles: state.titles.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
};

export default categoryTitleReducer;