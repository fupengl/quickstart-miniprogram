import CONFIG from '../config';
import { queryStringfy } from './index';

export const showLoading = (options = {}) => {
    wx.showLoading(Object.assign({
        title: '加载中',
        mask: 'true'
    }, options));
};

export const hideLoading = (options = {}) => {
    wx.hideLoading();
};

export const showToast = (options = {}) => {
    wx.showToast(Object.assign({
        title: '成功',
        mask: 'true',
        icon: 'none',
        duration: CONFIG.THEME.toastDuration
    }, options));
};

export const showModal = (options = {}) => {
    return wx.Promise.showModal(Object.assign({}, {
        title: '提示',
        content: '',
        cancelColor: CONFIG.THEME.disabledColor,
        confirmColor: CONFIG.THEME.mainColor
    }, options));
};

export const setTitle = (title: string) => {
    wx.setNavigationBarTitle({ title });
};

const linkTo = ({ url, type, data }: { url: string, type: string, data: any }) => {
    // TODO: `AUTH` might be a property from getApp() or data
    // Here we just set it to `true` if you don't have auth stuff.
    const AUTH = true;

    if (AUTH) {
        switch (type) {
            case 'navigateTo':
                wx.navigateTo(getUrlQuery(url, data));
                break;
            case 'redirectTo':
                wx.redirectTo(getUrlQuery(url, data));
                break;
            case 'switchTab':
                wx.switchTab(getUrlQuery(url, data));
                break;
            case 'reLaunch':
                wx.reLaunch(getUrlQuery(url, data));
                break;
            default: break;
        }
    } else {
        showModal({
            content: '请登陆后再访问',
            showCancel: false,
            success() {
                // TODO: for example: go to the login page
                // wx.reLaunch(LOGIN_PATH)
            }
        });
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

export const getUrlQuery = (url: string, data: object = {}) => {
    return { url: [url, queryStringfy(data)].filter(v => v).join('?') };
};

export default {
    showLoading,
    hideLoading,
    showToast,
    showModal,
    navigateTo,
    redirectTo,
    switchTab,
    reLaunch,
    getUrlQuery,
    setTitle
};

// promisify
export const promisify = () => {
    wx.Promise = {}; // wx.Promise 下面挂载着返回 promise 的 wx.API

    // 普通的要转换的函数
    const functionNames = [
        'login',
        'showModal',
        'getUserInfo',
        'navigateTo',
        'checkSession',
        'getStorageInfo',
        'removeStorage',
        'clearStorage',
        'getNetworkType',
        'getSystemInfo',
        'canvasToTempFilePath',
        'saveImageToPhotosAlbum',
        'getImageInfo',
        'setClipboardData',
        'makePhoneCall',
        'uploadFile',
        'chooseImage'
    ];

    functionNames.forEach(fnName => {
        wx.Promise[fnName] = (obj: any = {}) => {
            return new Promise((resolve, reject) => {
                obj.success = (res: any) => {
                    console.log(`wx.${fnName} success`, res);
                    resolve(res);
                };
                obj.fail = (err: any) => {
                    console.error(`wx.${fnName} fail`, err);
                    reject(err);
                };
                wx[fnName](obj);
            });
        };
    });

    wx.Promise.getStorage = (key: string) => {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key,
                success: res => {
                    resolve(res.data); // unwrap data
                },
                fail: err => {
                    reject(err);
                }
            });
        });
    };

    wx.Promise.setStorage = (key: string, value: any) => {
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key,
                data: value,
                success: res => {
                    resolve(value); // 将数据返回
                },
                fail: err => {
                    reject(err);
                }
            });
        });
    };

    wx.Promise.removeStorage = (key: string) => {
        return new Promise((resolve, reject) => {
            wx.removeStorage({
                key,
                success: res => {
                    resolve(res); // 将数据返回
                },
                fail: err => {
                    reject(err);
                }
            });
        });
    };

    wx.Promise.request = (options: any) => {
        if (options.toast) {
            wx.showToast({
                title: options.toast.title || '加载中',
                icon: 'loading'
            });
        }

        return new Promise((resolve, reject) => {
            wx.request({
                url: options.url,
                method: options.method || 'GET',
                data: options.data,
                header: options.header,
                success: res => {
                    resolve(res);
                },
                fail: err => {
                    console.error('wx.request fail [network]', options, err);
                    reject(err);
                }
            });
        });

    };
};
