import {search} from '../../client/searchClient';
/*
 * action types
 */
export const CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY';
export const CHANGE_SEARCH_RESULT = 'CHANGE_SEARCH_RESULT';
export const CHANGE_ACTIVE_SEARCH_COUNT = 'CHANGE_ACTIVE_SEARCH_COUNT';

/**
 * This is fired when the ui input changes, and results in the state.search.searchQuery getting changed, as well as a potential fetch for search results.
 * @param searchQuery - query the user has typed
 * @returns {{type: string, searchQuery: string}}
 */
export function changeSearchQuery({searchQuery}){
  return { type: CHANGE_SEARCH_QUERY, searchQuery };
}

/**
 * After fetch for search results is performed, this action will be triggered in order to change the state.search.searchResult
 * @param searchResult - result returned from the server
 * @returns {{type: string, searchResult: *}}
 */
export function changeSearchResult({searchResult}){
  return { type: CHANGE_SEARCH_RESULT, searchResult};
}

/**
 * Keep track of how many searches are actively being performed. i.e. how many requests are currently active.
 * @param activeSearchCount - number of active searches
 * @returns {{type: string, activeSearchCount: int}}
 */
export function changeActiveSearchCount({activeSearchCount}){
  return { type: CHANGE_ACTIVE_SEARCH_COUNT, activeSearchCount};
}

/**
 * Changes the active search count by adding 1 to the current value
 * @returns {function(*, *)}
 */
function incrementActiveSearchCount(){
  return (dispatch, getState)=>{
    dispatch(changeActiveSearchCount({activeSearchCount: getState().search.activeSearchCount + 1}));
  };
}

/**
 * Changes the active search count by subtracting 1 from the current value
 * @returns {function(*, *)}
 */
function decrementActiveSearchCount(){
  return (dispatch, getState)=>{
    dispatch(changeActiveSearchCount({activeSearchCount: getState().search.activeSearchCount - 1}));
  };
}


/**
 * When changeSearchQuery is fired, we call this function in order to fetch search results from the server.
 * @param searchQuery - query to send to the server.
 * @returns {function(*)} - redux-thunk func so we can do async dispatch.
 */
export function fetchSearchResultV1({searchQuery}){
  return async (dispatch)=>{
    try {
      dispatch(incrementActiveSearchCount());
      const searchResult = await search({q: searchQuery});
      dispatch(changeSearchResult({searchResult}));
    } catch(e) {
      console.error('error performing search: ', e);
    } finally {
      dispatch(decrementActiveSearchCount());
    }
  }
}

/**
 * This approach only allows 1 request to be made at a time.
 *
 * @param searchQuery
 * @returns {function(*, *)}
 */
export function fetchSearchResultV2({searchQuery}){
  return async (dispatch, getState)=>{
    //don't allow more than 1 query to be performed at a time.
    const {activeSearchCount} = getState().search;
    if(activeSearchCount > 0){
      console.log('already performing a search, so not going to perform another one right now.');
      return;
    }
    try {
      dispatch(incrementActiveSearchCount());
      const searchResult = await search({q: searchQuery});
      dispatch(changeSearchResult({searchResult}));
      dispatch(decrementActiveSearchCount());

      //if the current search query doesn't match what was last returned from the service, perform another query.
      const currentSearchQuery = getState().search.searchQuery;
      if(searchResult.query !== currentSearchQuery){
        return dispatch(fetchSearchResultV2({searchQuery: currentSearchQuery}));
      }
    } catch(e) {
      console.error('error performing search: ', e);
      dispatch(decrementActiveSearchCount());
    }
  }
}

export function fetchSearchResultV3({searchQuery}){
  return async (dispatch, getState)=>{
    try {
      dispatch(incrementActiveSearchCount());
      const searchResult = await search({q: searchQuery});
      dispatch(decrementActiveSearchCount());

      //only display the result for the query that matches current query
      const currentSearchQuery = getState().search.searchQuery;
      if(searchResult.query === currentSearchQuery){
        dispatch(changeSearchResult({searchResult}));
      }
    } catch(e) {
      console.error('error performing search: ', e);
      dispatch(decrementActiveSearchCount());
    }
  }
}
