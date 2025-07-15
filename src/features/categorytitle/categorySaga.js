import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import {
  FETCH_CATEGORY_TITLES_REQUEST,
  ADD_CATEGORY_TITLE_REQUEST,
  UPDATE_CATEGORY_TITLE_REQUEST,
  DELETE_CATEGORY_TITLE_REQUEST,
  fetchCategoryTitlesSuccess,
  fetchCategoryTitlesFailure,
  addCategoryTitleSuccess,
  addCategoryTitleFailure,
  updateCategoryTitleSuccess,
  updateCategoryTitleFailure,
  deleteCategoryTitleSuccess,
  deleteCategoryTitleFailure,
  fetchCategoryTitlesRequest,
} from "./categoryActions";

const BASE_URL = `http://${process.env.REACT_APP_IP_ADDRESS}/api/categorytitle/categorytitles`;

function* fetchTitlesSaga() {
  try {
    const res = yield call(() => axios.get(BASE_URL));
    console.log("Fetched category titles:", res.data);
    yield put(fetchCategoryTitlesSuccess(res.data));
  } catch (err) {
    yield put(fetchCategoryTitlesFailure(err.message));
  }
}

function* addTitleSaga(action) {
  try {
    const response = yield call(() => axios.post(BASE_URL, action.payload));
    console.log("Added new category title:", response.data);
    // Dispatch success action with the new title
    yield put(addCategoryTitleSuccess(response.data));
    yield put(fetchCategoryTitlesRequest());
  } catch (err) {
    yield put(addCategoryTitleFailure(err.message));
  }
}

function* updateTitleSaga(action) {
  try {
    const { id, data } = action.payload;
    console.log("Updating category title with ID:", id, "Data:", data);
    const response = yield call(() => axios.put(`${BASE_URL}/${id}`, data));
    yield put(updateCategoryTitleSuccess(response.data));
    yield put(fetchCategoryTitlesRequest());
  } catch (err) {
    yield put(updateCategoryTitleFailure(err.message));
  }
}

function* deleteTitleSaga(action) {
  try {
    yield call(() => axios.delete(`${BASE_URL}/${action.payload}`));
    yield put(deleteCategoryTitleSuccess(action.payload));
  } catch (err) {
    yield put(deleteCategoryTitleFailure(err.message));
  }
}

export default function* categoryTitleSaga() {
  yield all([
    takeLatest(FETCH_CATEGORY_TITLES_REQUEST, fetchTitlesSaga),
    takeLatest(ADD_CATEGORY_TITLE_REQUEST, addTitleSaga),
    takeLatest(UPDATE_CATEGORY_TITLE_REQUEST, updateTitleSaga),
    takeLatest(DELETE_CATEGORY_TITLE_REQUEST, deleteTitleSaga),
  ]);
}