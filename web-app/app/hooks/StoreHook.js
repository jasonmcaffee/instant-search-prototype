import {useState} from 'react';
import SmartHook from './SmartHook';
/**
 * should be able to do something like storeHook.firstName = 'jason', and components update.
 */
export default class StoreHook{
  storeData = {
    firstName: '',
  };
  storeSmartHooks = { //we will improve the api with proxy later.
    lastName: {
      value: '',
      setValue: (e)=>{},
      useState: ['value', function setValue(){}]
    }
  };
  storeDataSmartHook; //how storeData prop should be
  unregisterFuncs=[];
  constructor({storeData, useStateFunc=useState}){
    console.log('StoreHook Constructor');
    const storeDataSmartHook = new SmartHook({value: storeData, useStateFunc, propertyName: 'storeData'});
    Object.assign(this, {storeData, storeDataSmartHook});
    this.storeSmartHooks = createSmartHookForEachProp({obj: storeData});
    this.unregisterFuncs = haveStoreHooksUpdateStoreData({storeSmartHooks: this.storeSmartHooks, storeDataSmartHook});
  }

  destroy(){
    this.unregister();
  }
  unregister(){
    this.unregisterFuncs.forEach(u => u());
    this.unregisterFuncs = [];
  }
}

function createSmartHookForEachProp({obj}){
  if(obj === undefined) { return console.error('cant create smart hooks for undefined obj'); }
  const stateHook = Object.keys(obj).reduce((result, propertyName)=>{
    const initialValue = obj[propertyName]; //get initial value from state
    result[propertyName] = new SmartHook({useState, propertyName, value: initialValue, });
    return result;
  }, {});
  return stateHook;
}

function haveStoreHooksUpdateStoreData({storeSmartHooks, storeDataSmartHook}){
  if(storeSmartHooks === undefined) { return console.error('cant update with undefined storeSmartHooks'); }
  const unregisterArr = Object.entries(storeSmartHooks).map( ([, smartHook]) => haveSmartHookUpdateStoreData({smartHook, storeDataSmartHook}) );
  return unregisterArr;
}

function haveSmartHookUpdateStoreData({smartHook, storeDataSmartHook}){
  const unregister = smartHook.registerAfterSetValueFunc({func:({value, propertyName})=>{
    const [storeData, setStoreData] = storeDataSmartHook.useStateWithStore();
    storeData[propertyName] = value;
    setStoreData(storeData);
    console.log('storeData is now: ', storeData);
  }});
  return unregister;
}


