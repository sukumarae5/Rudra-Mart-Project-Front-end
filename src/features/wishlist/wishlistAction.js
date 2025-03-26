// Action Types
export const FETCH_WISHLIST_REQUEST = "FETCH_WISHLIST_REQUEST";
export const FETCH_WISHLIST_SUCCESS = "FETCH_WISHLIST_SUCCESS";
export const FETCH_WISHLIST_FAILURE = "FETCH_WISHLIST_FAILURE";

export const ADD_TO_WISHLIST_REQUEST = "ADD_TO_WISHLIST_REQUEST";
export const ADD_TO_WISHLIST_SUCCESS = "ADD_TO_WISHLIST_SUCCESS";
export const ADD_TO_WISHLIST_FAILURE = "ADD_TO_WISHLIST_FAILURE";

export const REMOVE_WISHLIST_PRODUCT_REQUEST = "REMOVE_WISHLIST_PRODUCT_REQUEST";
export const REMOVE_WISHLIST_PRODUCT_SUCCESS = "REMOVE_WISHLIST_PRODUCT_SUCCESS";
export const REMOVE_WISHLIST_PRODUCT_FAILURE = "REMOVE_WISHLIST_PRODUCT_FAILURE";

// Fetch Wishlist Actions
export const fetchWishlistRequest = () => ({ type: FETCH_WISHLIST_REQUEST });
export const fetchWishlistSuccess = (wishlist) => ({ type: FETCH_WISHLIST_SUCCESS, payload: wishlist });
export const fetchWishlistFailure = (error) => ({ type: FETCH_WISHLIST_FAILURE, payload: error });

// Add to Wishlist Actions
export const addToWishlistRequest = (productid) => ({
  type: ADD_TO_WISHLIST_REQUEST,
  payload: { productid },
});
export const addToWishlistSuccess = (wishlistItem) => ({ 
  type: ADD_TO_WISHLIST_SUCCESS, 
  payload: wishlistItem });
export const addToWishlistFailure = (error) => ({ 
  type: ADD_TO_WISHLIST_FAILURE, 
  payload: error });

// Remove Wishlist Product Actions
export const removeWishlistProductRequest = (wishlistid) => ({
  type: REMOVE_WISHLIST_PRODUCT_REQUEST,
  payload: { wishlistid },
});
export const removeWishlistProductSuccess = (wishlistid) => ({ type: REMOVE_WISHLIST_PRODUCT_SUCCESS, payload: wishlistid });
export const removeWishlistProductFailure = (error) => ({ type: REMOVE_WISHLIST_PRODUCT_FAILURE, payload: error });
