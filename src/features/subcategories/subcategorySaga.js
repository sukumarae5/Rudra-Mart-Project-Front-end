import { takeEvery, call, put } from "redux-saga/effects";
import {
  FETCH_SUBCATEGORY_REQUEST,
  fetchSubcategoryFailure,
  fetchSubcategorySuccess,
} from "./subcategoryAction";

// API call function
const fetchSubcategoryAPI = async () => {
  const res = await fetch(`http://${process.env.REACT_APP_IP_ADDRESS}/api/subcategory/subcategories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch subcategories");
  }

  const data = await res.json();
  return data;
};

// Worker saga
function* fetchSubcategories() {
  try {
    const data = yield call(fetchSubcategoryAPI);
    yield put(fetchSubcategorySuccess(data));
  } catch (err) {
    yield put(fetchSubcategoryFailure(err.message));
  }
}

// Watcher saga
export default function* subcategorySaga() {
  yield takeEvery(FETCH_SUBCATEGORY_REQUEST, fetchSubcategories);
}
