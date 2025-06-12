import { takeEvery, call, put } from "redux-saga/effects";
import {
  FETCH_PRODUCTS_CATEGORY_REQUEST,
  fetchProductCategoryFailure,
  fetchProductCategorySuccess,
} from "../categories/categoriesAction";

// API function
const categorydata = async () => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/categories/categories`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    throw error;
  }
};

// Worker saga
function* productcategory() {
  try {
    const productcategorydata = yield call(categorydata);
    console.log("Saga fetched category data:", productcategorydata); // ✅ Good for debugging
    yield put(fetchProductCategorySuccess(productcategorydata));
  } catch (error) {
    yield put(fetchProductCategoryFailure(error.message));
  }
}

// Watcher saga
export default function* categorySaga() {
  yield takeEvery(FETCH_PRODUCTS_CATEGORY_REQUEST, productcategory);
}