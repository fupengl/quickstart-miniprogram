/// <reference path="../../typings/wx/lib.wx.api.d.ts" />

declare interface wxApi {
  login(): Promise<wx.LoginSuccessCallbackResult>
  getSetting(): Promise<wx.GetSettingSuccessCallbackResult>
  getNetworkType(): Promise<wx.GetNetworkTypeSuccessCallbackResult>
  showLoading(options?: wx.ShowLoadingOption): Promise<wx.GeneralCallbackResult>
  hideLoading(): Promise<wx.GeneralCallbackResult>
  showToast(options?: wx.ShowToastOption): Promise<wx.GeneralCallbackResult>
  showModal(options?: wx.ShowModalOption): Promise<wx.GeneralCallbackResult>
  setStorage(key: string, data: any): Promise<wx.GeneralCallbackResult>
  getStorage(key: string): Promise<string | object | array>
  removeStorage(key: string): Promise<wx.GeneralCallbackResult>
  navigateTo(options: wx.NavigateToOption, data: object = {}): Promise<wx.GeneralCallbackResult>
  redirectTo(options: wx.NavigateToOption, data: object = {}): Promise<wx.GeneralCallbackResult>
  switchTab(options: wx.NavigateToOption, data: object = {}): Promise<wx.GeneralCallbackResult>
  reLaunch(options: wx.NavigateToOption, data: object = {}): Promise<wx.GeneralCallbackResult>
  setNavigationBarTitle(title: string): Promise<wx.GeneralCallbackResult>
}
