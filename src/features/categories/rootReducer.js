import { combineReducers } from "redux";
import categoryproductReducer from "./categoryproductReducer";
// import other reducers if needed

const rootReducer = combineReducers({
  categoryproduct: categoryproductReducer,
  // other reducers...
});

export default rootReducer;
