
export default {
    async detectNetwork(state: any) {
        const self = getApp() || this;

        self.commit('networkStatus', await wx.Promise.getNetworkType());

        wx.onNetworkStatusChange((res: any) => {
            self.commit('networkStatus', res);
        });
        return;
    }
};
