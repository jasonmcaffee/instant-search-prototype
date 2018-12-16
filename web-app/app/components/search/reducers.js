
import {CHANGE_SEARCH_QUERY, CHANGE_SEARCH_RESULT} from './actions';

const defaultState = {
  //the input text value
  searchQuery: '',
  //result returned from the web service
  searchResult: {
    query: '',
    results: [],
  },
  searchResultTableColumns: [
    {
      Header: "User",
      columns: [
        { Header: "First", accessor: "user.firstName" },
        { Header: "Last", accessor: "user.lastName", },
      ]
    },
  ],
};

function search(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_SEARCH_QUERY:
      return {...state, searchQuery: action.searchQuery};
    case CHANGE_SEARCH_RESULT:
      return {...state, searchResult: action.searchResult};
    default:
      return state
  }
}

// const searchReducer = combineReducers({search});
export default search;
