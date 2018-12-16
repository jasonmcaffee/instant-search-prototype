import React from 'react';
import ReactTable from "react-table";
require("react-table/react-table.css");

export default function SearchPresentation({searchQuery, searchResult={query:'', results:[]}, onSearchQueryInputChange=()=>{}, searchResultTableColumns=[], }) {
  return (
    <div>
      <input type="text" value={searchQuery} onChange={onSearchQueryInputChange} />
      <ReactTable columns={searchResultTableColumns} data={searchResult.results} defaultPageSize={10} className="-striped -highlight"/>
    </div>
  );
}
