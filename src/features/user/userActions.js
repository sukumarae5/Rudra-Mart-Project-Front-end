export const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE"; // FIXED spelling
export const USER_LOGIN_DATA = "USER_LOGIN_DATA";
export const USER_LOGOUT_DATA = "USER_LOGOUT_DATA";
export const DELETE_USERS_REQUEST = "DELETE_USERS_REQUEST";
export const DELETE_USERS_SUCCESS = "DELETE_USERS_SUCCESS";
export const DELETE_USERS_FAILURE = "DELETE_USERS_FAILURE";
export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";
export const ADD_USER_REQUEST = "ADD_USER_REQUEST";
export const ADD_USER_SUCCESS = "ADD_USER_SUCCESS";
export const ADD_USER_FAILURE = "ADD_USER_FAILURE"; 


export const fetchusersrequest = () => ({
  type: FETCH_USERS_REQUEST,
});
export const fetchUserssuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});
export const fetchusersfailure = (error) => ({
  type: FETCH_USERS_FAILURE, // FIXED spelling
  payload: error,
});
export const userlogindata = (data) => ({
  type: USER_LOGIN_DATA,
  payload: data,
});
export const userlogoutdata = (outdata) => ({
  type: USER_LOGOUT_DATA,
  payload: outdata,
});

export const deleteUsersRequest = (userIds) => ({
  type: DELETE_USERS_REQUEST,
  payload: userIds, // array of user IDs
});

export const deleteUsersSuccess = () => ({
  type: DELETE_USERS_SUCCESS,
});

export const deleteUsersFailure = (error) => ({
  type: DELETE_USERS_FAILURE,
  payload: error,
});

export const updateUserRequest = (userId, updatedData) => ({
  type: UPDATE_USER_REQUEST,
  payload: { userId, updatedData },
});

export const updateUserSuccess = () => ({
  type: UPDATE_USER_SUCCESS,
});

export const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

export const addUserRequest = (userData, navigate) => ({
  type: ADD_USER_REQUEST,
  payload: { userData, navigate },
});

export const addUserSuccess = () => ({
  type: ADD_USER_SUCCESS,
});

export const addUserFailure = (error) => ({
  type: ADD_USER_FAILURE,
  payload: error,
});