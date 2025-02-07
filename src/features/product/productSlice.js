import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SET_SELECTED_PRODUCT,
  GET_SEARCH_PRODUCT,ADD_TO_WISHlIST,
  
} from './productActions';

const initialState = {
  products: [],
  searchproduct:[],
  selectedProduct: [],
  addToWishlist:[],
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_PRODUCTS_SUCCESS:
      console.log(action.payload)

      return { ...state, loading: false, products: action.payload, error: null };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SET_SELECTED_PRODUCT:
      console.log(action.payload)
      return { ...state, selectedProduct: action.payload };
    case GET_SEARCH_PRODUCT:
      
      return {...state,searchproduct:action.payload}
    case ADD_TO_WISHlIST:
      return {...state,addToWishlist:action.payload}  
    default:
      return state;
  }
};

export default productReducer;
