import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_DELIVERIES_REQUEST,
  fetchDeliveriesSuccess,
  fetchDeliveriesFailure,
  CREATE_DELIVERY_REQUEST,
  createDeliverySuccess,
  createDeliveryFailure,
  UPDATE_DELIVERY_REQUEST,
  updateDeliverySuccess,
  updateDeliveryFailure,
  DELETE_DELIVERY_REQUEST,
  deleteDeliverySuccess,
  deleteDeliveryFailure,
} from "./deliveryActions";

const baseUrl = `http://${process.env.REACT_APP_IP_ADDRESS}/api/deliveries`;

function* fetchDeliveriesSaga(action) {
  try {
    const status = action.payload || "All";
    const url =
      status === "All"
        ? `${baseUrl}/deliveries`
        : `${baseUrl}/deliveries?status=${encodeURIComponent(status)}`;
    const response = yield call(() => fetch(url).then((res) => res.json()));
    yield put(fetchDeliveriesSuccess(response));
  } catch (error) {
    yield put(fetchDeliveriesFailure(error.message));
  }
}

function* createDeliverySaga(action) {
  try {
    const res = yield call(() =>
      fetch(`${baseUrl}/deliveries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.payload),
      }).then((res) => res.json())
    );
    yield put(createDeliverySuccess({ ...action.payload, delivery_id: res.id }));
  } catch (error) {
    yield put(createDeliveryFailure(error.message));
  }
}

function* updateDeliverySaga(action) {
  try {
    const { id, data } = action.payload;
    console.log("Updating delivery with ID:", id, "and data:", data);
    const res = yield call(() =>
      fetch(`${baseUrl}/deliveries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json())

    );
    console.log("Update response:", res);
    yield put(updateDeliverySuccess({ delivery_id: id, ...data }));
    yield put({ type: FETCH_DELIVERIES_REQUEST, payload: "All" });
  } catch (error) {
    yield put(updateDeliveryFailure(error.message));
  }
}


function* deleteDeliverySaga(action) {
  try {
    yield call(() =>
      fetch(`${baseUrl}/deliveries/${action.payload}`, {
        method: "DELETE",
      })
    );
    yield put(deleteDeliverySuccess(action.payload));
  } catch (error) {
    yield put(deleteDeliveryFailure(error.message));
  }
}

export default function* deliverySaga() {
  yield takeEvery(FETCH_DELIVERIES_REQUEST, fetchDeliveriesSaga);
  yield takeEvery(CREATE_DELIVERY_REQUEST, createDeliverySaga);
  yield takeEvery(UPDATE_DELIVERY_REQUEST, updateDeliverySaga);
  yield takeEvery(DELETE_DELIVERY_REQUEST, deleteDeliverySaga);
}
