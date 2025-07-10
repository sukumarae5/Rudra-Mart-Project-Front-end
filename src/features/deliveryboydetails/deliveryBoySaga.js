import { call, put, takeEvery, all } from "redux-saga/effects";
import {
  FETCH_DELIVERY_BOYS_REQUEST,
  ADD_DELIVERY_BOY_REQUEST,
  UPDATE_DELIVERY_BOY_REQUEST,
  DELETE_DELIVERY_BOY_REQUEST,
  fetchDeliveryBoysSuccess,
  fetchDeliveryBoysFailure,
} from "./deliveryBoyActions";

import {
  ADD_DELIVERY_BOY_SUCCESS,
  ADD_DELIVERY_BOY_FAILURE,
  UPDATE_DELIVERY_BOY_SUCCESS,
  UPDATE_DELIVERY_BOY_FAILURE,
  DELETE_DELIVERY_BOY_SUCCESS,
  DELETE_DELIVERY_BOY_FAILURE,
} from "./deliveryBoyActions";

const API = `http://${process.env.REACT_APP_IP_ADDRESS}/api/deliveriesboy`;

// Worker Sagas
function* fetchDeliveryBoysSaga() {
  try {
    const res = yield call(() =>
      fetch(`${API}/delivery-boys`).then((r) => r.json())
    );
    yield put(fetchDeliveryBoysSuccess(res));
  } catch (error) {
    yield put(fetchDeliveryBoysFailure(error.message));
  }
}

function* addDeliveryBoySaga(action) {
  try {
    const res = yield call(() =>
      fetch(`${API}/delivery-boys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.payload),
      }).then((r) => r.json())
    );
    yield put({ type: ADD_DELIVERY_BOY_SUCCESS, payload: res });
  } catch (error) {
    yield put({ type: ADD_DELIVERY_BOY_FAILURE, payload: error.message });
  }
}

function* updateDeliveryBoySaga(action) {
  try {
    const { id, data } = action.payload;
    const res = yield call(() =>
      fetch(`${API}/delivery-boys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json())
    );
    yield put({ type: UPDATE_DELIVERY_BOY_SUCCESS, payload: { ...data, id } });
  } catch (error) {
    yield put({ type: UPDATE_DELIVERY_BOY_FAILURE, payload: error.message });
  }
}

function* deleteDeliveryBoySaga(action) {
  try {
    yield call(() =>
      fetch(`${API}/delivery-boys/${action.payload}`, {
        method: "DELETE",
      })
    );
    yield put({ type: DELETE_DELIVERY_BOY_SUCCESS, payload: action.payload });
  } catch (error) {
    yield put({ type: DELETE_DELIVERY_BOY_FAILURE, payload: error.message });
  }
}

// Watcher Saga
export default function* deliveryBoySaga() {
  yield all([
    takeEvery(FETCH_DELIVERY_BOYS_REQUEST, fetchDeliveryBoysSaga),
    takeEvery(ADD_DELIVERY_BOY_REQUEST, addDeliveryBoySaga),
    takeEvery(UPDATE_DELIVERY_BOY_REQUEST, updateDeliveryBoySaga),
    takeEvery(DELETE_DELIVERY_BOY_REQUEST, deleteDeliveryBoySaga),
  ]);
}
