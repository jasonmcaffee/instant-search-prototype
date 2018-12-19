
import {CHANGE_SEARCH_QUERY, CHANGE_SEARCH_RESULT, CHANGE_ACTIVE_SEARCH_COUNT, INCREMENT_ACTIVE_SEARCH_COUNT, DECREMENT_ACTIVE_SEARCH_COUNT} from './actions';

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
      console.log('active search count is : ', state.activeSearchCount);
      return {...state, activeSearchCount: state.activeSearchCount + 1};
    case DECREMENT_ACTIVE_SEARCH_COUNT:
      return {...state, activeSearchCount: state.activeSearchCount - 1};
    default:
      return state
  }
}

// const searchReducer = combineReducers({search});
export default search;
