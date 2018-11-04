export default {
    login(state: any, action: any = {}): any {
        console.log(state, action);
        if (Object.keys(action).length) {
            state.baseInfo = Object.assign({}, action);
        }
        return state;
    },
    setToken(state: any, action: any = {}): any {
        state.token = action || {};
        wx.setStorageSync('TOKEN', state.token);
        wx.setStorageSync('TOKEN_TIME', new Date().valueOf() + 86400 * 7);
        return state;
    },
    setCorpInfo(state: any, action: any = {}): any {
        state.corpInfo = action || {};
        if (Object.keys(action)) {
            wx.setStorageSync('corpInfo', state.corpInfo);
        }
        return state;
    },
    setSellerInfo(state: any, action: any = {}): any {
        state.sellerInfo = action || {};
        if (Object.keys(action)) {
            wx.setStorageSync('sellerInfo', state.sellerInfo);
        }
        return state;
    },
    setCustomerInfo(state: any, action: any = {}): any {
        state.customerInfo = action || {};
        // if (Object.keys(action)) {
        //     wx.setStorageSync('customerInfo', state.customerInfo);
        // }
        return state;
    },
    setSpreadInfo(state: any, action: any = {}): any {
        state.spreadInfo = action || {};
        return state;
    },
};
