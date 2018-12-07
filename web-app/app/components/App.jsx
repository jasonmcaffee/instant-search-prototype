import React, {useState, useEffect} from 'react';
import Search from './search/Search';
import StoreHook from '../hooks/StoreHook';
import {search} from '../client/searchClient';

require('./App.css');

const storeData = {
  firstName: 'taco',
};

export default () => {
  const [queryResult, setQueryResult] = useState({});
  async function handleQueryChange(query){
    console.log('query is ', query);
    const result = await search({q: query});
    console.log('search result: ', result);
  }
  useEffect(()=>{

  });
  return (<div>
    <h1>Hello World</h1>
    <Search onChange={handleQueryChange}/>

  </div>)
}

//  const [storeDataS] = storeHook.storeDataSmartHook.useStateWithStore();
{/*<div>*/}
  {/*{JSON.stringify(storeDataS)}*/}
{/*</div>*/}
//console.log('App rendering with store: ', storeDataS);
