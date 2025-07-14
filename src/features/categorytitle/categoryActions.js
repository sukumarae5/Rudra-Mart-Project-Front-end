export const FETCH_CATEGORY_TITLES_REQUEST = "FETCH_CATEGORY_TITLES_REQUEST";
export const FETCH_CATEGORY_TITLES_SUCCESS = "FETCH_CATEGORY_TITLES_SUCCESS";
export const FETCH_CATEGORY_TITLES_FAILURE = "FETCH_CATEGORY_TITLES_FAILURE";

export const ADD_CATEGORY_TITLE_REQUEST = "ADD_CATEGORY_TITLE_REQUEST";
export const ADD_CATEGORY_TITLE_SUCCESS = "ADD_CATEGORY_TITLE_SUCCESS";
export const ADD_CATEGORY_TITLE_FAILURE = "ADD_CATEGORY_TITLE_FAILURE";

export const UPDATE_CATEGORY_TITLE_REQUEST = "UPDATE_CATEGORY_TITLE_REQUEST";
export const UPDATE_CATEGORY_TITLE_SUCCESS = "UPDATE_CATEGORY_TITLE_SUCCESS";
export const UPDATE_CATEGORY_TITLE_FAILURE = "UPDATE_CATEGORY_TITLE_FAILURE";

export const DELETE_CATEGORY_TITLE_REQUEST = "DELETE_CATEGORY_TITLE_REQUEST";
export const DELETE_CATEGORY_TITLE_SUCCESS = "DELETE_CATEGORY_TITLE_SUCCESS";
export const DELETE_CATEGORY_TITLE_FAILURE = "DELETE_CATEGORY_TITLE_FAILURE";

export const fetchCategoryTitlesRequest = () => ({ type: FETCH_CATEGORY_TITLES_REQUEST });
export const fetchCategoryTitlesSuccess = (titles) => ({ type: FETCH_CATEGORY_TITLES_SUCCESS, payload: titles });
export const fetchCategoryTitlesFailure = (error) => ({ type: FETCH_CATEGORY_TITLES_FAILURE, payload: error });

export const addCategoryTitleRequest = (data) => ({ type: ADD_CATEGORY_TITLE_REQUEST, payload: data });
export const addCategoryTitleSuccess = (newTitle) => ({ type: ADD_CATEGORY_TITLE_SUCCESS, payload: newTitle });
export const addCategoryTitleFailure = (error) => ({ type: ADD_CATEGORY_TITLE_FAILURE, payload: error });

export const updateCategoryTitleRequest = (id, data) => ({
  type: UPDATE_CATEGORY_TITLE_REQUEST,
  payload: { id, data },
});
export const updateCategoryTitleSuccess = (updatedTitle) => ({
  type: UPDATE_CATEGORY_TITLE_SUCCESS,
  payload: updatedTitle,
});
export const updateCategoryTitleFailure = (error) => ({ type: UPDATE_CATEGORY_TITLE_FAILURE, payload: error });

export const deleteCategoryTitleRequest = (id) => ({ type: DELETE_CATEGORY_TITLE_REQUEST, payload: id });
export const deleteCategoryTitleSuccess = (id) => ({ type: DELETE_CATEGORY_TITLE_SUCCESS, payload: id });
export const deleteCategoryTitleFailure = (error) => ({ type: DELETE_CATEGORY_TITLE_FAILURE, payload: error });
