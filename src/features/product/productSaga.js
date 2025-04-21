import { takeEvery, call, put } from 'redux-saga/effects';
import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_WITH_CATEGORY_REQUEST, fetchProductsWithCategoryFailure, fetchProductsWithCategorySuccess } from '../product/productActions';
import { fetchproductssuccess, fetchproductsfailure } from '../product/productActions';

const fetchTheApi = async () => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/products/allproducts`, {
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

function* fetchProductsWithCategorySaga() {
  try {
    const response = yield call(fetch, `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/products`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = yield response.json();

    yield put(fetchProductsWithCategorySuccess(data.products));
  } catch (error) {
    yield put(fetchProductsWithCategoryFailure(error.message));
  }
}


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
  yield takeEvery(FETCH_PRODUCTS_WITH_CATEGORY_REQUEST, fetchProductsWithCategorySaga);


}