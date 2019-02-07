Page({
  data: {
    logs: [] as string[]
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map((log: number) => {
        return log;
      })
    });
  },
});
