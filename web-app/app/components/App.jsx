import React, {useState, useEffect} from 'react';
import Search from './search/Search';
import ReactTable from "react-table";
import {search} from '../client/searchClient';
require('./App.css');
require("react-table/react-table.css");
let currentQuery;
const tableColumns = [
  {
    Header: "User",
    columns: [
      {
        Header: "First",
        accessor: "user.firstName"
      },
      {
        Header: "Last",
        id: "user.lastName",
      }
    ]
  },
];

export default () => {
  const [queryResult, setQueryResult] = useState({results:[]});
  const queryResultStr = JSON.stringify(queryResult);

  async function handleQueryChange(query){
    currentQuery = query;
    const result = await search({q: query});
    setQueryResult(result);
  }

  return (<div>
    <h1>Hello World</h1>
    <Search onChange={handleQueryChange}/>

    <ReactTable columns={tableColumns} data={queryResult.results} defaultPageSize={10}
                className="-striped -highlight"/>

    {/*<div>{queryResultStr}</div>*/}
  </div>)
}

//  const [storeDataS] = storeHook.storeDataSmartHook.useStateWithStore();
{/*<div>*/}
  {/*{JSON.stringify(storeDataS)}*/}
{/*</div>*/}
//console.log('App rendering with store: ', storeDataS);
