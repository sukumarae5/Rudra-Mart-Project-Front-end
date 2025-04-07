import { takeEvery, call, put } from "redux-saga/effects";
import {
  FETCH_BEST_SELLING_PRODUCTS_REQUEST,
  fetchBestSellingProductsSuccess,
  fetchBestSellingProductsFailure,
  FETCH_TOP_CUSTOMERS_REQUEST,
  fetchTopCustomersSuccess,
  fetchTopCustomersFailure,
} from "./adminActions";

const fetchBestSellingProductsApi = async () => { 
  try {
    const response = await fetch("http://192.168.1.12:8081/api/dashboard/products/best-selling");
    const data = await response.json();
    console.log("API Response:", data); // Debugging
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw new Error("Failed to fetch best-selling products");
  }
};


const fetchTopCustomersApi = async () => {
  const response = await fetch("http://192.168.1.12:8081/api/dashboard/customers/top");
  if (!response.ok) throw new Error("Failed to fetch top customers");
  const data = await response.json();
  return data;
};

function* fetchBestSellingProductsSaga() {
  try {
    const products = yield call(fetchBestSellingProductsApi);
    yield put(fetchBestSellingProductsSuccess(products));
  } catch (error) {
    yield put(fetchBestSellingProductsFailure(error.message));
  }
}

function* fetchTopCustomersSaga() {
  try {
    const customers = yield call(fetchTopCustomersApi);
    yield put(fetchTopCustomersSuccess(customers));
  } catch (error) {
    yield put(fetchTopCustomersFailure(error.message));
  }
}

export default function* dashboardSaga() {
  yield takeEvery(FETCH_BEST_SELLING_PRODUCTS_REQUEST, fetchBestSellingProductsSaga);
  yield takeEvery(FETCH_TOP_CUSTOMERS_REQUEST, fetchTopCustomersSaga);
}
