import { combineReducers } from 'redux';

import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/user/userSlice';
import { addressReducer } from '../features/address/addressSlice';
import orderReducer from '../features/order/orderSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import dashboardReducer from '../features/admin/adminSlice';
import categoryProductReducer from '../features/categories/categorieSlice'; // renamed for camelCase
import subcategoryReducer from '../features/subcategories/subcategorySlice';
import bannerReducer from '../features/banners/bannerSlice';
import deliveryReducer from '../features/delivery/deliverySlice';
import deliveryBoyReducer from '../features/deliveryboydetails/deliveryBoySlice';
import categoryTitleReducer from '../features/categorytitle/categorySlice';

const rootReducer = combineReducers({
  products: productReducer,
  users: userReducer,
  cart: cartReducer,
  orders: orderReducer,
  address: addressReducer,
  wishlist: wishlistReducer,
  admindashboard: dashboardReducer,
  categoryproducts: categoryProductReducer,
  subcategory:subcategoryReducer,
  banners : bannerReducer,
  delivery: deliveryReducer,
  deliveryBoy: deliveryBoyReducer,
    categorytitle: categoryTitleReducer, 

});

export default rootReducer;