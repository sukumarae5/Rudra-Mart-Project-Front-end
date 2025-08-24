import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SET_SELECTED_PRODUCT,
  GET_SEARCH_PRODUCT,
  FETCH_PRODUCTS_WITH_CATEGORY_REQUEST,
  FETCH_PRODUCTS_WITH_CATEGORY_SUCCESS,
  FETCH_PRODUCTS_WITH_CATEGORY_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
  FETCH_PRODUCT_REQUEST,
   DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  RESET_PRODUCT_STATUS,
} from "./productActions";

const initialState = {
  products: [],
  searchproduct: [],
  selectedProduct: [],
  addToWishlist: [],
  productsWithCategory: [],
  createdMessage: "",
  updatedProduct: null,
  product: null,
  updateMessage: "",
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  // console.log(action.payload)
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null,
      };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SET_SELECTED_PRODUCT:
      return { ...state, selectedProduct: action.payload };
    case GET_SEARCH_PRODUCT:
      return { ...state, searchproduct: action.payload };

    // case ADD_TO_WISHlIST:
    //   // Avoid duplicate wishlist items
    //   const itemExists = state.addToWishlist.some(
    //     (item) => item.id === action.payload.id
    //   );
    //   if (itemExists) return state;
    //   return {
    //     ...state,
    //     addToWishlist: [...state.addToWishlist, action.payload],
    //   };
    // case REMOVE_FROM_WISHLIST:
    //   return {
    //     ...state,
    //     addToWishlist: state.addToWishlist.filter(
    //       (item) => item.id !== action.payload
    //     ),
    //   };

    case FETCH_PRODUCTS_WITH_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null, };
    case FETCH_PRODUCTS_WITH_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        productsWithCategory: action.payload,
        error: null,
      };
    case FETCH_PRODUCTS_WITH_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

      case CREATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        createdMessage: action.payload,
      };

    case CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case FETCH_PRODUCT_REQUEST:
      return { ...state, loading: true, product: null, error: null };

    case FETCH_PRODUCT_SUCCESS:
      return { ...state, loading: false, product: action.payload };

    case FETCH_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null, updateMessage: null };

    case UPDATE_PRODUCT_SUCCESS:
  return {
    ...state,
    loading: false,
    updateMessage: action.payload.message,
    products: state.products.map((product) =>
    product.id === action.payload.id ? action.payload : product
    ),
    success: true,
  };

case UPDATE_PRODUCT_FAILURE:
  return {
    ...state,
    loading: false,
    error: action.payload,
    success: false,
  };


      case DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        
      };
    
  //     case DELETE_PRODUCT_SUCCESS:
  // return {
  //   ...state,
  //   loading: false,
  //           updateMessage: action.payload.message, // 👈 capture message here

  //   products: state.products.filter((product) => product.id !== Number(action.payload)),
  //   success: true,
  // };
case DELETE_PRODUCT_SUCCESS:
  return {
    ...state,
    productsWithCategory: state.productsWithCategory.filter(
      (p) => p.product_id !== action.payload
    ),
    deleteProductSuccess: true,
  };


    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
      
      case RESET_PRODUCT_STATUS:
  return {
    ...state,
    createdMessage: "",
    error: null,
    updateMessage: "",
    deleteProductSuccess: false,
  };

    default:
      return state;
  }
};

export default productReducer;
