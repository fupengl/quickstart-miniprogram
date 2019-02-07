
import { MissingError } from '@/libs/wx/utils';
import ApiLog from './apiLog';

// rid type
enum LogType {
  SLOW_API = 'slow_api',
  ERROR_API = 'error_api',
  SCRIPT_ERROR = 'js_error',
  PAGE_ERROR = 'page_error',
  DEVICE_ERROR = 'device_error'
}

// cat type
enum ErrorType {
  JS_ERROR = 'term_report',
  API_ERROR = 'term_report',
  NETWORK_ERROR = 'term_report'
}

interface IAppInfo {
  version: string; // app version
  wxAppid: string; // wx app id
}

// log module options
export interface ILoggerOptions extends IAppInfo {
  getLocation?: boolean; // get user loacation
  statShareApp?: boolean; // capture shareApp
  statApiSpeed?: boolean;
  apiMaxRequestTime?: number;
}

interface IReportData extends IAppInfo {
  rid: LogType;
  cat: ErrorType;
  data: ApiLog | string;
  deviceInfo: wx.GetSystemInfoSyncResult;
}

export class Log {
  static networkType: string;
  static isConnected: boolean = true;

  options: ILoggerOptions = {
    wxAppid: '',
    version: '',
    getLocation: false,
    statApiSpeed: true,
    statShareApp: true,
    apiMaxRequestTime: 300
  };

  logs: IReportData[] = []; // all log
  PageLog: any[] = []; // page event log
  AppLog: ApiLog[] = []; // app event log

  private requestUrl: string = 'https://app.pinquest.cn/api/oss/Report';

  constructor({ wxAppid, version, ...options }: ILoggerOptions) {
    if (!wxAppid || !version) {
      MissingError('wxAppid', 'version');
      return;
    }

    this.options = Object.assign({}, this.options, options);

    this.handleNetworkStatus();
  }

  // add slow api and err log
  createApiLog({ isError, timeCut, ...other }: ApiLog) {
    this.handleNetworkStatus();
    if (timeCut > this.options.apiMaxRequestTime! || !isError) {
      this.createLog(LogType.SLOW_API, ErrorType.API_ERROR, {
        timeCut,
        ...other
      } as ApiLog);
    }
    if (isError) {
      this.createLog(LogType.ERROR_API, ErrorType.API_ERROR, {
        timeCut,
        ...other
      } as ApiLog);
    }
  }

  // add script error
  createScriptLog(err: string) {
    this.createLog(LogType.SCRIPT_ERROR, ErrorType.JS_ERROR, err);
  }

  // add log
  createLog(rid: LogType, cat: ErrorType, data: string | ApiLog) {
    const { wxAppid, version } = this.options;
    this.logs.push({
      rid,
      cat,
      data,
      wxAppid,
      version,
      deviceInfo: wx.getSystemInfoSync()
    });
  }

  // todo review
  // report log
  doReportLog() {
    const self = this;
    const { logs } = this;
    if (!logs.length) {
      return;
    }
    wx.request({
      url: this.requestUrl,
      data: JSON.stringify(logs),
      method: 'POST',
      success(resp) {
        console.log(resp);
        self.clearLog();
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
  private handleNetworkStatus() {
    wx.getNetworkType({
      success({ networkType }) {
        Log.networkType = networkType;
      },
      fail(err) {
        console.log(err);
      },
    });
    wx.onNetworkStatusChange(({ isConnected, networkType }:
      { isConnected: boolean, networkType: string }) => {
      Log.networkType = networkType;
      Log.isConnected = isConnected;
    });
  }

}

// mount log event on APP onLaunch
export function mountLogEvent() {
  wx.onError(err => {
    this.logger.createScriptLog(err);
  });

  wx.onAppHide(() => {
    this.logger.doReportLog();
  });

  wx.onPageNotFound(() => { });
}

// mount logger in App
export function createLogger(options: ILoggerOptions) {
  this.logger = new Log(options);
  mountLogEvent.call(this);
}
