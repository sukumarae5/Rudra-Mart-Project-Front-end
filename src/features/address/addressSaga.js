import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  FETCH_ADDRESSES_REQUEST,
  fetchAddressesSuccess,
  fetchAddressesFailure,
  ADD_ADDRESS_REQUEST,
  addAddressSuccess,
  addAddressFailure,
  UPDATE_ADDRESS_REQUEST,
  updateAddressSuccess,
  updateAddressFailure,
  DELETE_ADDRESS_REQUEST,
  deleteAddressSuccess,
  deleteAddressFailure,
} from "../address/addressActions";

// 🛠️ Updated API Helper Function
const apiCall = async (url, method = "GET", data = null) => {
  const token = localStorage.getItem("authToken");
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data); // Apply body for POST/PUT
  }

  const response = await fetch(url, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};

// 1️⃣ Fetch Addresses Saga (GET)
function* fetchAddressesSaga() {
  try {
    const data = yield call(apiCall, "http://192.168.1.2/api/address/get", "GET");
    yield put(fetchAddressesSuccess(data.addresses));
  } catch (error) {
    yield put(fetchAddressesFailure(error.message));
  }
}

// 2️⃣ Add Address Saga (POST)
function* addAddressSaga(action) {
  try {
    const data = yield call(apiCall, "http://192.168.1.2/api/address/add", "POST", action.payload);
    yield put(addAddressSuccess(data.address));
  } catch (error) {
    yield put(addAddressFailure(error.message));
  }
}

// 3️⃣ Update Address Saga (PUT)
function* updateAddressSaga(action) {
  try {
    const { addressId, updatedAddress } = action.payload;
    const data = yield call(apiCall, `http://192.168.1.2:8081/api/address/update/${addressId}`, "PUT", updatedAddress);
    yield put(updateAddressSuccess(data.updatedAddress));
  } catch (error) {
    yield put(updateAddressFailure(error.message));
  }
}

// 4️⃣ Delete Address Saga (DELETE)
function* deleteAddressSaga(action) {
  try {
    const addressId = action.payload;
    yield call(apiCall, `http://192.168.1.2:8081/api/address/delete/${addressId}`, "DELETE");
    yield put(deleteAddressSuccess(addressId));
  } catch (error) {
    yield put(deleteAddressFailure(error.message));
  }
}

// 📦 Root Saga
export default function* addressSaga() {
  yield all([
    takeLatest(FETCH_ADDRESSES_REQUEST, fetchAddressesSaga),
    takeLatest(ADD_ADDRESS_REQUEST, addAddressSaga),
    takeLatest(UPDATE_ADDRESS_REQUEST, updateAddressSaga),
    takeLatest(DELETE_ADDRESS_REQUEST, deleteAddressSaga),
  ]);
}
