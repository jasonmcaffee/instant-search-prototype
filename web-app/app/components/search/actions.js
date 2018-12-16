import {search} from '../../client/searchClient';
/*
 * action types
 */
export const CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY';
export const CHANGE_SEARCH_RESULT = 'CHANGE_SEARCH_RESULT';

/*
 * action creators
 */
export function changeSearchQuery({searchQuery}){
  return { type: CHANGE_SEARCH_QUERY, searchQuery };
}

export function changeSearchResult({searchResult}){
  return { type: CHANGE_SEARCH_RESULT, searchResult};
}

export function performSearch({searchQuery}){
  return async (dispatch)=>{
    const searchResult = await search({q: searchQuery});
    dispatch(changeSearchResult({searchResult}));
  }
}
