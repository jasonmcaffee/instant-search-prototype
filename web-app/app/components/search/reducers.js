
import {CHANGE_SEARCH_QUERY, CHANGE_SEARCH_RESULT} from './actions';

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
    default:
      return state
  }
}

// const searchReducer = combineReducers({search});
export default search;
