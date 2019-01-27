export const queryStringfy = (params: object = {}): string => {
    if (Object.keys(params).length) {
        return Object.keys(params).map(key =>
            `${encodeURIComponent(key)}=${encodeURIComponent((params as any)[key])}`
        ).join('&');
    }
    return '';
};

export const formatDate = (timestamp: string | number = new Date().valueOf(), fmt: string = 'yyyy-MM-dd hh:mm:ss'): string => {
    if (typeof timestamp === 'string') {
        timestamp = parseInt(timestamp, 10);
    }
    const date: Date = new Date(timestamp);
    if (date.toString() === 'Invalid Date') {
        return 'Invalid Date';
    }
    const o: any = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };

    const week: any = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay() + '']);
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

export const deepClone = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(v => {
            if (typeof v === 'object' && v !== null) { return deepClone(v); } else { return v; }
        });
    } else {
        const newObj: any = {};

        Object.keys(obj).forEach(v => {
            if (typeof obj[v] === 'object' && obj[v] !== null) {
                newObj[v] = deepClone(obj[v]);
            } else {
                newObj[v] = obj[v];
            }
        });

        return newObj;
    }
};

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

/**
 * 获取字符串英文字符长度
 * @param str
 */
export const strLen = (str: string): number => {
    let count = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        count += str.charCodeAt(i) < 256 ? 1 : 2;
    }
    return count;
};

export function parseTime(time: number | string | Date, cFormat?: string) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date: Date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if (('' + time).length === 10) { time = parseInt(time as string, 10) * 1000; }
        date = new Date((time as string).replace(/-/g, '/'));
    }
    const formatObj: any = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value]; }
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}

export function formatTime(time: number, option?: string) {
    time = +time * 1000;
    const d: any = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前';
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前';
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        );
    }
}

export const validateMobile = (num: string): boolean => {
    const regexp = /^1[3|4|5|6|7|8|9]\d{9}$/;
    return regexp.test(num);
};

// 获取用户是否授权保存到相册 wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum
export const getUserwritePhotosAlbum = async () => {
    return new Promise((resolve) => {
        wx.getSetting({
            complete: (res: any) => {
                console.log(res, '-----auth-------wx.getSetting------');
                let result = false;
                if (res && res.authSetting && res.authSetting['scope.writePhotosAlbum']) {
                    result = true;
                }
                resolve(result);
            }
        });
    });
};
