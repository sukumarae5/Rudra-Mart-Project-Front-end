// Action Types
export const FETCH_SUBCATEGORY_REQUEST = "FETCH_SUBCATEGORY_REQUEST";
export const FETCH_SUBCATEGORY_SUCCESS = "FETCH_SUBCATEGORY_SUCCESS";
export const FETCH_SUBCATEGORY_FAILURE = "FETCH_SUBCATEGORY_FAILURE";

// Action Creators
export const fetchSubcategoryRequest = () => ({ type: FETCH_SUBCATEGORY_REQUEST });
export const fetchSubcategorySuccess = (data) => ({
  type: FETCH_SUBCATEGORY_SUCCESS,
  payload: data,
});
export const fetchSubcategoryFailure = (error) => ({
  type: FETCH_SUBCATEGORY_FAILURE,
  payload: error,
});
