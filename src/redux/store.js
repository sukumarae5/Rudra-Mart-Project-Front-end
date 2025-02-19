import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer'; // Your root reducer
import rootSaga from './rootSaga'; // Your root saga
// import thunk from 'redux-thunk'; // Import redux-thunk

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create the Redux store with both sagaMiddleware and thunk
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware) // Apply both middleware
);

// Run the root saga (this is where the saga functions will be handled)
sagaMiddleware.run(rootSaga);

export default store;
