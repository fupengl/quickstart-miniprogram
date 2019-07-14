import router from '@C/route';
import t from '@L/utils/index';
import { WatcherPage } from '@L/wx/watch/page';

WatcherPage({
  data: {
    motto: '点击 “编译” 以构建',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  watch: {
    userInfo(val) {
      console.log(val);
    }
  },

  bindViewTap() {
    getApp().wxApi.navigateTo(router.LOGS).then(res => {
      console.log(res);
    });
  },

  async onLoad() {
    let logs: number[] = [];
    try {
      logs = await getApp().wxApi.getStorage('logs');
    } catch (error) {
      console.log(error);
    } finally {
      logs.unshift(Date.now());
      getApp().wxApi.setStorage('logs', logs);
    }
  },

  getUserInfo: t.debounce(function ({ detail: { userInfo } }: WXEventBasic) {
    this.setData({
      userInfo,
      hasUserInfo: true
    });
  }, 300),
});
