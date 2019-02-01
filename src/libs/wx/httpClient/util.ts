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

type WXCallback = (data: any) => void;

interface IWXCallback {
    success?: WXCallback;
    fail?: WXCallback;
    complete?: WXCallback;
}

interface IWXNetAPIRequest extends IWXCallback {
    url: string;
    data?: object | string;
    header?: object;
    method?: string;
    params?: object;
}
