import api from '../config/api';
import { deepClone, strFormat } from '../utils';

import { HttpService, IRequestExtraConfig, IRequestParams, IUploadFile } from './http';

class BaseService {

    http: HttpService;
    uri: string = '';

    Host = HttpService.getUrl;
    constructor(_uri?: string) {
        if (_uri) {
            this.uri = _uri;
        }
        this.http = new HttpService();
    }

    post(data: any, url: string = '', config: IRequestExtraConfig, header = {}): Promise<any> {
        const req: IRequestParams = {
            url: this._getURI(url),
            method: 'post',
            data,
            header
        };

        return this.http.jsonRequest(req, config);
    }

    get(data: any, url: string = '', config: IRequestExtraConfig, header = {}): Promise<any> {
        const req: IRequestParams = {
            url: this._getURI(url),
            method: 'get',
            data,
            header
        };

        return this.http.jsonRequest(req, config);
    }

    put(data: any, url: string = '', config: IRequestExtraConfig, header = {}): Promise<any> {
        const req: IRequestParams = {
            url: this._getURI(url),
            method: 'put',
            data,
            header
        };

        return this.http.jsonRequest(req, config);
    }

    delete(data: any, url: string = '', config: IRequestExtraConfig, header = {}): Promise<any> {
        const req: IRequestParams = {
            url: this._getURI(url),
            method: 'delete',
            data,
            header
        };

        return this.http.jsonRequest(req, config);
    }

    getUrl(data: any, url: string = '', config: IRequestExtraConfig) {
        return this._getURI(url) + '?data=' + encodeURIComponent(JSON.stringify(data));
    }

    private _getURI(path?: string): string {
        if (path && path.match(/^http/)) {
            return path;
        }
        return this.uri + (path ? '/' + path : '');
    }
}

// tslint:disable-next-line:max-classes-per-file
export default class Service extends BaseService {
    constructor(moduleName: string) {
        super();
        const self: any = this;

        if (!api.hasOwnProperty(moduleName)) {
            console.error('moduleName is not found please add it in file config/api', moduleName);
            return;
        }

        const apis = api[moduleName];
        for (const k of Object.keys(apis)) {
            const item = apis[k];
            self[k] = async (data = {}, params = {}, header = {}): Promise<any> => {
                const config = deepClone(item);
                return self[item.type](data, strFormat(item.url, params), config, Object.assign({}, header, config.headers));
            };
        }
    }
}

export class UploadFileService {
    http: HttpService;
    uri: string = '';
    constructor(_uri?: string) {
        if (_uri) {
            this.uri = _uri;
        }
        this.http = new HttpService();
    }

    upload(data: IUploadFile, url: string = ''): Promise<any> {
        return this.http.fileUpload({
            url: this._getURI(url),
            ...data
        } as IUploadFile);
    }

    private _getURI(path?: string): string {
        return this.uri + (path ? '/' + path : '');
    }
}
