Page({
  data: {
    motto: '点击 “编译” 以构建',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },

  onLoad() {
    const logs: number[] = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },

  getUserInfo(e: any) {
    console.log(e);
    this.setData!({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  }
});
