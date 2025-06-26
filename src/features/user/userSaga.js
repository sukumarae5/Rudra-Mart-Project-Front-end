import { takeEvery, call, put, all } from "redux-saga/effects";
import {
  FETCH_USERS_REQUEST,
  DELETE_USERS_REQUEST,
  fetchUserssuccess,
  fetchusersfailure,
  deleteUsersSuccess,
  deleteUsersFailure,
  fetchusersrequest,
  UPDATE_USER_REQUEST,
  updateUserSuccess,
  updateUserFailure,
  ADD_USER_REQUEST,
  addUserSuccess,
  addUserFailure,
} from "../user/userActions";

// Fetch API function
const fetchapi = async () => {
  try {
    const response = await fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/users/all`
    );
    const data = await response.json();

    console.log("API Fetch Response:", data); // Debug API response

    return data;
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    throw new Error("Failed to fetch users: " + error.message);
  }
};

function* usersSaga() {
  try {
    const users = yield call(fetchapi);
    console.log("Saga Users:", users); // Check what comes here

    yield put(fetchUserssuccess(users));
  } catch (error) {
    yield put(fetchusersfailure(error.message));
  }
}
function* deleteUsersSaga(action) {
  try {
    const userIds = action.payload;

    yield all(
      userIds.map((userId) =>
        call(
          fetch,
          `http://${process.env.REACT_APP_IP_ADDRESS}/api/users/public/${userId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        )
      )
    );

    yield put(deleteUsersSuccess());
    yield put(fetchusersrequest()); // refresh the list
  } catch (error) {
    yield put(deleteUsersFailure(error.message));
  }
}

function* updateUserSaga(action) {
  try {
    const { userId, updatedData } = action.payload;

    const response = yield call(
      fetch,
      `http://${process.env.REACT_APP_IP_ADDRESS}/api/users/public/${userId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const data = yield response.json();
      throw new Error(data.error || "Failed to update user");
    }

    yield put(updateUserSuccess());
    yield put(fetchusersrequest()); // refresh list after update
  } catch (error) {
    yield put(updateUserFailure(error.message));
  }
}

function* addUserSaga(action) {
  const { userData, navigate } = action.payload;

  try {
    const response = yield call(fetch, `http://${process.env.REACT_APP_IP_ADDRESS}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = yield response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add user");
    }

    yield put(addUserSuccess());
    yield put(fetchusersrequest()); // optional: to refresh list

    alert("User added successfully!");
    navigate("/admin/adminusers"); // redirect after success
  } catch (error) {
    yield put(addUserFailure(error.message));
    alert("Error adding user: " + error.message);
  }
}
// Watcher Saga
export default function* userSaga() {
  yield takeEvery(FETCH_USERS_REQUEST, usersSaga);
  yield takeEvery(DELETE_USERS_REQUEST, deleteUsersSaga);
  yield takeEvery(UPDATE_USER_REQUEST, updateUserSaga);
  yield takeEvery(ADD_USER_REQUEST, addUserSaga);

}