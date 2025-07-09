import { takeEvery, call, put } from "redux-saga/effects";
import {
  FETCH_SUBCATEGORY_REQUEST,
  ADD_SUBCATEGORY_REQUEST,
  fetchSubcategorySuccess,
  fetchSubcategoryFailure,
  addSubcategorySuccess,
  addSubcategoryFailure,
  FETCH_CATEGORIES_REQUEST,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  FETCH_SUBCATEGORY_BY_ID_REQUEST,
  fetchSubcategoryByIdSuccess,
  fetchSubcategoryByIdFailure,
  UPDATE_SUBCATEGORY_REQUEST,
  updateSubcategorySuccess,
  updateSubcategoryFailure,
   deleteSubcategorySuccess,
  deleteSubcategoryFailure,
  DELETE_SUBCATEGORY_REQUEST,
} from "../subcategories/subcategoryAction";

const BASE_URL = `http://${process.env.REACT_APP_IP_ADDRESS}/api`;

// API Calls
const fetchSubcategoryAPI = () =>
  fetch(`${BASE_URL}/subcategory/subcategories`).then((res) => res.json());
const fetchCategoriesAPI = () =>
  fetch(`${BASE_URL}/categories/categories`).then((res) => res.json());
const addSubcategoryAPI = (payload) =>
  fetch(`${BASE_URL}/subcategory/subcategories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to add subcategory");
    return res.json();
  });

function* fetchSubcategoryById({ payload: id }) {
  try {
    const res = yield call(() => fetch(`${BASE_URL}/subcategory/subcategories/${id}`));
    const data = yield res.json();
    yield put(fetchSubcategoryByIdSuccess(data));
  } catch (err) {
    yield put(fetchSubcategoryByIdFailure(err.message));
  }
}

function* updateSubcategory({ payload }) {
  const { id, data } = payload;
  try {
    const res = yield call(() =>
      fetch(`${BASE_URL}/subcategory/subcategories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    );
    if (!res.ok) throw new Error("Failed to update subcategory");
    yield put(updateSubcategorySuccess());
  } catch (err) {
    yield put(updateSubcategoryFailure(err.message));
  }
}

// Workers
function* fetchSubcategories() {
  try {
    const data = yield call(fetchSubcategoryAPI);
    console.log(data);
    yield put(fetchSubcategorySuccess(data));
  } catch (error) {
    yield put(fetchSubcategoryFailure(error.message));
  }
}

function* fetchCategories() {
  try {
    const data = yield call(fetchCategoriesAPI);
    yield put(fetchCategoriesSuccess(data));
  } catch (error) {
    yield put(fetchCategoriesFailure(error.message));
  }
}

function* addSubcategory({ payload }) {
  try {
    const result = yield call(addSubcategoryAPI, payload);
    yield put(addSubcategorySuccess(result));
  } catch (error) {
    yield put(addSubcategoryFailure(error.message));
  }
}

function* deleteSubcategorySaga({ payload: id }) {
  try {
    const res = yield call(() =>
      fetch(`${BASE_URL}/subcategory/subcategories/${id}`, {
        method: "DELETE",
      })
    );

    if (!res.ok) {
      throw new Error("Failed to delete subcategory");
    }

    yield put(deleteSubcategorySuccess(id));
  } catch (error) {
    yield put(deleteSubcategoryFailure(error.message));
  }
}

// Watchers
export default function* subcategorySaga() {
  yield takeEvery(FETCH_SUBCATEGORY_REQUEST, fetchSubcategories);
  yield takeEvery(ADD_SUBCATEGORY_REQUEST, addSubcategory);
  yield takeEvery(FETCH_CATEGORIES_REQUEST, fetchCategories);
  yield takeEvery(FETCH_SUBCATEGORY_BY_ID_REQUEST, fetchSubcategoryById);
  yield takeEvery(UPDATE_SUBCATEGORY_REQUEST, updateSubcategory);
  yield takeEvery(DELETE_SUBCATEGORY_REQUEST, deleteSubcategorySaga);

}
