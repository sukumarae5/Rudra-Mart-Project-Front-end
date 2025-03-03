import { combineReducers } from 'redux';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/user/userSlice';
import orderSlice from '../features/order/orderSlice';
import {addressReducer}  from '../features/address/addressSlice';

const rootReducer = combineReducers({
  products: productReducer,
  users: userReducer,
  cart: cartReducer,
  orders: orderSlice,
  address: addressReducer
   // Add orders reducer
});

export default rootReducer;
