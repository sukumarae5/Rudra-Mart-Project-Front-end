// src/redux/rootSaga.js
import { all } from 'redux-saga/effects';
import productSaga from '../features/product/productSaga'; // Correct way to import default export
import userSaga from '../features/user/userSaga';
import orderSaga from '../features/order/orderSaga';
import { watchCartSaga } from "../features/cart/cartSaga"; // ✅ Correct Import

function* rootSaga() {
  yield all([productSaga(),userSaga(),orderSaga(),watchCartSaga()]); // Call productSaga as a function
}
export default rootSaga;