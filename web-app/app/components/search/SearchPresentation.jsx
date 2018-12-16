import React from 'react';
import ReactTable from "react-table";
require("react-table/react-table.css");
require("./SearchPresentation.css");

export default function SearchPresentation({searchQuery, searchResult={query:'', results:[]}, onSearchQueryInputChange=()=>{}, searchResultTableColumns=[], activeSearchCount, }) {
  const spinner = activeSearchCount > 0 ? loadingSpinner() : null;
  const searchResultCount = searchResult.results.length;
  return (
    <div className="search">
      <div className="search-type">
        <div>v1 performs a search for each keystroke and displays whichever response was received last. bad approach.</div>
        <input type="text" value={searchQuery} onChange={onSearchQueryInputChange.bind(null, 'v1')} />
        {spinner}
      </div>

      <div className="search-type">
        <div>v2 only allows 1 search to be performed at a time</div>
        <input type="text" value={searchQuery} onChange={onSearchQueryInputChange.bind(null, 'v2')} />
        {spinner}
      </div>

      <div className="search-type">
        <div>v3 allows multiple searches to be performed at a time, but only displays results if they match the current query text.</div>
        <input type="text" value={searchQuery} onChange={onSearchQueryInputChange.bind(null, 'v3')} />
        {spinner}
      </div>

      <hr/>
      <div>
        Results for query {searchResult.query}
      </div>
      <div>
        Active search count {activeSearchCount}
      </div>
      <div>
        Search result count {searchResultCount}
      </div>
      <ReactTable columns={searchResultTableColumns} data={searchResult.results} defaultPageSize={10} className="-striped -highlight" showPagination={false} defaultPageSize={-1}/>
    </div>
  );
}

function loadingSpinner(){
  return(
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  );
}
