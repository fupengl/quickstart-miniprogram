import t from '@/libs/utils';
import { wxPromise } from '@/libs/wx/utils';

const linkTo = ({ url, type, data }: { url: string, type: string, data: object }) => {
  return wxPromise(wx[type])(t.getUrlQuery(url, data));
};

// rewrite wx api to promise functions
const functionNames = [
  'login',
  'getUserInfo',
  'checkSession',
  'getStorageInfo',
  'chooseAddress',
  'clearStorage',
  'getNetworkType',
  'getSystemInfo',
  'canvasToTempFilePath',
  'saveImageToPhotosAlbum',
  'getImageInfo',
  'setClipboardData',
  'makePhoneCall',
  'chooseImage',
  'getSetting',
  'requestPayment',
  'navigateBack',
  'stopPullDownRefresh'
];

interface IWxApiTheme {
  toastMask: boolean;
  toastDuration: number;
  cancelColor?: string;
  confirmColor?: string;
}

// promise wxApi
export function promisify({ toastMask, toastDuration, confirmColor, cancelColor }: IWxApiTheme) {
  // @ts-ignore
  const wxApi: wxApi = {};

  functionNames.forEach(fnName => {
    wxApi[fnName] = opt => wxPromise(wx[fnName])(opt);
  });

  wxApi.getStorage = async (key: string) => {
    try {
      return (await wxPromise(wx.getStorage)({ key }) as wx.GetStorageSuccessCallbackResult).data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  wxApi.setStorage = (key: string, data: any) => wxPromise(wx.setStorage)({ key, data });

  wxApi.removeStorage = (key: string) => wxPromise(wx.removeStorage)({ key } as wx.RemoveStorageOption);

  wxApi.showLoading = (options?: wx.ShowLoadingOption) => wxPromise(wx.showLoading)(Object.assign({}, {
    title: '加载中',
    mask: toastMask
  } as wx.ShowLoadingOption, options));

  wxApi.hideLoading = () => wxPromise(wx.hideLoading)();

  wxApi.showToast = (options: wx.ShowToastOption) => wxPromise(wx.showToast)(Object.assign({}, {
    mask: toastMask,
    icon: 'none',
    duration: toastDuration
  } as wx.ShowToastOption, options));

  wxApi.showModal = (options: wx.ShowModalOption) => wxPromise(wx.showModal)(Object.assign({}, {
    title: '提示',
    content: '',
    cancelColor,
    confirmColor
  } as wx.ShowModalOption, options));

  wxApi.setNavigationBarTitle = (title: string) => wxPromise(wx.setNavigationBarTitle)({ title } as wx.SetNavigationBarTitleOption);

  wxApi.navigateTo = ({ url }: wx.NavigateToOption, data: object = {}) => linkTo({ url, data, type: 'navigateTo' });

  wxApi.redirectTo = ({ url }: wx.NavigateToOption, data: object = {}) => linkTo({ url, data, type: 'redirectTo' });

  wxApi.switchTab = ({ url }: wx.NavigateToOption, data: object = {}) => linkTo({ url, data, type: 'switchTab' });

  wxApi.reLaunch = ({ url }: wx.NavigateToOption, data: object = {}) => linkTo({ url, data, type: 'reLaunch' });

  return wxApi;
}
