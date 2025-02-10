export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_PRODUCT_QUANTITY = "UPDATE_CART_PRODUCT_QUANTITY";
export const SYNC_CART_DATA_SUCCESS = "SYNC_CART_DATA_SUCCESS";
export const SYNC_CART_DATA_FAILURE = "SYNC_CART_DATA_FAILURE";

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const updateCartProductQuantity = (productId, quantity) => ({
  type: UPDATE_CART_PRODUCT_QUANTITY,
  payload: { productId, quantity },
});

export const syncCartDataSuccess = (products) => ({
  type: SYNC_CART_DATA_SUCCESS,
  payload: { products },
});

export const syncCartDataFailure = (error) => ({
  type: SYNC_CART_DATA_FAILURE,
  payload: error,
});
