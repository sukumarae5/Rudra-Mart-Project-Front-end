import { call, takeEvery, put } from "redux-saga/effects";
import {
  FETCH_API_CART_DATA_REQUEST,
  fetchApiCartDataSuccess,
  fetchApiCartDataFailure,
} from "../cart/cartActions";

const fetchCartDataApi = async () => {
  const userToken = localStorage.getItem("authToken");

  if (!userToken) {
    console.error("User token is missing!"); 
    throw new Error("User is not authorized.");
  }

  const apiUrl = "http://192.168.1.12:3000/api/cart/my-cart"; 
  console.log("Fetching cart data from:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`

      },
    });

    console.log("API Response Status:", response.status);

    if (response.status === 404) {
      throw new Error("Cart API route not found. Check the backend.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Fetch Error:", errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch Cart Data Error:", error.message);
    throw error;
  }
};

function* fetchCartDataSaga() {
  try {
    const cartData = yield call(fetchCartDataApi);
    console.log("Fetched Cart Data:", cartData);
    yield put(fetchApiCartDataSuccess(cartData)); 
  } catch (error) {
    console.error("Cart Data Fetch Error:", error.message);
    yield put(fetchApiCartDataFailure(error.message)); 
  }
}

export default function* cartSaga() {
  yield takeEvery(FETCH_API_CART_DATA_REQUEST, fetchCartDataSaga);
}
