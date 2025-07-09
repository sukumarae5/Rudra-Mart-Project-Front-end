import { takeEvery, call, put } from "redux-saga/effects";
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_WITH_CATEGORY_REQUEST,
  fetchProductsWithCategoryFailure,
  fetchProductsWithCategorySuccess,
  CREATE_PRODUCT_REQUEST,
  createProductSuccess,
  createProductFailure,
  FETCH_PRODUCT_REQUEST,
  fetchProductSuccess,
  fetchProductFailure,
  UPDATE_PRODUCT_REQUEST,
  updateProductSuccess,
  updateProductFailure,
  DELETE_PRODUCT_REQUEST,
  deleteProductSuccess,
  deleteProductFailure,
} from "../product/productActions";
import axios from "axios";
import {
  fetchproductssuccess,
  fetchproductsfailure,
} from "../product/productActions";
import { deleteCategoryFailure, deleteCategorySuccess } from "../categories/categoriesAction";

const fetchTheApi = async () => {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/allproducts`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer YOUR_ACCESS_TOKEN", // Replace with your actual token
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.products; // Assuming the API response contains a 'products' array
  } catch (error) {
    throw new Error("Failed to fetch products: " + error.message); // Additional error handling
  }
};

function* fetchProductsWithCategorySaga() {
  try {
    const response = yield call(
      fetch,
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/products`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer YOUR_ACCESS_TOKEN",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = yield response.json();

    yield put(fetchProductsWithCategorySuccess(data.products));
  } catch (error) {
    yield put(fetchProductsWithCategoryFailure(error.message));
  }
}

// Saga to handle fetching the products
function* fetchProductSaga() {
  try {
    // Call the fetch function
    const products = yield call(fetchTheApi);

    // Dispatch the success action with the fetched products
    yield put(fetchproductssuccess(products));
  } catch (error) {
    // Dispatch failure action with error message if fetching fails
    yield put(fetchproductsfailure(error.message));
  }
}

function* createProductSaga(action) {
  try {
    const response = yield call(() =>
      fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(action.payload),
        }
      )
    );

    const data = yield response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add product");
    }

    yield put(
      createProductSuccess(data.message || "Product created successfully")
    );
  } catch (error) {
    yield put(createProductFailure(error.message));
  }
}

function* fetchProductByIdSaga(action) {
      console.log(action.payload)

  try {
    const response = yield call(
      fetch,
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/products/${action.payload}`
    );
    const data = yield response.json();
    console.log(data)
    if (response.ok) {
      yield put(fetchProductSuccess(data));
    } else {
      yield put(fetchProductFailure(data.error || "Failed to fetch product."));
    }
  } catch (error) {
    yield put(fetchProductFailure(error.message));
  }
}

function* updateProductSaga(action) {
  try {
    const { id, productData } = action.payload;
    console.log(action.payload)
    const response = yield call(
      fetch,
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/products/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }
    );

    const data = yield response.json();

    if (response.ok) {
      yield put(updateProductSuccess("Product updated successfully"));
    } else {
      yield put(
        updateProductFailure(data.error || "Failed to update product.")
      );
    }
  } catch (error) {
    yield put(updateProductFailure(error.message));
  }
}

function* deleteProductSaga(action) {
  try {
    const productId = action.payload;
    yield call(
      axios.delete,
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/products/products/${productId}`
    );
    yield put(deleteProductSuccess(productId)); // ✅ Correct success action
  } catch (error) {
    yield put(deleteProductFailure(error.message)); // ✅ Correct failure action
  }
}

export default function* productSaga() {
  yield takeEvery(FETCH_PRODUCTS_REQUEST, fetchProductSaga);
  yield takeEvery(
    FETCH_PRODUCTS_WITH_CATEGORY_REQUEST,
    fetchProductsWithCategorySaga
  );
  yield takeEvery(CREATE_PRODUCT_REQUEST, createProductSaga);
  yield takeEvery(FETCH_PRODUCT_REQUEST, fetchProductByIdSaga);
  yield takeEvery(UPDATE_PRODUCT_REQUEST, updateProductSaga);
    yield takeEvery(DELETE_PRODUCT_REQUEST, deleteProductSaga);

}
