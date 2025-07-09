// Action Types
export const FETCH_BANNERS_REQUEST = "FETCH_BANNERS_REQUEST";
export const FETCH_BANNERS_SUCCESS = "FETCH_BANNERS_SUCCESS";
export const FETCH_BANNERS_FAILURE = "FETCH_BANNERS_FAILURE";

export const ADD_BANNER_REQUEST = "ADD_BANNER_REQUEST";
export const ADD_BANNER_SUCCESS = "ADD_BANNER_SUCCESS";
export const ADD_BANNER_FAILURE = "ADD_BANNER_FAILURE";

export const FETCH_BANNER_BY_ID_REQUEST = "FETCH_BANNER_BY_ID_REQUEST";
export const FETCH_BANNER_BY_ID_SUCCESS = "FETCH_BANNER_BY_ID_SUCCESS";
export const FETCH_BANNER_BY_ID_FAILURE = "FETCH_BANNER_BY_ID_FAILURE";

export const UPDATE_BANNER_REQUEST = "UPDATE_BANNER_REQUEST";
export const UPDATE_BANNER_SUCCESS = "UPDATE_BANNER_SUCCESS";
export const UPDATE_BANNER_FAILURE = "UPDATE_BANNER_FAILURE";

export const DELETE_BANNER_REQUEST = "DELETE_BANNER_REQUEST";
export const DELETE_BANNER_SUCCESS = "DELETE_BANNER_SUCCESS";
export const DELETE_BANNER_FAILURE = "DELETE_BANNER_FAILURE";

// Action Creators
export const fetchBannersRequest = () => ({ type: FETCH_BANNERS_REQUEST });
export const fetchBannersSuccess = (data) => ({
  type: FETCH_BANNERS_SUCCESS,
  payload: data,
});
export const fetchBannersFailure = (error) => ({
  type: FETCH_BANNERS_FAILURE,
  payload: error,
});

export const addBannerRequest = (bannerData) => ({
  type: ADD_BANNER_REQUEST,
  payload: bannerData,
});
export const addBannerSuccess = (data) => ({
  type: ADD_BANNER_SUCCESS,
  payload: data,
});
export const addBannerFailure = (error) => ({
  type: ADD_BANNER_FAILURE,
  payload: error,
});

export const fetchBannerByIdRequest = (id) => ({
  type: FETCH_BANNER_BY_ID_REQUEST,
  payload: id,
});
export const fetchBannerByIdSuccess = (data) => ({
  type: FETCH_BANNER_BY_ID_SUCCESS,
  payload: data,
});
export const fetchBannerByIdFailure = (error) => ({
  type: FETCH_BANNER_BY_ID_FAILURE,
  payload: error,
});

export const updateBannerRequest = (id, data) => ({
  type: UPDATE_BANNER_REQUEST,
  payload: { id, data },
});
export const updateBannerSuccess = () => ({ type: UPDATE_BANNER_SUCCESS });
export const updateBannerFailure = (error) => ({
  type: UPDATE_BANNER_FAILURE,
  payload: error,
});

export const deleteBannerRequest = (id) => ({
  type: DELETE_BANNER_REQUEST,
  payload: id,
});
export const deleteBannerSuccess = (id) => ({
  type: DELETE_BANNER_SUCCESS,
  payload: id,
});
export const deleteBannerFailure = (error) => ({
  type: DELETE_BANNER_FAILURE,
  payload: error,
});
