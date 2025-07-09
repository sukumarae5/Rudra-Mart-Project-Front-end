// Action Types
export const FETCH_PRODUCTS_CATEGORY_REQUEST = "FETCH_PRODUCTS_CATEGORY_REQUEST";
export const FETCH_PRODUCTS_CATEGORY_SUCCESS = "FETCH_PRODUCTS_CATEGORY_SUCCESS";
export const FETCH_PRODUCTS_CATEGORY_FAILURE = "FETCH_PRODUCTS_CATEGORY_FAILURE";

export const ADD_CATEGORY_REQUEST = "ADD_CATEGORY_REQUEST";
export const ADD_CATEGORY_SUCCESS = "ADD_CATEGORY_SUCCESS";
export const ADD_CATEGORY_FAILURE = "ADD_CATEGORY_FAILURE";

export const FETCH_CATEGORY_BY_ID_REQUEST = "FETCH_CATEGORY_BY_ID_REQUEST";
export const FETCH_CATEGORY_BY_ID_SUCCESS = "FETCH_CATEGORY_BY_ID_SUCCESS";
export const FETCH_CATEGORY_BY_ID_FAILURE = "FETCH_CATEGORY_BY_ID_FAILURE";

export const UPDATE_CATEGORY_REQUEST = "UPDATE_CATEGORY_REQUEST";
export const UPDATE_CATEGORY_SUCCESS = "UPDATE_CATEGORY_SUCCESS";
export const UPDATE_CATEGORY_FAILURE = "UPDATE_CATEGORY_FAILURE";

export const DELETE_CATEGORY_REQUEST = "DELETE_CATEGORY_REQUEST";
export const DELETE_CATEGORY_SUCCESS = "DELETE_CATEGORY_SUCCESS";
export const DELETE_CATEGORY_FAILURE = "DELETE_CATEGORY_FAILURE";

export const SET_SELECTED_PRODUCT = "SET_SELECTED_PRODUCT";

export const addCategoryRequest = (payload) => ({
  type: ADD_CATEGORY_REQUEST,
  payload,
});

export const addCategorySuccess = (data) => ({ type: ADD_CATEGORY_SUCCESS, payload: data });
export const addCategoryFailure = (error) => ({ type: ADD_CATEGORY_FAILURE, payload: error });
export const fetchProductCategoryRequest = () => ({ type: FETCH_PRODUCTS_CATEGORY_REQUEST });
export const fetchProductCategorySuccess = (data) => ({ type: FETCH_PRODUCTS_CATEGORY_SUCCESS, payload: data });
export const fetchProductCategoryFailure = (error) => ({ type: FETCH_PRODUCTS_CATEGORY_FAILURE, payload: error });

export const fetchCategoryByIdRequest = (id) => ({
  type: FETCH_CATEGORY_BY_ID_REQUEST,
  payload: id,
});

export const fetchCategoryByIdSuccess = (data) => ({
  type: FETCH_CATEGORY_BY_ID_SUCCESS,
  payload: data,
});

export const fetchCategoryByIdFailure = (error) => ({
  type: FETCH_CATEGORY_BY_ID_FAILURE,
  payload: error,
});

export const updateCategoryRequest = (id, data) => ({
  type: UPDATE_CATEGORY_REQUEST,
  payload: { id, data },
});

export const updateCategorySuccess = () => ({
  type: UPDATE_CATEGORY_SUCCESS,
});

export const updateCategoryFailure = (error) => ({
  type: UPDATE_CATEGORY_FAILURE,
  payload: error,
});

export const deleteCategoryRequest = (id) => ({
  type: DELETE_CATEGORY_REQUEST,
  payload: id,
});

export const deleteCategorySuccess = (id) => ({
  type: DELETE_CATEGORY_SUCCESS,
  payload: id,
});

export const deleteCategoryFailure = (error) => ({
  type: DELETE_CATEGORY_FAILURE,
  payload: error,
});

export const setSelectedProduct = (products) => ({ type: SET_SELECTED_PRODUCT, payload: products });
