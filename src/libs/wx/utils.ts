/**
 * eg wxPromise(wx.request)
 * @param func 只接收带success fail的api
 */
export function wxPromise(func: (_: any) => void) {
    return (opt: any) => {
        return new Promise((resolve, reject) => {
            func(Object.assign({}, opt, {
                success: data => resolve(data),
                fail: err => reject(err),
            }));
        });
    };
}

/**
 * 格式化字符串
 * @param result 格式化字符串 eg：`user: {name}`
 * @param args 格式化数据 eg： { name："123" }
 */
export const strFormat = (result: string = '', args: any = {}): string => {
    for (const key in args) {
        const reg = new RegExp('({' + key + '})', 'g');
        result = result.replace(reg, args[key]);
    }
    return result;
};

export const MissingError = (...key: string[]) => {
    console.error(`Missing parameters [${key.join(',')}]`);
};
