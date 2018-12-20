
import {CHANGE_SEARCH_QUERY, CHANGE_SEARCH_RESULT, CHANGE_ACTIVE_SEARCH_COUNT, INCREMENT_ACTIVE_SEARCH_COUNT, DECREMENT_ACTIVE_SEARCH_COUNT, ERROR_FETCHING_SEARCH_RESULTS} from './actions';

/**
 * Reducer for changing the ui
 * @param state - represents the apps state.search. Redux does some magic where we don't have to look at state.search. Default state is provided by the store.
 * @param action
 * @returns {*}
 */
function search(state={}, action) {
  switch (action.type) {
    case CHANGE_SEARCH_QUERY:
      return {...state, searchQuery: action.searchQuery};
    case CHANGE_SEARCH_RESULT:
      return {...state, searchResult: action.searchResult};
    case CHANGE_ACTIVE_SEARCH_COUNT:
      return {...state, activeSearchCount: action.activeSearchCount};
    case INCREMENT_ACTIVE_SEARCH_COUNT:
      return {...state, activeSearchCount: state.activeSearchCount + 1};
    case DECREMENT_ACTIVE_SEARCH_COUNT:
      return {...state, activeSearchCount: state.activeSearchCount - 1};
    case ERROR_FETCHING_SEARCH_RESULTS:
      const {error} = action;
      window.alert(`error fetching search results: ${JSON.stringify(error, null, 2)} `);
      return state;
    default:
      return state
  }
}

// const searchReducer = combineReducers({search});
export default search;
