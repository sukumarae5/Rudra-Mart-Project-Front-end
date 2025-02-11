import { call, takeEvery, put } from "redux-saga/effects";
import {
  FETCH_API_CART_DATA_REQUEST,
  fetchApiCartDataSuccess,
  fetchApiCartDataFailure,
} from "../cart/cartActions";

const fetchCartDataApi = async () => {
  const userToken = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

  if (!userToken) {
    throw new Error("User is not authorized. Token is missing ...");
  }

  const response = await fetch("http://192.168.1.12:3000/api/my-cart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
  }

  return response.json();
};

function* fetchCartDataSaga() {
  try {
    const cartData = yield call(fetchCartDataApi);
    console.log("Fetched Cart Data:", cartData); // Debugging log
    yield put(fetchApiCartDataSuccess(cartData));
  } catch (error) {
    console.error("Cart Data Fetch Error:", error.message);
    yield put(fetchApiCartDataFailure(error.message));
  }
}

export default function* cartSaga() {
  yield takeEvery(FETCH_API_CART_DATA_REQUEST, fetchCartDataSaga);
}
