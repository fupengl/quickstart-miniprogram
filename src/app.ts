import Conf from '@/config';
import { createLogger, ILoggerOptions, initAppHandel } from '@/libs/log';
import Store, { createStore } from '@/store';
import WxApi, { promisify } from '@/utils/wxApi';

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

initAppHandel();
App(Object.assign({
    requestLock,
    async onLaunch(options) {
        // init wx promise api mount wx.Promise
        promisify.call(this);
        // init store
        createStore.call(this);
        // init log
        createLogger.call(this, {
            wxAppid: Conf.APP.config.wxAppId,
            version: Conf.APP.version
        } as ILoggerOptions);
    }
}, Store, WxApi));
