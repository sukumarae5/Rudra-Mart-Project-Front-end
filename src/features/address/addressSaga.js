import { put, takeLatest, call } from "redux-saga/effects";
import {
  FETCH_ADDRESSES_REQUEST,
  FETCH_ADDRESSES_SUCCESS,
  FETCH_ADDRESSES_FAILURE,
  ADD_ADDRESS_REQUEST,
  ADD_ADDRESS_SUCCESS,
  ADD_ADDRESS_FAILURE,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAILURE,
} from "../address/addressActions";

// API calls
const fetchAddressesAPI = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://192.168.1.15:8081/api/address/get", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch addresses");

  return response.json();
};

const addAddressAPI = async (addressData) => {
  const token = localStorage.getItem("authToken");
  
  const response = await fetch("http://192.168.1.15:8081/api/address/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });
console.log(addressData)
  if (!response.ok) throw new Error("Failed to add address");

  return response.json();
};

const updateAddressAPI = async (addressId, updatedData) => {
  console.log("API Call - Address ID:", addressId);
  console.log("API Call - Updated Data:", updatedData);

  if (!addressId || !updatedData) {
    throw new Error("Invalid address update payload");
  }

  const token = localStorage.getItem("authToken");
  const response = await fetch(`http://192.168.1.15:8081/api/address/updateaddress/${addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Failed to update address");

  return response.json();
};


const deleteAddressAPI = async (addressId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `http://192.168.1.15:8081/api/address/delete/${addressId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) throw new Error("Failed to delete address");

  return { success: true }; // Delete APIs usually don’t return data
};

// Saga Workers
function* fetchAddressesSaga() {
  try {
    const data = yield call(fetchAddressesAPI);
    yield put({ type: FETCH_ADDRESSES_SUCCESS, payload: data.addresses });
  } catch (error) {
    yield put({ type: FETCH_ADDRESSES_FAILURE, payload: error.message });
  }
}

function* addAddressSaga(action) {
  try {
    const data = yield call(addAddressAPI, action.payload);
    yield put({ type: ADD_ADDRESS_SUCCESS, payload: data.address });
    yield put({ type: FETCH_ADDRESSES_REQUEST }); // Refresh the address list
  } catch (error) {
    yield put({ type: ADD_ADDRESS_FAILURE, payload: error.message });
  }
}

function* updateAddressSaga(action) {
  try {
    console.log("updateAddressSaga Action Payload:", action.payload);

    const { addressId, updatedData } = action.payload; // Ensure correct keys

    if (!addressId || !updatedData) {
      throw new Error("Missing addressId or updatedData");
    }

    console.log("Updating Address ID:", addressId);
    console.log("Updated Data:", updatedData);

    const data = yield call(updateAddressAPI, addressId, updatedData);

    yield put({ type: UPDATE_ADDRESS_SUCCESS, payload: data.address });
    yield put({ type: FETCH_ADDRESSES_REQUEST }); // Refresh the address list
  } catch (error) {
    yield put({ type: UPDATE_ADDRESS_FAILURE, payload: error.message });
  }
}

function* deleteAddressSaga(action) {
  try {
    yield call(deleteAddressAPI, action.payload);
    yield put({ type: DELETE_ADDRESS_SUCCESS, payload: action.payload });
    yield put({ type: FETCH_ADDRESSES_REQUEST });
  } catch (error) {
    yield put({ type: DELETE_ADDRESS_FAILURE, payload: error.message });
  }
}

// Saga Watchers
export default function* addressSaga() {
  yield takeLatest(FETCH_ADDRESSES_REQUEST, fetchAddressesSaga);
  yield takeLatest(ADD_ADDRESS_REQUEST, addAddressSaga);
  yield takeLatest(UPDATE_ADDRESS_REQUEST, updateAddressSaga);
  yield takeLatest(DELETE_ADDRESS_REQUEST, deleteAddressSaga);
}
