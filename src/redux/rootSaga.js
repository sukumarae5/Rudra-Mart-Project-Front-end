// src/redux/rootSaga.js
import { all } from 'redux-saga/effects';
import productSaga from '../features/product/productSaga';
import userSaga from '../features/user/userSaga';
import orderSaga from '../features/order/orderSaga';
import categorySaga from '../features/categories/categorieSaga';
import { watchCartSaga } from "../features/cart/cartSaga";
import addressSaga from '../features/address/addressSaga';
import wishlistSaga from '../features/wishlist/wishlistSaga';
import dashboardSaga from '../features/admin/adminSaga';

function* rootSaga() {
  yield all([
    productSaga(),
    wishlistSaga(),
    userSaga(),
    orderSaga(),
    watchCartSaga(),
    addressSaga(),
    dashboardSaga(),
    categorySaga(), 
  ]);
}

export default rootSaga;