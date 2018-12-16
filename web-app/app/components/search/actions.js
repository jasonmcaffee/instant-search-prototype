import {search} from '../../client/searchClient';
/*
 * action types
 */
export const CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY';
export const CHANGE_SEARCH_RESULT = 'CHANGE_SEARCH_RESULT';

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
 * When changeSearchQuery is fired, we call this function in order to fetch search results from the server.
 * @param searchQuery - query to send to the server.
 * @returns {function(*)} - redux-thunk func so we can do async dispatch.
 */
export function fetchSearchResult({searchQuery}){
  return async (dispatch)=>{
    console.log(`fetchSearchResult called with: ${searchQuery}`);
    try{
      const searchResult = await search({q: searchQuery});
      dispatch(changeSearchResult({searchResult}));
    }catch(e){
      console.error('error performing search: ', e);
    }
  }
}
