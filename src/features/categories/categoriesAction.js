// Action Types
export const FETCH_PRODUCTS_CATEGORY_REQUEST = "FETCH_PRODUCTS_CATEGORY_REQUEST";
export const FETCH_PRODUCTS_CATEGORY_SUCCESS = "FETCH_PRODUCTS_CATEGORY_SUCCESS";
export const FETCH_PRODUCTS_CATEGORY_FAILURE = "FETCH_PRODUCTS_CATEGORY_FAILURE";

// Action Creators
export const fetchProductCategoryRequest = () => ({
  type: FETCH_PRODUCTS_CATEGORY_REQUEST,
});

export const fetchProductCategorySuccess = (categoryproduct) => ({
  type: FETCH_PRODUCTS_CATEGORY_SUCCESS,
  payload: categoryproduct,
});

export const fetchProductCategoryFailure = (error) => ({
  type: FETCH_PRODUCTS_CATEGORY_FAILURE,
  payload: error,
});
export const SET_SELECTED_PRODUCT = "SET_SELECTED_PRODUCT";

export const setSelectedProduct = (products) => ({
  type: SET_SELECTED_PRODUCT,
  payload: products,
});


