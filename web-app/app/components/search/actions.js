import {search} from '../../client/searchClient';
import {debounce, mergeMap, map, filter, concat, flatMap, startWith, endWith, takeUntil, catchError} from 'rxjs/operators';
import {timer, of, from, } from 'rxjs';
import {ofType, } from 'redux-observable';

/*
 * action types
 */
export const CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY';
export const CHANGE_SEARCH_RESULT = 'CHANGE_SEARCH_RESULT';
export const CHANGE_ACTIVE_SEARCH_COUNT = 'CHANGE_ACTIVE_SEARCH_COUNT';
export const FETCH_SEARCH_RESULTS_V5 = 'FETCH_SEARCH_RESULTS_V5';
export const INCREMENT_ACTIVE_SEARCH_COUNT = 'INCREMENT_ACTIVE_SEARCH_COUNT';
export const DECREMENT_ACTIVE_SEARCH_COUNT = 'DECREMENT_ACTIVE_SEARCH_COUNT';
export const CANCEL_FETCH_SEARCH_RESULTS = 'CANCEL_FETCH_SEARCH_RESULTS';
export const ERROR_FETCHING_SEARCH_RESULTS = 'ERROR_FETCHING_SEARCH_RESULTS';

async function getSearchResult({searchQuery}){
  console.log('getSearchResult for: ', searchQuery);
  const searchResult = await search({q: searchQuery});
  throw new Error('failed search result!');
  return searchResult;
}

//https://github.com/redux-observable/redux-observable/issues/62
export const fetchSearchResultV5Epic = (action$, state$) => action$.pipe(
  //handle FETCH_SEARCH_RESULTS_V5 dispatch actions
  ofType(FETCH_SEARCH_RESULTS_V5),
  //wait 500 ms after they stop typing to perform the fetch.
  debounce(()=>timer(500)),
  //call getSearchResult
  flatMap(action => from(getSearchResult(action)).pipe(
    //handle the result by dispatching an event that the search results should be changed
    map(searchResult => changeSearchResult({searchResult})),
    //allow cancellations of inflight requests so we don't inadvertently display wrong search result.
    takeUntil(action$.pipe(ofType(CANCEL_FETCH_SEARCH_RESULTS))),
    //cancel any existing calls to this epic, so no more than 1 request is active at a time
    startWith(cancelFetchUser()),
    //increment the search result immediately
    startWith(incActiveSearchCount()),
    //decrement the search count after getSearchResult finishes
    endWith(decActiveSearchCount()),
    //handle errors from getSearchResult. of() can take multiple actions as params, so we can dispatch that there was an error, as well as dec active search count.
    catchError(error=>of(
      errorFetchingSearchResult({error}),
      decActiveSearchCount()
    )),
  )),
);
//
// catchError(error=>concat([
//   of(errorFetchingSearchResult({error})),
//   of(decActiveSearchCount()),
// ])),
//special for rxjs
function incActiveSearchCount(){
  return {type: INCREMENT_ACTIVE_SEARCH_COUNT};
}
//special for rxjs
function decActiveSearchCount(){
  return {type: DECREMENT_ACTIVE_SEARCH_COUNT};
}
//special for rxjs
function cancelFetchUser(){
  return {type: CANCEL_FETCH_SEARCH_RESULTS};
}
function errorFetchingSearchResult({error}){
  return {type: ERROR_FETCHING_SEARCH_RESULTS, error};
}
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

export function fetchSearchResultsV5({searchQuery}){
  return { type: FETCH_SEARCH_RESULTS_V5, searchQuery};
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

/**
 * Allows multiple requests at the same time, but only displays the results if they match the current query.
 * @param searchQuery
 * @returns {function(*, *)}
 */
export function fetchSearchResultV3({searchQuery}){
  return async (dispatch, getState)=>{
    await fetchSearchResultsButOnlyDisplayCurrentQueryResults({searchQuery, dispatch, getState});
  }
}

async function fetchSearchResultsButOnlyDisplayCurrentQueryResults({searchQuery, dispatch, getState}){
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

const debouncedFetchSearchResultV4 = debounceTime({func: fetchSearchResultsButOnlyDisplayCurrentQueryResults, waitMs: 1000});

export function fetchSearchResultV4({searchQuery}){
  return async (dispatch, getState)=>{
    return debouncedFetchSearchResultV4({searchQuery, dispatch, getState});
  }
}

function debounceTime({func, waitMs}){
  let lastCallTime;
  let timeoutId;
  async function wrappedFunc(...args){
    //invoke immediately if the function has never been called before
    if(lastCallTime === undefined){
      lastCallTime = Date.now();
      return func(...args);
    }

    const msSinceLastCallTime = Date.now() - lastCallTime;
    const msUntilNextCallTime = waitMs - msSinceLastCallTime;
    console.log(`msSinceLastCallTime: ${msSinceLastCallTime} msUntilNextCallTime: ${msUntilNextCallTime}`);
    if(msUntilNextCallTime > 0){
      console.log(`enough time hasn't transpired so we will wait to call this function.`);
      clearTimeout(timeoutId);
      const p = new Promise((resolve, reject)=>{
        timeoutId = setTimeout(()=>{
          console.log('setTimeout calling func now: ', ...args);
          lastCallTime = Date.now();
          resolve(func(...args));
        }, msUntilNextCallTime);
      });
      const result = await p;
      return result;
    }else{
      clearTimeout(timeoutId);
      console.log(`immediately calling function`);
      lastCallTime = Date.now();
      return func(...args);
    }
  }
  return wrappedFunc;
}
