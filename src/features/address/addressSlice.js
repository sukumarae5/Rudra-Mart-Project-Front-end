import {
  FETCH_ADDRESSES_REQUEST,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  ADD_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_SUCCESS,
} from "../address/addressActions";

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

export const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADDRESSES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ADDRESSES_SUCCESS:
      return { ...state, loading: false, addresses: action.payload };

    case FETCH_ADDRESSES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_ADDRESS_SUCCESS:
      return { ...state, addresses: [...state.addresses, action.payload] };

    case UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        addresses: state.addresses.map((addr) =>
          addr.id === action.payload.id ? action.payload : addr
        ),
      };

    case DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        addresses: state.addresses.filter((addr) => addr.id !== action.payload),
      };

    default:
      return state;
  }
};
