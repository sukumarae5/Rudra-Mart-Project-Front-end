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
export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';
// Fetch single product
export const FETCH_PRODUCT_REQUEST = "FETCH_PRODUCT_REQUEST";
export const FETCH_PRODUCT_SUCCESS = "FETCH_PRODUCT_SUCCESS";
export const FETCH_PRODUCT_FAILURE = "FETCH_PRODUCT_FAILURE";

// Update product
export const UPDATE_PRODUCT_REQUEST = "UPDATE_PRODUCT_REQUEST";
export const UPDATE_PRODUCT_SUCCESS = "UPDATE_PRODUCT_SUCCESS";
export const UPDATE_PRODUCT_FAILURE = "UPDATE_PRODUCT_FAILURE";

export const DELETE_PRODUCT_REQUEST = "DELETE_PRODUCT_REQUEST";
export const DELETE_PRODUCT_SUCCESS = "DELETE_PRODUCT_SUCCESS";
export const DELETE_PRODUCT_FAILURE = "DELETE_PRODUCT_FAILURE";

export const RESET_PRODUCT_STATUS = "RESET_PRODUCT_STATUS";

export const resetProductStatus = () => ({
  type: RESET_PRODUCT_STATUS,
});


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

export const createProductRequest = (productData) => ({
  type: CREATE_PRODUCT_REQUEST,
  payload: productData,
});

export const createProductSuccess = (message) => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: message,
});

export const createProductFailure = (error) => ({
  type: CREATE_PRODUCT_FAILURE,
  payload: error,
});

// Fetch product by ID
export const fetchProductRequest = (id) => ({
  type: FETCH_PRODUCT_REQUEST,
  payload: id,
});

export const fetchProductSuccess = (product) => ({
  type: FETCH_PRODUCT_SUCCESS,
  payload: product,
});

export const fetchProductFailure = (error) => ({
  type: FETCH_PRODUCT_FAILURE,
  payload: error,
});

export const updateProductRequest = (id, data) => ({
  type: "UPDATE_PRODUCT_REQUEST",
  payload: { id, data },
});

export const updateProductSuccess = (updatedProduct) => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: updatedProduct,
});

export const updateProductFailure = (error) => ({
  type: UPDATE_PRODUCT_FAILURE,
  payload: error,
});

export const deleteProductRequest = (productId) => ({
  type: DELETE_PRODUCT_REQUEST,
  payload: productId,
});

export const deleteProductSuccess = (productId) => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: productId,
});

export const deleteProductFailure = (error) => ({
  type: DELETE_PRODUCT_FAILURE,
  payload: error,
});
