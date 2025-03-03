import { takeLatest, call, put } from "redux-saga/effects";
import {
  FETCH_API_CART_DATA_REQUEST,
  FETCH_API_CART_DATA_SUCCESS,
  FETCH_API_CART_DATA_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_QUANTITY_REQUEST,
  UPDATE_CART_ITEM_QUANTITY_SUCCESS,
  UPDATE_CART_ITEM_QUANTITY_FAILURE,
} from "../cart/cartActions";

// Function to fetch cart data from API
const fetchCartDataApi = async () => {
  const userToken = localStorage.getItem("authToken");
  if (!userToken) throw new Error("User not authenticated. Please log in.");

  const response = await fetch("http://192.168.1.2:8081/api/cart/my-cart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart data");
  }

  return response.json();
};

// Worker Saga for Fetching Cart Data
function* fetchCartDataSaga() {
  try {
    const cartData = yield call(fetchCartDataApi);
    yield put({ type: FETCH_API_CART_DATA_SUCCESS, payload: cartData });
  } catch (error) {
    yield put({ type: FETCH_API_CART_DATA_FAILURE, payload: error.message });
  }
}

// Function to remove a cart item via API
const removeCartItemApi = async (cartItemId) => {
  const userToken = localStorage.getItem("authToken");
  if (!userToken) throw new Error("User not authenticated. Please log in.");

  const response = await fetch(`http://192.168.1.2:8081/api/cart/${cartItemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to remove item: ${errorData.message || "Unknown error"}`);
  }

  return cartItemId; // Returning the removed item ID
};

// Worker Saga for Removing Cart Item
function* removeCartItemSaga(action) {
  try {
    const cartItemId = yield call(removeCartItemApi, action.payload);
    yield put({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartItemId });
  } catch (error) {
    yield put({ type: REMOVE_CART_ITEM_FAILURE, payload: error.message });
  }
}

// Function to update cart item quantity via API
const updateCartItemQuantityApi = async ({cartItemId, quantity }) => {
  const userToken = localStorage.getItem("authToken");
  if (!userToken) throw new Error("User not authenticated. Please log in.");

  if (!cartItemId) {
    throw new Error("Invalid Cart Item ID");
  }

  const response = await fetch(`http://192.168.1.2:8081/api/cart/update/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,    
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update quantity: ${errorData.message || "Unknown error"}`);
  }

  return { cartItemId, quantity };
};

// Worker Saga for Updating Cart Item Quantity
function* updateCartItemQuantitySaga(action) {
  try {
    console.log("Updating Cart Item:", action.payload);

    const { cartItemId, quantity } = action.payload;

    if (!cartItemId) {
      throw new Error("Cart item ID is missing");
    }

    const updatedItem = yield call(updateCartItemQuantityApi, { cartItemId, quantity });

    console.log("API Response:", updatedItem);

    yield put({ type: UPDATE_CART_ITEM_QUANTITY_SUCCESS, payload: updatedItem });
  } catch (error) {
    console.error("Update Cart Error:", error.message);
    yield put({ type: UPDATE_CART_ITEM_QUANTITY_FAILURE, payload: error.message });
  }
}

// Watcher Saga for Cart Actions
export function* watchCartSaga() {
  yield takeLatest(FETCH_API_CART_DATA_REQUEST, fetchCartDataSaga);
  yield takeLatest(REMOVE_CART_ITEM_REQUEST, removeCartItemSaga);
  yield takeLatest(UPDATE_CART_ITEM_QUANTITY_REQUEST, updateCartItemQuantitySaga);
}
