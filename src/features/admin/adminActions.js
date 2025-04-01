export const FETCH_BEST_SELLING_PRODUCTS_REQUEST = "FETCH_BEST_SELLING_PRODUCTS_REQUEST";
export const FETCH_BEST_SELLING_PRODUCTS_SUCCESS = "FETCH_BEST_SELLING_PRODUCTS_SUCCESS";
export const FETCH_BEST_SELLING_PRODUCTS_FAILURE = "FETCH_BEST_SELLING_PRODUCTS_FAILURE";

export const FETCH_TOP_CUSTOMERS_REQUEST = "FETCH_TOP_CUSTOMERS_REQUEST";
export const FETCH_TOP_CUSTOMERS_SUCCESS = "FETCH_TOP_CUSTOMERS_SUCCESS";
export const FETCH_TOP_CUSTOMERS_FAILURE = "FETCH_TOP_CUSTOMERS_FAILURE";

// Action Creators
export const fetchBestSellingProductsRequest = () => ({ type: FETCH_BEST_SELLING_PRODUCTS_REQUEST });
export const fetchBestSellingProductsSuccess = (products) => ({ type: FETCH_BEST_SELLING_PRODUCTS_SUCCESS, payload: products });
export const fetchBestSellingProductsFailure = (error) => ({ type: FETCH_BEST_SELLING_PRODUCTS_FAILURE, payload: error });

export const fetchTopCustomersRequest = () => ({ type: FETCH_TOP_CUSTOMERS_REQUEST });
export const fetchTopCustomersSuccess = (customers) => ({ type: FETCH_TOP_CUSTOMERS_SUCCESS, payload: customers });
export const fetchTopCustomersFailure = (error) => ({ type: FETCH_TOP_CUSTOMERS_FAILURE, payload: error });
