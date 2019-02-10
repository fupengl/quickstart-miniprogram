import t from '@/libs/utils';
import HttpClient from '@/libs/wx/httpClient';

export class BaseService extends HttpClient {
  constructor(prefix: string, apis: IModules = {}) {
    super(prefix);

    const self = this;

    for (const k of Object.keys(apis)) {
      const { isJson = true, isFile = false, ...item } = apis[k];
      self[k] = (data: object = {}, params = {}, header = {}): Promise<any> => {
        const opt: any = t.deepClone(item);
        opt.data = data;
        if (!isFile) {
          if (isJson) {
            return this.jsonRequest(opt, params, header);
          }
          return this.formRequest(opt, params, header);
        }
        return this.upLoadFile(opt, params, header);
      };
    }
  }
}
