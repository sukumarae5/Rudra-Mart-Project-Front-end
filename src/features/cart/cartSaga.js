import { call, put, takeLatest } from "redux-saga/effects";
import {
  FETCH_CART_PRODUCT_REQUEST,
  fetchCartProductSuccess,
} from "./cartActions";
const fetchTheApi = async () => {
    try {
      const response = await fetch('http://192.168.1.6:3000/api/products/allproducts', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with your actual token
          'Content-Type': 'application/json',
        },
      });
         if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.products;  // Assuming the API response contains a 'products' array
    } catch (error) {
      throw new Error('Failed to fetch products: ' + error.message);  // Additional error handling
    }
  };
  

// Worker Saga: Fetch Cart Products
function* fetchCartProductsSaga() {
  try {
    const response = yield call(fetchTheApi); // Replace this with your API
    yield put(fetchCartProductSuccess(response.data));
  } catch (error) {
    console.error("Error fetching cart products:", error);
  }
}

export default function* cartSaga() {
  yield takeLatest(FETCH_CART_PRODUCT_REQUEST, fetchCartProductsSaga);
}
