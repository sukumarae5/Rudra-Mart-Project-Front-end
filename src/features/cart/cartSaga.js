// Cart Saga
import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { fetchApiCartDataSuccess, fetchApiCartDataFailure } from '../cart/cartActions';
import { FETCH_API_CART_DATA_REQUEST } from '../cart/cartActions';




function* fetchCartDataSaga() {
  try {
    const userToken = localStorage.getItem("authToken");
    if (!userToken) throw new Error("User is not authorized. Token is missing.");

    const response = yield call(axios.get, "http://192.168.1.12:3000/api/all  ", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log("Fetched Cart Data:", response.data); // Debugging log
    yield put(fetchApiCartDataSuccess(response.data));
  } catch (error) {
    console.error("Cart Data Fetch Error:", error.message); // Debugging log
    yield put(fetchApiCartDataFailure(error.message));
  }
}

export default function* cartSaga() {
  yield takeEvery(FETCH_API_CART_DATA_REQUEST, fetchCartDataSaga);
}
