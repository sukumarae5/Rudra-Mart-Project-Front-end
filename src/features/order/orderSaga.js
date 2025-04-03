import { takeEvery, call, put } from "redux-saga/effects";
import {
  FETCH_ORDERS_REQUEST,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchUserOrderSuccess,
  FETCH_USER_ORDER_REQUEST,
  fetchUserOrderFailure,
} from "./orderActions";

// Function to fetch orders from API
const fetchOrdersApi = async () => {
  try {
    const response = await fetch("http://192.168.1.25:8081/api/orders/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Ensure API returns { data: [...] }
  } catch (error) {
    throw new Error("Failed to fetch orders: " + error.message);
  }
};

const fetchUserOrder = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    console.error("User not found in localStorage");
    return;
  }

  const userToken = localStorage.getItem("authToken");

  if (!userToken) {
    console.error("No auth token found in localStorage");
    return;
  }

  try {
    const response = await fetch(`http://192.168.1.25:8081/api/orders/user-orders/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`, // ✅ Fixed Template String Issue
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching user orders:", errorData.message);
      return;
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
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

function*fetchUserSaga(){
  try {
    const uerorder=yield call(fetchUserOrder);
    yield put(fetchUserOrderSuccess(uerorder))
    
  } catch (error) {
yield put(fetchUserOrderFailure(error.message))    
  }
}
// Root saga to listen for FETCH_ORDERS_REQUEST action
export default function* orderSaga() {
  yield takeEvery(FETCH_ORDERS_REQUEST, fetchOrderSaga);
  yield takeEvery(FETCH_USER_ORDER_REQUEST,fetchUserSaga)
}
