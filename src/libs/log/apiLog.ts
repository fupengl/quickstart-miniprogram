
import { MissingError } from './util';

export default class ApiLog {
    type: string = '';
    requestId: string = '';
    isError: boolean = false;
    requestStart: number = this.getTimeStamp();
    requestEnd: number = 0;
    timeCut: number = 0;
    request: any;
    response: any;
    desc: string = '';
    url: string = '';

    constructor({ type, requestId = '', request, url }:
        { type: string, url: string, requestId?: string, request?: any }) {

        this.type = type;
        this.url = url;
        this.requestId = requestId;
        this.request = request;
    }

    logerRespSuccess(resp) {
        this.requestEnd = this.getTimeStamp();
        this.response = resp;
    }

    logerRespError(resp) {
        this.requestEnd = this.getTimeStamp();
        this.response = resp;
        this.timeCut = this.requestEnd - this.requestStart;
        this.isError = true;
    }

    isVaild(): boolean {
        const { type, url } = this;
        if (!type || !url) {
            return false;
        }
        return true;
    }

    private getTimeStamp(): number {
        return new Date().valueOf();
    }
}

// new api log
export function createApiLog({ url, type, ...other }: ApiLog): ApiLog {
    if (!type || !url) {
        MissingError('type', 'url');
    }
    return new ApiLog({
        url,
        type,
        ...other
    });
}
