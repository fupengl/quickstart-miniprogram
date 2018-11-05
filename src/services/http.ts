import Conf from '../config';
import { file } from '../config/api';
import { strFormat } from '../utils';
import { showLoading, showToast } from '../utils/wxApi';

let reLoginTimes = 1;

export interface IRequestParams {
    method: string;
    url: string;
    data?: object;
    params?: object;
    header?: object;
}

export interface IRequestExtraConfig {
    isAuth: boolean;
    isLock: boolean;
    hasLoading: boolean;
    [key: string]: any;
}

export interface IUploadFile {
    url: string;
    filePath: string;
    formData?: object;
    header?: object;
}

export interface IResponse {
    statusCode: number;
    data: any;
    errMsg: string;
    header: any;
}

// requestID
export function generateRequestID(): string {
    let num: number = 0;
    const rando = (m: number): number => {
        let num = '';
        for (let i = 0; i < m; i++) {
            const val = parseInt((Math.random() * 10).toString(), 10);
            if (i === 0 && val === 0) {
                i--;
                continue;
            }
            num += val;
        }
        return parseInt(num, 10);
    };
    if (!getApp().request_id) {
        num = rando(8);
        getApp().request_id = num;
    } else {
        getApp().request_id++;
        num = getApp().request_id;
    }
    return num.toString();
}

export class HttpService {

    static getUrl(uri: string): string {
        const { BASE_API } = Conf.APP.config;

        if (uri.match(/^http/)) {
            return uri;
        }

        return uri.indexOf('/') === 0
            ? BASE_API + uri
            : BASE_API + '/' + uri;
    }

    private static async _parseRequestOptions(req: WXNetAPIRequestObj, isAuth: boolean): Promise<WXNetAPIRequestObj> {
        const { pin_appid, corp_id } = wx.getExtConfigSync();
        if (isAuth) {
            const { pin_uid, token } = await getApp().dispatch('getToken');
            if (!req.header) {
                req.header = {};
            }
            req.url = strFormat(req.url, { pin_uid });
            Object.assign(req.header, { 'X-Pin-Authorization': token, 'X-Pin-CorpID': corp_id });
        }
        req.url = strFormat(req.url, { pin_appid });
        return req;
    }

    private static _parseResponse(res: IResponse): any[] {
        // hack
        wx.hideLoading();
        return [res.data, res.header];
    }

    // currently, post or get method both go into this function
    jsonRequest(data: IRequestParams, config: IRequestExtraConfig): Promise<any> {
        return this.preRequest(data, config);
    }

    fileUpload(opt: IUploadFile): Promise<any> {
        return new Promise((resolve, reject) => {
            if (opt.url.indexOf('https://') < 0) {
                opt.url = file.upload.url + opt.url;
            }
            if (!opt.formData) {
                opt.formData = {
                    app_id: Conf.APP.config.APP_ID,
                    request_id: generateRequestID()
                };
            }
            (opt as WXNetAPIUploadFileObj).name = file.upload.key;
            wx.Promise.uploadFile().then((data: IResponse) => {
                if (data.statusCode === 200) {
                    const result = JSON.parse(data.data);
                    // const path = file.upload.prefix + result.uuid;
                    console.warn('upload success-->', result);
                    resolve(...[result, data.header]);
                }
                reject(data.errMsg);
            }).catch((err: IResponse) => {
                reject(err);
            });
        });
    }

    // [review] note: 目前只考虑多并发中有且仅有一个锁 即不兼容并发中多个 lock 为 true 的情况
    async preRequest(req: WXNetAPIRequestObj, config: IRequestExtraConfig): Promise<any> {
        const { hasLoading = false, isLock = false } = config;

        // detect current network
        if (!getApp().state.config.networkStatus.isConnected) {
            showToast({
                title: '网络不见啦!',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        if (hasLoading) {
            showLoading({ title: '加载中' });
        }

        // detect lock status
        if (getApp().requestLock.status && !isLock) {
            console.warn('Ohh, we are waiting for some request finishing first.');

            try {
                await getApp().requestLock.request;
                console.warn('Wow, getApp().requestLock.request success.');
            } catch (error) {
                // if getApp().requestLock.request failed, the following requests should not be executed
                console.warn('Oops, getApp().requestLock.request failed.');
                return;
            }
        }

        // lock status === false
        // lock status === true && isLock == true
        return this.request(req, config);
    }

    // todo related params
    async request(req: WXNetAPIRequestObj, config: IRequestExtraConfig): Promise<any> {
        const { isAuth = true } = config;
        req = await HttpService._parseRequestOptions(req as WXNetAPIRequestObj, isAuth);
        console.warn('request start, config: ', config, req);
        return new Promise((resolve, reject) => {
            req.url = HttpService.getUrl(req.url);
            wx.Promise.request(req).then(async (res: IResponse) => {
                const { statusCode, data } = res;

                if (statusCode >= 200 && statusCode <= 300) {
                    return resolve(...HttpService._parseResponse(res));
                } else if (statusCode === 401 && reLoginTimes) {
                    reLoginTimes = 0;
                    try {
                        await getApp().dispatch('login');
                        req = await HttpService._parseRequestOptions(req as WXNetAPIRequestObj, isAuth);
                        reLoginTimes = 1;
                        return resolve(await this.request(req, config));
                    } catch (error) {
                        return reject(...HttpService._parseResponse(res));
                    }
                } else {
                    return reject(...HttpService._parseResponse(res));
                }
            }).catch((err: any) => {
                reject(...HttpService._parseResponse(err));
            });
        });
    }
}
