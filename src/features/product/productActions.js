// Action Types
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const GET_SEARCH_PRODUCT='GET_SEARCH_PRODUCT'
export const REMOVE_FROM_WISHLIST = "REMOVE_FROM_WISHLIST";
export const SET_SELECTED_PRODUCT='SET_SELECTED_PRODUCT' 
export const ADD_TO_WISHlIST="ADD_TO_WISHlIST"
export const FETCH_PRODUCTS_WITH_CATEGORY_REQUEST = 'FETCH_PRODUCTS_WITH_CATEGORY_REQUEST';
export const FETCH_PRODUCTS_WITH_CATEGORY_SUCCESS = 'FETCH_PRODUCTS_WITH_CATEGORY_SUCCESS';
export const FETCH_PRODUCTS_WITH_CATEGORY_FAILURE = 'FETCH_PRODUCTS_WITH_CATEGORY_FAILURE';


// Action Creators
export const fetchproductsrequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchproductssuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchproductsfailure = (error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const searchquryproduct=(searchproduct)=>({
  type:GET_SEARCH_PRODUCT,
  payload:searchproduct,
})

export const setSelectedProduct = (selectedProduct) => {
  return {
    
    type: 'SET_SELECTED_PRODUCT',
    payload: selectedProduct,
  };
};
export const addToWishlist=(addToWishlist)=>{
  return{
    type:"ADD_TO_WISHlIST",
    payload:addToWishlist,
  };
}

export const fetchProductsWithCategoryRequest = () => ({
  type: FETCH_PRODUCTS_WITH_CATEGORY_REQUEST,
});

export const fetchProductsWithCategorySuccess = (data) => ({
  type: FETCH_PRODUCTS_WITH_CATEGORY_SUCCESS,
  payload: data,
});

export const fetchProductsWithCategoryFailure = (error) => ({
  type: FETCH_PRODUCTS_WITH_CATEGORY_FAILURE,
  payload: error,
});

