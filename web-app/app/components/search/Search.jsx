import React, { useState } from 'react';

export default function Search({onChange=()=>{}}) {
  let [stateValue, setValue] = useState('');
  console.log('Search stateValue: ', stateValue);
  return (
    <div>
      <input type="text" value={stateValue} onChange={(e)=> {
        setValue(e.target.value);
        onChange(e.target.value);
      }} />
    </div>
  );
}
