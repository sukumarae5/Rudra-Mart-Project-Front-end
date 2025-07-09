import {
  FETCH_BANNERS_REQUEST,
  FETCH_BANNERS_SUCCESS,
  FETCH_BANNERS_FAILURE,
  ADD_BANNER_REQUEST,
  ADD_BANNER_SUCCESS,
  ADD_BANNER_FAILURE,
  FETCH_BANNER_BY_ID_REQUEST,
  FETCH_BANNER_BY_ID_SUCCESS,
  FETCH_BANNER_BY_ID_FAILURE,
  UPDATE_BANNER_REQUEST,
  UPDATE_BANNER_SUCCESS,
  UPDATE_BANNER_FAILURE,
  DELETE_BANNER_REQUEST,
  DELETE_BANNER_SUCCESS,
  DELETE_BANNER_FAILURE,
} from "../banners/bannerActions";

const initialState = {
  banners: [],
  loading: false,
  error: null,
  selectedBanner: null,
  success: false,
};

const bannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BANNERS_REQUEST:
    case ADD_BANNER_REQUEST:
    case FETCH_BANNER_BY_ID_REQUEST:
    case UPDATE_BANNER_REQUEST:
    case DELETE_BANNER_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case FETCH_BANNERS_SUCCESS:
      return { ...state, loading: false, banners: action.payload };

    case FETCH_BANNERS_FAILURE:
    case ADD_BANNER_FAILURE:
    case FETCH_BANNER_BY_ID_FAILURE:
    case UPDATE_BANNER_FAILURE:
    case DELETE_BANNER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_BANNER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        banners: [...state.banners, action.payload],
      };

    case FETCH_BANNER_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedBanner: action.payload };

    case UPDATE_BANNER_SUCCESS:
      return { ...state, loading: false, success: true };

    case DELETE_BANNER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        banners: state.banners.filter((b) => b.id !== action.payload),
      };

    default:
      return state;
  }
};

export default bannerReducer;
