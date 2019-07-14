import Conf from '@/config/index';
import { createWxApi } from '@/libs/wx/api/index';
import { createLogger } from '@/libs/wx/log/index';
import { createStore } from '@/libs/wx/store/index';
import store from '@/store/index';

App({
  requestLock: {
    status: false,
    request: null,
    count: 0
  },
  async onLaunch(options) {
    try {
      // mount wxApi in getApp().wxApi
      createWxApi.call(this, Conf.THEME);
      // mount store in getApp().$state
      createStore.call(this, store);
      // mount logger in getApp().logger
      createLogger.call(this, {
        wxAppid: Conf.APP.config.wxAppId,
        version: Conf.APP.version
      });
      // check network status
      await this.dispatch('detectNetwork');
    } catch (error) {
      console.log(error);
    }
  }
});
