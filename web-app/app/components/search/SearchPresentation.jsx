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

      <div className="search-type">
        <div>v4 debounces how often search can be performed. it uses v3 approach, but only allows it to be called once every second</div>
        <input type="text" value={searchQuery} onChange={onSearchQueryInputChange.bind(null, 'v4')} />
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
      <ReactTable columns={searchResultTableColumns} data={searchResult.results} className="-striped -highlight" showPagination={false} defaultPageSize={-1}/>
    </div>
  );
}

function loadingSpinner(){
  return(
    <div className="spinner">
      <div className="rect1"></div>
      <div className="rect2"></div>
      <div className="rect3"></div>
      <div className="rect4"></div>
      <div className="rect5"></div>
    </div>
  );
}
