import { takeEvery, call, put } from "redux-saga/effects";
import { FETCH_ORDERS_REQUEST, fetchOrdersSuccess, fetchOrdersFailure } from "./orderActions";

// Function to fetch orders from API without authentication
const fetchOrdersApi = async () => {
  try {
    const response = await fetch("http://192.168.1.2:8081/api/orders/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.orders; // Assuming API returns { orders: [...] }
  } catch (error) {
    throw new Error("Failed to fetch orders: " + error.message);
  }
};

// Saga to handle fetching orders
function* fetchOrderSaga() {
  try {
    const orders = yield call(fetchOrdersApi);
    yield put(fetchOrdersSuccess(orders));
  } catch (error) {
    yield put(fetchOrdersFailure(error.message));
  }
}

// Root saga to listen for FETCH_ORDERS_REQUEST action
export default function* orderSaga() {
  yield takeEvery(FETCH_ORDERS_REQUEST, fetchOrderSaga);
}
