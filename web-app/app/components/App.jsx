import React from 'react';
import { Provider } from 'react-redux';
import Search from './search/Search';
import store from '../store/store';

export default () => {
  return (
    <Provider store={store}>
      <Search />
    </Provider>
  )
}

