import apiLog, { createApiLog } from '@/libs/wx/log/apiLog';
import { strFormat, wxPromise } from '@/libs/wx/utils';

type IFunction = (_: any) => any;

class InterceptorManager {

  static defaultFunc: IFunction = data => data;

  rejected: IFunction = InterceptorManager.defaultFunc; // fail request
  fulfilled: IFunction = InterceptorManager.defaultFunc; // success response

  use(fulfilled: IFunction = InterceptorManager.defaultFunc,
      rejected: IFunction = InterceptorManager.defaultFunc) {
    this.fulfilled = fulfilled;
    this.rejected = rejected;
  }
}

export default class HttpClient {

  interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };

  strFormat = strFormat;

  // host
  protected baseHost: string;
  protected logModel: boolean = true;

  constructor(baseHost: string = '', logModel: boolean = true) {
    this.baseHost = baseHost;
    this.logModel = logModel;
  }

  // parse url (add host and parse uri params)
  getURI(uri: string = '', params: object = {}): string {
    uri = strFormat(uri, params);
    if (uri.match(/^http/)) {
      return uri;
    }

    return uri[0] === '/'
      ? this.baseHost + uri
      : this.baseHost + '/' + uri;
  }

  // json request
  jsonRequest(opt, params: object = {}) {
    opt.header = Object.assign({}, opt.header, {
      'Content-Type': 'application/json; charset=utf-8'
    });
    return this._doRequest(opt, params);
  }

  // formdata request
  formRequest(opt, params: object = {}) {
    opt.header = Object.assign({}, opt.header, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    });
    return this._doRequest(opt, params);
  }

  uploadFile({ data: { filePath, ...data }, name = 'file', ...options }, params: object = {}) {
    const opt: any = options;
    opt.formData = data;
    opt.filePath = filePath;
    opt.name = name;
    opt.url = this.getURI(options.url, params);

    return this._upload(opt);
  }

  private async _upload(opt) {
    try {
      opt = await Promise.resolve(this.interceptors.request.fulfilled(opt));
    } catch (error) {
      return await Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
      wxPromise(wx.uploadFile)(opt).then(async (resp: any) => {
        // uploadFile return json string
        resp.data = JSON.parse(resp.data);
        try {
          resolve(await Promise.resolve(this.interceptors.response.fulfilled(resp)));
        } catch (err) {
          reject(await Promise.resolve(this.interceptors.response.rejected(err)));
        }
      }).catch(async err => {
        reject(await Promise.resolve(this.interceptors.response.rejected(err)));
      });
    });
  }

  private async _doRequest(opt, params: object = {}) {
    this._parseRequestOpt(opt, params);

    if (this.logModel) {
      const log = createApiLog(opt as apiLog);
      try {
        const resp = await this._request(opt);
        log.logerRespSuccess('success');
        return Promise.resolve(resp);
      } catch (error) {
        log.logerRespError(error);
        return Promise.reject(error);
      }
    }

    return this._request(opt);
  }

  // format request params
  private _parseRequestOpt(opt, params: object = {}) {
    opt.url = this.getURI(opt.url, params);
    opt.method = opt.method ? opt.method.toUpperCase() : 'GET';
  }

  // wx request
  private async _request(opt) {
    try {
      opt = await Promise.resolve(this.interceptors.request.fulfilled(opt));
    } catch (error) {
      return await Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
      wxPromise(wx.request)(opt).then(async resp => {
        try {
          resolve(await Promise.resolve(this.interceptors.response.fulfilled(resp)));
        } catch (err) {
          reject(await Promise.resolve(this.interceptors.response.rejected(err)));
        }
      }).catch(async err => {
        reject(await Promise.resolve(this.interceptors.response.rejected(err)));
      });
    });
  }

}
