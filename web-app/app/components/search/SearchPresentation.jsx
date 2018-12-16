import React from 'react';
import ReactTable from "react-table";
require("react-table/react-table.css");
require("./SearchPresentation.css");

export default function SearchPresentation({searchQuery, searchResult={query:'', results:[]}, onSearchQueryInputChange=()=>{}, searchResultTableColumns=[], }) {
  return (
    <div className="search">
      <input type="text" value={searchQuery} onChange={onSearchQueryInputChange} />

      <hr/>
      <div>
        Results for query {searchResult.query}
      </div>
      <ReactTable columns={searchResultTableColumns} data={searchResult.results} defaultPageSize={10} className="-striped -highlight"/>
    </div>
  );
}
