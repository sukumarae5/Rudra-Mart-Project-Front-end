import { takeEvery, call, put } from 'redux-saga/effects';
import { FETCH_PRODUCTS_REQUEST } from '../product/productActions';
import { fetchproductssuccess, fetchproductsfailure } from '../product/productActions';

const fetchTheApi = async () => {
  try {
    const response = await fetch('http://192.168.1.12:8081/api/products/allproducts', {
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


// Saga to handle fetching the products
function* fetchProductSaga() {
  try {
    // Call the fetch function
    const products = yield call(fetchTheApi);
    
    // Dispatch the success action with the fetched products
    yield put(fetchproductssuccess(products));
  } catch (error) {
    // Dispatch failure action with error message if fetching fails
    yield put(fetchproductsfailure(error.message));
  }
}

export default function* productSaga() {
  yield takeEvery(FETCH_PRODUCTS_REQUEST, fetchProductSaga);
}