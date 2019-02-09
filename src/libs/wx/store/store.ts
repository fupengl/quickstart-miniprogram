import t from '@/libs/utils';

function checkRepeatFunc(modules) {
  const funcName: string[] = [];
  Object.keys(modules).forEach(moduleName => {
    const moduleFuncName = Object.keys(modules[moduleName]);
    const intersectArr = t.intersect(funcName, moduleFuncName);
    if (intersectArr.length) {
      throw new Error(`Store error : ${moduleName} has repeat func ${JSON.stringify(intersectArr)}`);
    } else {
      funcName.push(...moduleFuncName);
    }
  });
}

export function findModuleNameByFuncName(modules: object, funcName: string) {
  return Object.keys(modules).find(moduleName => modules[moduleName].hasOwnProperty(funcName));
}

export class Store {

  $state: object = {};
  actions: wxStore.dispatchFunc = {};
  mutations: wxStore.mutationFunc = {};
  getters: wxStore.getterFunc = {};

  constructor({
    stateModules = {},
    actionModules = {},
    mutationModules = {},
    getterModules = {}
  }) {
    try {
      checkRepeatFunc(actionModules);
      checkRepeatFunc(mutationModules);
      checkRepeatFunc(getterModules);
      this.actions = actionModules;
      this.mutations = mutationModules;
      this.getters = getterModules;
      this.$state = stateModules;
    } catch (error) {
      console.error(error);
    }
  }
}
