const ACTIONS: any = {};
const MUTATIONS: any = {};
const GETTER: any = {};

// 将 state 挂载到 getApp().state
function _setState(state: any) {
    this.state = Object.assign({}, state);
}

function _setAction(actions: any) {
    Object.assign(ACTIONS, actions);
}

function _setMutation(mutations: any) {
    Object.assign(MUTATIONS, mutations);
}

function _setGetter(getter: any) {
    Object.assign(GETTER, getter);
}

export function createStore() {
    const stateModules: any = require('./state');
    const actionModules: any = require('./actions');
    const mutationModules: any = require('./mutations');
    const getterModules: any = require('./getter');

    // has module namespace in getApp().state
    if (stateModules) {
        _setState.call(this, stateModules.default);
    }

    // has module namespace in MUTATIONS
    if (mutationModules) {
        _setMutation(mutationModules.default);
    }

    // has module namespace in ACTIONS
    if (actionModules) {
        _setAction(actionModules.default);
    }

    // has module namespace in GETTER
    if (getterModules) {
        _setGetter(getterModules.default);
    }
}

function dispatch(keyname: string, param: any) {
    const currentModuleName = Object.keys(ACTIONS).find(moduleName =>
        ACTIONS[moduleName].hasOwnProperty(keyname));

    if (currentModuleName) {
        const self = getApp() || this;
        return ACTIONS[currentModuleName][keyname]
            .call(this, self.state[currentModuleName], param);
    } else {
        console.log(`could not dispatch ${keyname}. ${keyname} callback is undefined.`);
    }
}

function getter(keyname: string, param: any) {
    const currentModuleName = Object.keys(GETTER).find(moduleName => GETTER[moduleName].hasOwnProperty(keyname));

    if (currentModuleName) {
        const self = getApp() || this;
        return GETTER[currentModuleName][keyname]
            .call(this, self.state[currentModuleName], param);
    } else {
        console.log(`could not dispatch ${keyname}. ${keyname} callback is undefined.`);
    }
}

function commit(keyname: string, param: any) {
    const currentModuleName = Object.keys(MUTATIONS).find(moduleName =>
        MUTATIONS[moduleName].hasOwnProperty(keyname));

    if (currentModuleName) {
        const self = getApp() || this;
        self.state[currentModuleName] = MUTATIONS[currentModuleName][keyname]
            .call(null, self.state[currentModuleName], param);
    } else {
        console.log(`could not commit ${keyname}. ${keyname} callback is undefined.`);
    }
}

export default {
    commit,
    dispatch,
    getter
};
