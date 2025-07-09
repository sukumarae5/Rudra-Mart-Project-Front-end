import { takeEvery, call, put } from "redux-saga/effects";
import {
  FETCH_PRODUCTS_CATEGORY_REQUEST,
  ADD_CATEGORY_REQUEST, 
  fetchProductCategoryFailure,
  fetchProductCategorySuccess,
  addCategorySuccess,
  addCategoryFailure,
  FETCH_CATEGORY_BY_ID_REQUEST,
  fetchCategoryByIdSuccess,
  fetchCategoryByIdFailure,
  UPDATE_CATEGORY_REQUEST,
  updateCategorySuccess,
  updateCategoryFailure,
  DELETE_CATEGORY_REQUEST,
  deleteCategorySuccess,
  deleteCategoryFailure,
  
} from "../categories/categoriesAction";

// API URLs
const PRODUCT_CATEGORY_API = `http://${process.env.REACT_APP_IP_ADDRESS}/api/categories/categories`;

// Worker Sagas
function* productcategory() {
  try {
    const res = yield call(() => fetch(PRODUCT_CATEGORY_API));
    const data = yield res.json();
    yield put(fetchProductCategorySuccess(data));
  } catch (error) {
    yield put(fetchProductCategoryFailure(error.message));
  }
}
function* addCategory({ payload }) {
  try {
    console.log("Sending category payload:", payload); // <-- add this
    const res = yield call(() =>
      fetch(PRODUCT_CATEGORY_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
    );

    yield put(addCategorySuccess(res));
  } catch (error) {
    console.error('Add category failed:', error);
    yield put(addCategoryFailure(error.message));
  }
}

function* fetchCategoryById({ payload: id }) {
  try {
    const res = yield call(() => fetch(`${PRODUCT_CATEGORY_API}/${id}`));
    const data = yield res.json();
    yield put(fetchCategoryByIdSuccess(data));
  } catch (err) {
    yield put(fetchCategoryByIdFailure(err.message));
  }
}

// Update Category
function* updateCategory({ payload }) {
  const { id, data } = payload;
  try {
    const res = yield call(() =>
      fetch(`${PRODUCT_CATEGORY_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    );
    if (!res.ok) throw new Error("Failed to update category");
    yield put(updateCategorySuccess());
  } catch (err) {
    yield put(updateCategoryFailure(err.message));
  }
}

function* deleteCategorySaga({ payload: id }) {
  try {
    const res = yield call(() =>
      fetch(`${PRODUCT_CATEGORY_API}/${id}`, {
        method: "DELETE",
      })
    );
    if (!res.ok) {
      throw new Error("Failed to delete category");
    }
    yield put(deleteCategorySuccess(id));
  } catch (error) {
    yield put(deleteCategoryFailure(error.message));
  }
}

// Watcher Saga
export default function* categorySaga() {
  yield takeEvery(FETCH_PRODUCTS_CATEGORY_REQUEST, productcategory);
  yield takeEvery(ADD_CATEGORY_REQUEST, addCategory);
  yield takeEvery(FETCH_CATEGORY_BY_ID_REQUEST, fetchCategoryById);
  yield takeEvery(UPDATE_CATEGORY_REQUEST, updateCategory);
  yield takeEvery(DELETE_CATEGORY_REQUEST, deleteCategorySaga);

}
