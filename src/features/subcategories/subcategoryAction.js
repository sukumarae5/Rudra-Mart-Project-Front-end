export const FETCH_SUBCATEGORY_REQUEST = "FETCH_SUBCATEGORY_REQUEST";
export const FETCH_SUBCATEGORY_SUCCESS = "FETCH_SUBCATEGORY_SUCCESS";
export const FETCH_SUBCATEGORY_FAILURE = "FETCH_SUBCATEGORY_FAILURE";

export const ADD_SUBCATEGORY_REQUEST = "ADD_SUBCATEGORY_REQUEST";
export const ADD_SUBCATEGORY_SUCCESS = "ADD_SUBCATEGORY_SUCCESS";
export const ADD_SUBCATEGORY_FAILURE = "ADD_SUBCATEGORY_FAILURE";

export const FETCH_CATEGORIES_REQUEST = "FETCH_CATEGORIES_REQUEST";
export const FETCH_CATEGORIES_SUCCESS = "FETCH_CATEGORIES_SUCCESS";
export const FETCH_CATEGORIES_FAILURE = "FETCH_CATEGORIES_FAILURE";

export const FETCH_SUBCATEGORY_BY_ID_REQUEST =
  "FETCH_SUBCATEGORY_BY_ID_REQUEST";
export const FETCH_SUBCATEGORY_BY_ID_SUCCESS =
  "FETCH_SUBCATEGORY_BY_ID_SUCCESS";
export const FETCH_SUBCATEGORY_BY_ID_FAILURE =
  "FETCH_SUBCATEGORY_BY_ID_FAILURE";

export const UPDATE_SUBCATEGORY_REQUEST = "UPDATE_SUBCATEGORY_REQUEST";
export const UPDATE_SUBCATEGORY_SUCCESS = "UPDATE_SUBCATEGORY_SUCCESS";
export const UPDATE_SUBCATEGORY_FAILURE = "UPDATE_SUBCATEGORY_FAILURE";

export const DELETE_SUBCATEGORY_REQUEST = "DELETE_SUBCATEGORY_REQUEST";
export const DELETE_SUBCATEGORY_SUCCESS = "DELETE_SUBCATEGORY_SUCCESS";
export const DELETE_SUBCATEGORY_FAILURE = "DELETE_SUBCATEGORY_FAILURE";

// Action Creators
export const fetchSubcategoryRequest = () => ({
  type: FETCH_SUBCATEGORY_REQUEST,
});
export const fetchSubcategorySuccess = (data) => ({
  type: FETCH_SUBCATEGORY_SUCCESS,
  payload: data,
});
export const fetchSubcategoryFailure = (error) => ({
  type: FETCH_SUBCATEGORY_FAILURE,
  payload: error,
});

export const addSubcategoryRequest = (payload) => ({
  type: ADD_SUBCATEGORY_REQUEST,
  payload,
});
export const addSubcategorySuccess = (data) => ({
  type: ADD_SUBCATEGORY_SUCCESS,
  payload: data,
});
export const addSubcategoryFailure = (error) => ({
  type: ADD_SUBCATEGORY_FAILURE,
  payload: error,
});

export const fetchCategoriesRequest = () => ({
  type: FETCH_CATEGORIES_REQUEST,
});
export const fetchCategoriesSuccess = (data) => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: data,
});
export const fetchCategoriesFailure = (error) => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});

export const fetchSubcategoryByIdRequest = (id) => ({
  type: FETCH_SUBCATEGORY_BY_ID_REQUEST,
  payload: id,
});

export const fetchSubcategoryByIdSuccess = (data) => ({
  type: FETCH_SUBCATEGORY_BY_ID_SUCCESS,
  payload: data,
});

export const fetchSubcategoryByIdFailure = (error) => ({
  type: FETCH_SUBCATEGORY_BY_ID_FAILURE,
  payload: error,
});

export const updateSubcategoryRequest = (id, data) => ({
  type: UPDATE_SUBCATEGORY_REQUEST,
  payload: { id, data },
});

export const updateSubcategorySuccess = () => ({
  type: UPDATE_SUBCATEGORY_SUCCESS,
});

export const updateSubcategoryFailure = (error) => ({
  type: UPDATE_SUBCATEGORY_FAILURE,
  payload: error,
});

export const deleteSubcategoryRequest = (id) => ({
  type: DELETE_SUBCATEGORY_REQUEST,
  payload: id,
});

export const deleteSubcategorySuccess = (id) => ({
  type: DELETE_SUBCATEGORY_SUCCESS,
  payload: id,
});

export const deleteSubcategoryFailure = (error) => ({
  type: DELETE_SUBCATEGORY_FAILURE,
  payload: error,
});
