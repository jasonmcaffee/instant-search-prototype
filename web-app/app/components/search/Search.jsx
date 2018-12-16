import { changeSearchQuery } from './actions';
import SearchPresentation from './SearchPresentation';
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return state.search;
};

const mapDispatchToProps = dispatch => {
  return {
    onSearchQueryInputChange(e) {
      const searchQuery = e.target.value;
      dispatch(changeSearchQuery({searchQuery}));
    }
  }
};

const Search = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPresentation);

export default Search;
