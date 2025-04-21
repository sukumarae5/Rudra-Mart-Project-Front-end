import { call, put, takeEvery } from "redux-saga/effects";
import {FETCH_WISHLIST_REQUEST, FETCH_WISHLIST_SUCCESS, FETCH_WISHLIST_FAILURE, 
  ADD_TO_WISHLIST_REQUEST, ADD_TO_WISHLIST_SUCCESS, ADD_TO_WISHLIST_FAILURE, 
  REMOVE_WISHLIST_PRODUCT_REQUEST, REMOVE_WISHLIST_PRODUCT_SUCCESS, REMOVE_WISHLIST_PRODUCT_FAILURE
} from "../wishlist/wishlistAction";
// Fetch Wishlist API
const fetchWishlistApi = async () => {
  const userToken = localStorage.getItem("authToken");
  if (!userToken) throw new Error("User token not found!");

  const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/wishlist/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

// Add to Wishlist API
const addToWishlistApi = async (productid) => {
  const userToken = localStorage.getItem("authToken");
  if (!userToken) throw new Error("User token not found!");

  const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/wishlist/additem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({ productid }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

// Delete Wishlist Item API
const deleteItemApi = async (wishlistid) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/wishlist/${wishlistid}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

};

// Fetch Wishlist Saga
function* fetchWishlistSaga() {
  try {
    const wishlist = yield call(fetchWishlistApi);
    yield put({ type: FETCH_WISHLIST_SUCCESS, payload: wishlist });
  } catch (error) {
    yield put({ type: FETCH_WISHLIST_FAILURE, payload: error.message });
  }
}

// Add to Wishlist Saga
function* addToWishlistSaga(action) {
  try {
    const { productid } = action.payload;
    const wishlistItem = yield call(addToWishlistApi, productid);
    yield put({ type: ADD_TO_WISHLIST_SUCCESS, payload: wishlistItem });
    yield call(fetchWishlistSaga);
  } catch (error) {
    yield put({ type: ADD_TO_WISHLIST_FAILURE, payload: error.message });
  }
}

// Remove Wishlist Product Saga
function* removeWishlistProductSaga(action) {
  try {
    const { wishlistid } = action.payload;
    yield call(deleteItemApi, wishlistid);
    yield put({ type: REMOVE_WISHLIST_PRODUCT_SUCCESS, payload: wishlistid });
    yield call(fetchWishlistSaga);
  } catch (error) {
    yield put({ type: REMOVE_WISHLIST_PRODUCT_FAILURE, payload: error.message });
  }
}

// Watcher Saga
export default function* wishlistSaga() {
  yield takeEvery(FETCH_WISHLIST_REQUEST, fetchWishlistSaga);
  yield takeEvery(ADD_TO_WISHLIST_REQUEST, addToWishlistSaga);
  yield takeEvery(REMOVE_WISHLIST_PRODUCT_REQUEST, removeWishlistProductSaga);
}
