import {
    FETCH_BEST_SELLING_PRODUCTS_REQUEST,
    FETCH_BEST_SELLING_PRODUCTS_SUCCESS,
    FETCH_BEST_SELLING_PRODUCTS_FAILURE,
    FETCH_TOP_CUSTOMERS_REQUEST,
    FETCH_TOP_CUSTOMERS_SUCCESS,
    FETCH_TOP_CUSTOMERS_FAILURE,
  } from "./adminActions";
  
  const initialState = {
    bestSellingProducts: [],
    topCustomers: [],
    loading: false,
    error: null,
  };
  
  const dashboardReducer = (state = initialState, action) => {
    console.log(state.bestSellingProducts)
    console.log(state.topCustomers)
    console.log(action.payload)
    switch (action.type) {
      case FETCH_BEST_SELLING_PRODUCTS_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_TOP_CUSTOMERS_REQUEST:
        return { ...state, loading: true, error: null };
  
      case FETCH_BEST_SELLING_PRODUCTS_SUCCESS:
        return { ...state, loading: false, bestSellingProducts: action.payload };
  
      case FETCH_TOP_CUSTOMERS_SUCCESS:
        return { ...state, loading: false, topCustomers: action.payload };
  
      case FETCH_BEST_SELLING_PRODUCTS_FAILURE:

      return { ...state, loading: false, error: action.payload };

      case FETCH_TOP_CUSTOMERS_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default dashboardReducer;
  