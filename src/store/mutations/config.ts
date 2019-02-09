export default {
  setAppConfig(state: any, action: any) {
    Object.assign(state, action);
    return state;
  },
  networkStatus(state: any, action: any) {
    console.warn('[network.networkType]: ', action.networkType);

    const { networkType } = action;
    let { isConnected } = action;
    if (isConnected === undefined) {
      isConnected = networkType === 'none' ? false : true;
    }

    state.networkStatus = { isConnected, networkType };
    return state;
  }
} as wxStore.mutationFunc;
