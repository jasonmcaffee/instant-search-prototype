import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import searchReducer from '../components/search/reducers';
const loggerMiddleware = createLogger();
import { combineReducers } from 'redux';


const searchDefaultState = {
  //the input text value
  searchQuery: '',
  //result returned from the web service
  searchResult: {
    query: '',
    results: [],
  },
  //how many searches/fetches/requests are currently active
  activeSearchCount: 0,
  //how SearchPresentation should format the react table.
  searchResultTableColumns: [
    {
      Header: "User",
      columns: [
        { Header: "First", accessor: "user.firstName" },
        { Header: "Last", accessor: "user.lastName", },
      ]
    },
    {
      Header: "Org",
      columns:[
        { Header: "Name", accessor: "org.orgName" },
        { Header: "ID", accessor: "org.orgId" },
        { Header: "Pod", accessor: "org.pod" },
      ]
    }
  ],
};

const initialState = {
  search: searchDefaultState,
};

export default createStore(
  combineReducers({search:searchReducer}),
  initialState,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  )
);
