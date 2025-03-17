import { takeEvery, call, put } from "redux-saga/effects";
import { FETCH_USERS_REQUEST, fetchUserssuccess, fetchusersfailuer } from "../user/userActions";

// Fetch API function
const fetchapi = async () => {
  try {
    const response = await fetch("http://192.168.1.15:8081/api/users/all");
    const data = await response.json();
    
    console.log("API Fetch Response:", data); // Debug API response
    
    return data.users || []; // Ensure it returns an array
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    throw new Error("Failed to fetch users: " + error.message);
  }
};



function* usersSaga() {
    try {
      const users = yield call(fetchapi);
      yield put(fetchUserssuccess(users)); 
    } catch (error) {
      yield put(fetchusersfailuer(error.message));
    }
  }
// Watcher Saga
export default function* userSaga() {
  yield takeEvery(FETCH_USERS_REQUEST, usersSaga);
}