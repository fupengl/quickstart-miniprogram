import Conf from '@/config';
import { createLogger } from '@/libs/log';
import Store, { createStore } from '@/store';
import WxApi from '@/utils/wxApi';

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
  WxApi,
  async onLaunch(options) {
    // init store
    createStore.call(this);
    // init log
    createLogger.call(this, {
      wxAppid: Conf.APP.config.wxAppId,
      version: Conf.APP.version
    });
  }
}, Store));
