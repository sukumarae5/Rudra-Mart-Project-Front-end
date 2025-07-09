import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_BANNERS_REQUEST,
  ADD_BANNER_REQUEST,
  FETCH_BANNER_BY_ID_REQUEST,
  UPDATE_BANNER_REQUEST,
  DELETE_BANNER_REQUEST,
  fetchBannersSuccess,
  fetchBannersFailure,
  addBannerSuccess,
  addBannerFailure,
  fetchBannerByIdSuccess,
  fetchBannerByIdFailure,
  updateBannerSuccess,
  updateBannerFailure,
  deleteBannerSuccess,
  deleteBannerFailure,
} from "../banners/bannerActions";

// API URL
const BANNER_API = `http://${process.env.REACT_APP_IP_ADDRESS}/api/banners`;

function* fetchBanners() {
  try {
    const res = yield call(() => fetch(BANNER_API));
    const data = yield res.json();
    yield put(fetchBannersSuccess(data));
  } catch (err) {
    yield put(fetchBannersFailure(err.message));
  }
}

function* addBanner(action) {
  try {
    const res = yield call(fetch, BANNER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action.payload), // use action.payload, NOT bannerData.payload
    });

    const data = yield res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to add banner");
    }

    yield put(addBannerSuccess(data));
  } catch (err) {
    yield put(addBannerFailure(err.message || "Something went wrong"));
  }
}


function* fetchBannerById({ payload: id }) {
  try {
    const res = yield call(() => fetch(`${BANNER_API}/${id}`));
    const data = yield res.json();
    yield put(fetchBannerByIdSuccess(data));
  } catch (err) {
    yield put(fetchBannerByIdFailure(err.message));
  }
}

function* updateBanner({ payload }) {
  const { id, data } = payload;
  try {
    const res = yield call(() =>
      fetch(`${BANNER_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    );
    if (!res.ok) throw new Error("Update failed");
    yield put(updateBannerSuccess());
  } catch (err) {
    yield put(updateBannerFailure(err.message));
  }
}

function* deleteBanner({ payload: id }) {
  try {
    const res = yield call(() =>
      fetch(`${BANNER_API}/${id}`, {
        method: "DELETE",
      })
    );
    if (!res.ok) throw new Error("Delete failed");
    yield put(deleteBannerSuccess(id));
  } catch (err) {
    yield put(deleteBannerFailure(err.message));
  }
}

export default function* bannerSaga() {
  yield takeEvery(FETCH_BANNERS_REQUEST, fetchBanners);
  yield takeEvery(ADD_BANNER_REQUEST, addBanner);
  yield takeEvery(FETCH_BANNER_BY_ID_REQUEST, fetchBannerById);
  yield takeEvery(UPDATE_BANNER_REQUEST, updateBanner);
  yield takeEvery(DELETE_BANNER_REQUEST, deleteBanner);
}
