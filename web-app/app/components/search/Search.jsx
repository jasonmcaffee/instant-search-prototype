import { changeSearchQuery, fetchSearchResultV1, fetchSearchResultV2, fetchSearchResultV3, } from './actions';
import SearchPresentation from './SearchPresentation';
import { connect } from 'react-redux'

/**
 * The store stores many pieces of state.  One of these pieces is the search state.
 * Our component only cares about search state, so return that so it's mapped to the components props.
 * @param state
 */
const mapStateToProps = state => {
  return state.search;
};

/**
 * Presentation components use these functions via their passed in props.
 * This function relies on the redux-thunk middleware to perform async operations (e.g. making service fetch to perform search)
 * @param dispatch
 * @returns {*}
 */
const mapDispatchToProps = dispatch => {
  return {

    /**
     * Triggered by the search component's input element onChange event handler.
     * @param searchType - allows us to perform different search behaviors so we can evaluate a few different options for how to search
     * @param e - input event
     */
    onSearchQueryInputChange(searchType, e) {
      //get the value from the event
      const searchQuery = e.target.value;
      //change state.search.searchQuery
      dispatch(changeSearchQuery({searchQuery}));
      switch(searchType){
        case 'v1':
          dispatch(fetchSearchResultV1({searchQuery})); // make service call. triggers changeSearchResult once complete.
          break;
        case 'v2':
          dispatch(fetchSearchResultV2({searchQuery}));
          break;
        case 'v3':
          dispatch(fetchSearchResultV3({searchQuery}));
          break;
        default:
          console.error('no search type was provided on search query input change event');
      }

    }
  }
};

//Return a redux connected component
const Search = connect(mapStateToProps, mapDispatchToProps)(SearchPresentation);
export default Search;
