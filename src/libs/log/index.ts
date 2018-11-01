
import ApiLog, { createApiLog } from './apiLog';
import { MissingError } from './util';

// rid type
enum LogType {
    SLOW_API = 'slow_api',
    SCRIPT_ERROR = 'js_error',
    PAGE_ERROR = 'page_error',
    DEVICE_ERROR = 'device_error'
}

enum ErrorType {
    JS_ERROR = 'js error',
    API_ERROR = 'api error',
    NETWORK_ERROR = 'network_error'
}

interface IAppInfo {
    version: string; // app version
    wxAppid: string; // wx app id
}

// log module options
export interface ILoggerOptions extends IAppInfo {
    getLocation: boolean; // get user loacation
    statShareApp: boolean; // capture shareApp
    statPullDownFresh: boolean;
    statReachBottom: boolean;
    statApiSpeed: boolean;
    apiMaxRequestTime: number;
}

interface IReportData extends IAppInfo {
    rid: LogType;
    cat: ErrorType;
    data: ApiLog;
    deviceInfo: WXSystemInfo;
}

class Log {

    static options: ILoggerOptions;
    static networkType: string;
    static isConnected: boolean = true;

    logs: IReportData[] = []; // all log
    pageLog: any[] = []; // page event log
    AppLog: any[] = []; // app event log

    private requestUrl: string = 'http://dev1.pinquest.cn/api/oss/Report';

    constructor({ wxAppid, version, ...options }: ILoggerOptions) {
        if (!wxAppid || !version) {
            MissingError('wxAppid', 'version');
            return;
        }
        Log.options = Object.assign({}, {
            getLocation: false,
            statPullDownFresh: true,
            statReachBottom: true,
            statApiSpeed: true,
            apiMaxRequestTime: 500
        }, options) as ILoggerOptions;

        this.handelNetworkStatus();
    }

    // add slow api and err log
    createApiLog({ isError, timeCut, ...other }: ApiLog) {
        this.handelNetworkStatus();
        if (timeCut > Log.options.apiMaxRequestTime || isError) {
            this.createLog(LogType.SLOW_API, ErrorType.API_ERROR, {
                timeCut,
                ...other
            } as ApiLog);
        }
    }

    // add log
    createLog(rid: LogType, cat: ErrorType, data: ApiLog) {
        const { wxAppid, version } = Log.options;
        if (!data.isVaild) {
            return;
        }
        this.logs.push({
            rid,
            cat,
            data,
            wxAppid,
            version,
            deviceInfo: wx.getSystemInfoSync()
        });
    }

    // report log
    handelUploadLog() {
        const { logs } = this;
        wx.request({
            url: this.requestUrl,
            data: { logs },
            method: 'post',
            success(resp) {
                console.log(resp);
                this.clearLog();
            },
            fail(err) {
                console.log(err);
            }
        });
    }

    // clear upload success log
    private clearLog() {
        this.logs = [];
    }

    // get network state
    private handelNetworkStatus() {
        wx.getNetworkType({
            success({ networkType }) {
                Log.networkType = networkType;
            },
            fail(err) {
                console.log(err);
            },
        });
        wx.onNetworkStatusChange(({ isConnected, networkType }) => {
            Log.networkType = networkType;
            Log.isConnected = isConnected;
        });
    }

}

// mount app event
export function initAppHandel() {
    App({
        onError() { },
        onPageNotFound() { }
    });
}

// mount page event
function initPageHandel() {
    Page({});
}

// mount logger in App
export function createLogger(options: ILoggerOptions) {
    this.logger = new Log(options);
    this.createApiLog = createApiLog;
    this.initPageHandel = initPageHandel;
}
