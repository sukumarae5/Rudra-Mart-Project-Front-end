// Action Types
export const FETCH_API_CART_DATA_REQUEST = "FETCH_API_CART_DATA_REQUEST";
export const FETCH_API_CART_DATA_SUCCESS = "FETCH_API_CART_DATA_SUCCESS";
export const FETCH_API_CART_DATA_FAILURE = "FETCH_API_CART_DATA_FAILURE";

export const REMOVE_CART_ITEM_REQUEST = "REMOVE_CART_ITEM_REQUEST";
export const REMOVE_CART_ITEM_SUCCESS = "REMOVE_CART_ITEM_SUCCESS";
export const REMOVE_CART_ITEM_FAILURE = "REMOVE_CART_ITEM_FAILURE";

export const UPDATE_CART_ITEM_QUANTITY_REQUEST = "UPDATE_CART_ITEM_QUANTITY_REQUEST";
export const UPDATE_CART_ITEM_QUANTITY_SUCCESS = "UPDATE_CART_ITEM_QUANTITY_SUCCESS";
export const UPDATE_CART_ITEM_QUANTITY_FAILURE = "UPDATE_CART_ITEM_QUANTITY_FAILURE";

export const FETCH_CHECKEOUTPAGE_DATA="FETCH_CHECKEOUTPAGE_DATA"
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const DECREASE_QUANTITY ="DECREASE_QUANTITY"
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
// Fetch Cart Data Actions
export const fetchApiCartDataRequest = () => ({
  type: FETCH_API_CART_DATA_REQUEST,
});
export const fetchApiCartDataSuccess = (cartData) => ({
  type: FETCH_API_CART_DATA_SUCCESS,
  payload: cartData,
});
export const fetchApiCartDataFailure = (error) => ({
  type: FETCH_API_CART_DATA_FAILURE,
  payload: error,
});
export const removeCartItemRequest = (cartItemId) => ({
  type: REMOVE_CART_ITEM_REQUEST,
  payload: cartItemId,
});
export const removeCartItemSuccess = (cartItemId) => ({
  type: REMOVE_CART_ITEM_SUCCESS,
  payload: cartItemId,
});
export const removeCartItemFailure = (error) => ({
  type: REMOVE_CART_ITEM_FAILURE,
  payload: error,
});
export const updateCartItemQuantityRequest = (cartItemId, quantity) => {
  console.log("Updating Cart Item:", cartItemId, "Quantity:", quantity);
  return {
    type: UPDATE_CART_ITEM_QUANTITY_REQUEST,
    payload: { cartItemId, quantity },
  };
};
export const updateCartItemQuantitySuccess = (cartItemId, quantity) => ({
  type: UPDATE_CART_ITEM_QUANTITY_SUCCESS,
  payload: { cartItemId, quantity },
});
export const updateCartItemQuantityFailure = (error) => ({
  type: UPDATE_CART_ITEM_QUANTITY_FAILURE,
  payload: error,
});
export const fetcheckeoutpagedata=(Checkoutdata)=>({
  type:FETCH_CHECKEOUTPAGE_DATA,
  payload:Checkoutdata,
})
export const increaseQuantity = (productId) => ({

  type:INCREASE_QUANTITY,
  payload:{productId},
})
export const decreaseQuantity=(productId)=>({
  type:DECREASE_QUANTITY,
  payload:{productId}
})
export const removeProduct = (productId) => ({
  type: REMOVE_PRODUCT,
  payload: productId,
});