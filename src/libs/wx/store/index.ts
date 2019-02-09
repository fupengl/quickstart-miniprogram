import { findModuleNameByFuncName, Store } from './store';

export function createStore(storeModules) {
  // mount $state in App
  const store = new Store(storeModules);
  this.$state = store.$state;

  // mount dispatch function func in App
  this.dispatch = function dispatch(funcName: string, params?: any) {
    const moduleName = findModuleNameByFuncName(store.actions, funcName);
    if (moduleName) {
      return store.actions[moduleName][funcName].call(this, this.$state[moduleName], params);
    } else {
      console.log(`dispatch ${funcName} callback is undefined.`);
    }
  };

  // mount commit function in App
  this.commit = function dispatch(funcName: string, params?: any) {
    const moduleName = findModuleNameByFuncName(store.mutations, funcName);
    if (moduleName) {
      this.$state[moduleName] = store.mutations[moduleName][funcName].call(this, this.$state[moduleName], params);
    } else {
      console.log(`commit ${funcName} callback is undefined.`);
    }
  };

  // mount getter function in App
  this.getter = function dispatch(funcName: string, params?: any) {
    const moduleName = findModuleNameByFuncName(store.getters, funcName);
    if (moduleName) {
      return store.getters[moduleName][funcName].call(this, this.$state[moduleName], params);
    } else {
      console.log(`getter ${funcName} callback is undefined.`);
    }
  };
}
