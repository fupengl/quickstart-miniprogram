import Store, { createStore } from './store';
import WxApi, { promisify } from './utils/wxApi';

// dispatch request lock
const requestLock: {
    status: boolean;
    request: Promise<any> | null,
    count: number,
} = {
    status: false, // lock status
    request: null, // request method
    count: 0, // current locking request count (resolve concurrent lock problem)
};

App(Object.assign({
    requestLock,
    async onLaunch() {
        // init wx promise api mount wx.Promise
        promisify.call(this);
        // init store
        createStore.call(this);
    }
}, Store, WxApi));
