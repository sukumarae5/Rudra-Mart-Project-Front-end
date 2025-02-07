import { combineReducers } from 'redux';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/user/userSlice';
import orderSlice from '../features/order/orderSlice';

const rootReducer = combineReducers({
  products: productReducer,
  users: userReducer,
  cart: cartReducer,
  orders: orderSlice,
   // Add orders reducer
});

export default rootReducer;
