import router from '@C/route';

Page({
  data: {
    motto: '点击 “编译” 以构建',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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

  getUserInfo(e: any) {
    console.log(e);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
});
