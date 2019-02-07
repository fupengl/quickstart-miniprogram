import Conf from '@/config';
import { createLogger } from '@/libs/wx/log';
import Store, { createStore } from '@/store';
import wxApi from '@/utils/wxApi';

App(Object.assign({
  requestLock: {
    status: false,
    request: null,
    count: 0
  },
  wxApi,
  async onLaunch(options) {
    // mount store in getApp().state
    createStore.call(this);
    // mount logger in getApp().logger
    createLogger.call(this , {
      wxAppid: Conf.APP.config.wxAppId,
      version: Conf.APP.version
    });
  }
}, Store));
