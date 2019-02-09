import Conf from '@/config';
import { createWxApi } from '@/libs/wx/api';
import { createLogger } from '@/libs/wx/log';
import { createStore } from '@/libs/wx/store';
import store from '@/store';

App({
  requestLock: {
    status: false,
    request: null,
    count: 0
  },
  onLaunch(options) {
    // mount wxApi in getApp().wxApi
    createWxApi.call(this, Conf.THEME);
    // mount store in getApp().$state
    createStore.call(this, store);
    // mount logger in getApp().logger
    createLogger.call(this, {
      wxAppid: Conf.APP.config.wxAppId,
      version: Conf.APP.version
    });
    this.dispatch('detectNetwork');
  }
});
