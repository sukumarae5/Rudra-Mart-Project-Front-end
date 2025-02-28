import { ADD_ADDRESS_FAILURE, ADD_ADDRESS_REQUEST, ADD_ADDRESS_SUCCESS, DELETE_ADDRESS_FAILURE, DELETE_ADDRESS_REQUEST, DELETE_ADDRESS_SUCCESS, FETCH_ADDRESSES_FAILURE, FETCH_ADDRESSES_REQUEST, FETCH_ADDRESSES_SUCCESS, UPDATE_ADDRESS_FAILURE, UPDATE_ADDRESS_REQUEST, UPDATE_ADDRESS_SUCCESS } from "./addressActions";

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

export const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADDRESSES_REQUEST:
    case ADD_ADDRESS_REQUEST:
    case UPDATE_ADDRESS_REQUEST:
    case DELETE_ADDRESS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_ADDRESSES_SUCCESS:
      return { ...state, loading: false, addresses: action.payload };

    case ADD_ADDRESS_SUCCESS:
      return { ...state, loading: false, addresses: [...state.addresses, action.payload] };

    case UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.map((addr) =>
          addr._id === action.payload._id ? action.payload : addr
        ),
      };

    case DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addresses: state.addresses.filter((addr) => addr._id !== action.payload),
      };

    case FETCH_ADDRESSES_FAILURE:
    case ADD_ADDRESS_FAILURE:
    case UPDATE_ADDRESS_FAILURE:
    case DELETE_ADDRESS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
