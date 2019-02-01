import Conf from '@/config';
import { createLogger } from '@/libs/wx/log';
import Store, { createStore } from '@/store';
import wxApi from '@/utils/wxApi';

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
  wxApi,
  async onLaunch(options) {
    // mount store in getApp().state
    createStore.call(this);
    // mount logger in getApp().logger
    createLogger.call(this, {
      wxAppid: Conf.APP.config.wxAppId,
      version: Conf.APP.version
    });
  }
}, Store));
