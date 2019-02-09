
import { MissingError } from '@/libs/wx/utils';
import ApiLog from './apiLog';

export class Log {
  static networkType: string;
  static isConnected: boolean = true;

  options: wxLog.ILoggerOptions = {
    wxAppid: '',
    version: '',
    getLocation: false,
    statApiSpeed: true,
    statShareApp: true,
    apiMaxRequestTime: 300
  };

  logs: wxLog.IReportData[] = []; // all log
  PageLog: any[] = []; // page event log
  AppLog: ApiLog[] = []; // app event log

  private requestUrl: string = 'https://app.pinquest.cn/api/oss/Report';

  constructor({ wxAppid, version, ...options }: wxLog.ILoggerOptions) {
    if (!wxAppid || !version) {
      MissingError('wxAppid', 'version');
      return;
    }

    this.options = Object.assign({}, this.options, options, { wxAppid, version });
    console.warn('Log Options', this.options);

    this.handleNetworkStatus();
  }

  // add slow api and err log
  createApiLog({ isError, timeCut, ...other }: ApiLog) {
    this.handleNetworkStatus();
    if (timeCut > this.options.apiMaxRequestTime! || !isError) {
      this.createLog(wxLog.LogType.SLOW_API, wxLog.ErrorType.API_ERROR, {
        timeCut,
        ...other
      } as ApiLog);
    }
    if (isError) {
      this.createLog(wxLog.LogType.ERROR_API, wxLog.ErrorType.API_ERROR, {
        timeCut,
        ...other
      } as ApiLog);
    }
  }

  // add script error
  createScriptLog(err: string) {
    this.createLog(wxLog.LogType.SCRIPT_ERROR, wxLog.ErrorType.JS_ERROR, err);
  }

  // add log
  createLog(rid: wxLog.LogType, cat: wxLog.ErrorType, data: string | ApiLog) {
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
export function createLogger(options: wxLog.ILoggerOptions) {
  this.logger = new Log(options);
  mountLogEvent.call(this);
}
