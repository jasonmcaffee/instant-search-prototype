import {useState} from 'react';
export default class SmartHook{
  propertyName;
  value;
  beforeSetValueFuncs; // async await these
  afterSetValueFuncs; // just execute
  useStateFunc; //react's useState
  originalSetValue; // what useState() returns
  constructor({useStateFunc=useState, propertyName='', value, beforeSetValueFuncs=[], afterSetValueFuncs=[]}={}){
    const [useStateValue, originalSetValue] = useStateFunc(value);
    console.log(`SmartHook constructor ${propertyName}: useStateValue`, useStateValue, ' value: ', value);
    Object.assign(this, {useStateFunc, propertyName, value: useStateValue, beforeSetValueFuncs, afterSetValueFuncs, originalSetValue});
    // console.log('smartHook: ', this);
  }

  /**
   * Match the react useState api, returning an array of [value, setValue]
   * @returns {[null,null]}
   */
  useState(v){
    console.log('SmartHook useState value: ', this.value);
    return [this.value, this.setValue.bind(this, v)];
  }

  useStateWithStore(){
    return [this.value, this.setValue.bind(this)];
  }

  registerAfterSetValueFunc({func}){
    if(typeof func !== 'function'){ return console.warn('no func provided'); }
    this.afterSetValueFuncs.push(func);
    const unregisterFunc = ()=>{
      console.log('unregistering afterSetValueFunc');
      this.unregisterAfterSetValueFunc({func});
    };
    return unregisterFunc;
  }

  unregisterAfterSetValueFunc({func}){
    console.log('unregistering func: ', func);
    const index = this.afterSetValueFuncs.indexOf(func);
    if(index < 0){ return; }
    this.afterSetValueFuncs.splice(index, 1);
  }

  /**
   * Set the value, firing before set funcs and after set funcs.
   * @param v
   * @returns {Promise.<void>}
   */
  setValue(v){
    console.log('SmartHook.setValue: ', v);
    let value = v;
    const {beforeSetValueFuncs, afterSetValueFuncs, originalSetValue} = this;

    if(Array.isArray(beforeSetValueFuncs)){
      //allow the value to be modified by each func, consecutively
      for(const beforeSetValueFunc of beforeSetValueFuncs){
        value = beforeSetValueFunc(this);
      }
    }

    originalSetValue(value);

    if(Array.isArray(afterSetValueFuncs)){
      //allow the value to be modified by each func, consecutively
      for(const afterSetValueFunc of afterSetValueFuncs){
        afterSetValueFunc(this);
      }
    }
  }
}

//
// function getPropertyName(obj, expression) {
//   const res = {};
//   Object.keys(obj).map(k => { res[k] = () => k; });
//   return expression(res)();
// }
