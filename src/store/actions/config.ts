
export default {
  async detectNetwork() {
    this.commit('networkStatus', await this.wxApi.getNetworkType());

    wx.onNetworkStatusChange((res: wx.OnNetworkStatusChangeCallbackResult) => {
      this.commit('networkStatus', res);
    });
    return;
  }
} as wxStore.dispatchFunc;
