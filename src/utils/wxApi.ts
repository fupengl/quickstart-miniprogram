import { wxPromise } from '@/libs/wx/utils';
import CONFIG from '@C/index';
import t from '@T/tools';

export const showLoading = (options?: wx.ShowLoadingOption) => {
  wx.showLoading(Object.assign({}, {
    title: '加载中',
    mask: 'true'
  }, options));
};

export const hideLoading = () => {
  wx.hideLoading({});
};

export const showToast = (options?: wx.ShowToastOption) => {
  wx.showToast(Object.assign({}, {
    title: '成功',
    mask: 'true',
    icon: 'none',
    duration: CONFIG.THEME.toastDuration
  }, options));
};

export const showModal = (options?: wx.ShowModalOption) => {
  return wx.showModal(Object.assign({}, {
    title: '提示',
    content: '',
    cancelColor: CONFIG.THEME.disabledColor,
    confirmColor: CONFIG.THEME.mainColor
  }, options));
};

export const setTitle = (title: string) => {
  wx.setNavigationBarTitle({ title });
};

const linkTo = ({ url, type, data }:
  { url: string, type: string, data: any }) => {
  // TODO: `AUTH` might be a property from getApp() or data
  // Here we just set it to `true` if you don't have auth stuff.
  const AUTH = true;

  if (!AUTH) {
    showModal({
      title: '提示',
      content: '请登录后再访问',
      showCancel: false,
      success(e: any) {
        // TODO: for example: go to the login page
        // wx.reLaunch(LOGIN_PATH)
      }
    });
    return;
  }
  switch (type) {
    case 'navigateTo':
      wx.navigateTo(t.getUrlQuery(url, data));
      break;
    case 'redirectTo':
      wx.redirectTo(t.getUrlQuery(url, data));
      break;
    case 'switchTab':
      wx.switchTab(t.getUrlQuery(url, data));
      break;
    case 'reLaunch':
      wx.reLaunch(t.getUrlQuery(url, data));
      break;
    default: break;
  }
};

export const navigateTo = ({ url }: any, data?: object) => {
  linkTo({ url, data, type: 'navigateTo' });
};

export const redirectTo = ({ url }: any, data?: object) => {
  linkTo({ url, data, type: 'redirectTo' });
};

export const switchTab = ({ url }: any, data?: object) => {
  linkTo({ url, data, type: 'switchTab' });
};

export const reLaunch = ({ url }: any, data?: object) => {
  linkTo({ url, data, type: 'reLaunch' });
};

const wxApi: any = {
  showLoading,
  hideLoading,
  showToast,
  showModal,
  navigateTo,
  redirectTo,
  switchTab,
  reLaunch,
  setTitle
};

// promise wxApi
(function promisify() {

  // 普通的要转换的函数
  const functionNames = [
    'login',
    'showModal',
    'getUserInfo',
    'checkSession',
    'getStorageInfo',
    'chooseAddress',
    'removeStorage',
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

  functionNames.forEach(fnName => {
    wxApi[fnName] = (opt: any) => wxPromise(wx[fnName])(opt);
  });

  wxApi.getStorage = (key: string) => {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success: res => {
          resolve(res.data); // unwrap data
        },
        fail: err => {
          reject(err); // not reject, resolve undefined
        }
      });
    });
  };

  wxApi.setStorage = (key: string, value: any) => {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key,
        data: value,
        success: res => {
          resolve(res); // 将数据返回
        },
        fail: err => {
          reject(err);
        }
      });
    });
  };

  wxApi.removeStorage = (key: string) => {
    return new Promise((resolve, reject) => {
      wx.removeStorage({
        key,
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  };

})();

export default wxApi;
