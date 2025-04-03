// src/redux/rootSaga.js
import { all } from 'redux-saga/effects';
import productSaga from '../features/product/productSaga'; // Correct way to import default export
import userSaga from '../features/user/userSaga';
import orderSaga from '../features/order/orderSaga';

import { watchCartSaga } from "../features/cart/cartSaga"; // ✅ Correct Import
import addressSaga  from '../features/address/addressSaga';
import wishlistSaga from '../features/wishlist/wishlistSaga';
import dashboardSaga from '../features/admin/adminSaga';
function* rootSaga() {
  yield all([productSaga(),wishlistSaga(),userSaga(),orderSaga(),watchCartSaga(),addressSaga(),dashboardSaga()]); // Call productSaga as a function
}
export default rootSaga;