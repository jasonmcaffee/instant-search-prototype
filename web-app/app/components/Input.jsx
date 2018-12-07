import React, { useState } from 'react';

export default function Input({type='text', textHook=useState('')}) {
  let [stateValue, setValue] = textHook;
  console.log('Input stateValue: ', stateValue);
  return (
    <div>
      <input type={type} value={stateValue} onChange={(e)=> setValue(e.target.value) } />
    </div>
  );
}
