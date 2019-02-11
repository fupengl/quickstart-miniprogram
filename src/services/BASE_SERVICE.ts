import t from '@/libs/utils';
import HttpClient from '@/libs/wx/httpClient';

export class BaseService extends HttpClient {
  constructor(prefix: string, apis: IApi.module = {}) {
    super(prefix);

    const self = this;
    for (const k of Object.keys(apis)) {
      const { isJson = true, isFile = false, ...item } = apis[k];
      self[k] = (data: object = {}, params = {}, header = {}): Promise<any> => {
        const opt: wxHttpClient.requestOptions = t.deepClone(item);
        opt.data = data;
        opt.header = Object.assign({}, opt.header, header);
        if (!isFile) {
          if (isJson) {
            return this.jsonRequest(opt, params);
          }
          return this.formRequest(opt, params);
        }
        return this.uploadFile(opt, params);
      };
    }
  }
}
