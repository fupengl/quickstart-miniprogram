/// <reference path="./libs/typings/wx/lib.wx.api.d.ts" />

declare interface wxApi extends wx.WX {
  showLoading(options?: wx.ShowLoadingOption)
  hideLoading()
  showToast(options?: wx.ShowToastOption)
  showModal(options?: wx.ShowModalOption)
  setStorage(key: string, data: any)
  setTitle(title: string)
  getStorage(key: string)
  removeStorage(key: string)
  navigateTo(options: any, data?: object)
  redirectTo(options: any, data?: object)
  switchTab(options: any, data?: object)
  reLaunch(options: any, data?: object)
}
