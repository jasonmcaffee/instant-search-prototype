import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import searchReducer from '../components/search/reducers';
const loggerMiddleware = createLogger();
import { combineReducers } from 'redux';

export default createStore(
  combineReducers({search:searchReducer}),
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);
