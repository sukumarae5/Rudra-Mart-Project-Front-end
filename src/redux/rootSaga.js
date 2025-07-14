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
import subcategorySaga from '../features/subcategories/subcategorySaga';
import bannerSaga from '../features/banners/bannerSaga';
import deliverySaga from '../features/delivery/deliverySaga';
import deliveryBoySaga from '../features/deliveryboydetails/deliveryBoySaga';
import categoryTitleSaga from '../features/categorytitle/categorySaga';

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
    subcategorySaga(),
    bannerSaga(),
    deliverySaga(),
    deliveryBoySaga(),
    categoryTitleSaga(),   
      
  ]);
}

export default rootSaga;