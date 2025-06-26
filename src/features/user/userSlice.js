const initialState = {
  users: [], // Default to empty array
  data: [],
  customerCount: 0,
  error: null, // Default to null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USERS_REQUEST":
      console.log("Updating Users State:", action.payload);
      return { ...state, error: null, users: [] };

    case "FETCH_USERS_SUCCESS":
      console.log("Updating Users State:", action.payload);
      return {
        ...state,
        users: action.payload,
        customerCount: action.payload.length || 0,
        error: null,
      };
    case "FETCH_USERS_FAILURE":
      console.log("Updating Error State:", action.payload);
      return { ...state, error: action.payload };
    case "USER_LOGIN_DATA":
      return { ...state, data: action.payload };
    case "USER_LOGOUT_DATA":
      console.log(action.payload);
      return { ...state, data: null };
    case "DELETE_USERS_REQUEST":
      return { ...state, error: null };

    case "DELETE_USERS_SUCCESS":
      return { ...state, error: null }; // or you can add a `success` flag

    case "DELETE_USERS_FAILURE":
      return { ...state, error: action.payload };
    case "UPDATE_USER_REQUEST":
      return { ...state, error: null };

    case "UPDATE_USER_SUCCESS":
      return { ...state, error: null };

    case "UPDATE_USER_FAILURE":
      return { ...state, error: action.payload };
    case "ADD_USER_REQUEST":
      return { ...state, error: null };

    case "ADD_USER_SUCCESS":
      return { ...state, error: null };

    case "ADD_USER_FAILURE":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default userReducer;