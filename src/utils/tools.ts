
type voidFunc = <T>(arg: T) => void;
interface IAnyObject {
  [key: string]: any;
}

export default {

  /**
   * let wx.function use promise
   * @param  {Function} fn [description]
   * @return {Function}    [description]
   */
  wxPromise(fn: (_: any) => any) {
    return (options: any = {}) => {
      return new Promise((resolve: voidFunc, reject: voidFunc) => {
        options.success = (e: any) => { resolve(e); };
        options.fail = (err: any) => { reject(err); };
        fn(options);
      });
    };
  },

  generateRequestID(): string {
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
  },

  checkCanIuse({ apiName, ...options }: {
    apiName: string,
    options: IAnyObject
  }) {
    if (wx[apiName]) {
      wx[apiName](options);
    } else {
      getApp().wxApi.showModal({
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      });
    }
  },

  /**
   * check if userinfo auth is true
   */
  async checkUserInfoAuth(): Promise<boolean> {
    return await getApp().wxApi.getSetting().then(({ authSetting }: any) => {
      return !!authSetting['scope.userInfo'];
    });
  },

  /**
   * check if userinfo auth is true
   */
  async checkSpecificAuth(key: string): Promise<boolean> {
    return await getApp().wxApi.getSetting().then(({ authSetting }: any) => {
      return !!authSetting[key];
    });
  },

  /**
   * 返回 url
   * @param {string} url
   * @param {object} data 描述url需要的query
   */
  getUrlQuery(url: string, data: object = {}) {
    const hasQuery = data instanceof Object && Object.keys(data).length;
    return {
      url: hasQuery ? `${url}?${this.obj2urlquery(data)}` : url
    };
  },

  obj2urlquery(params: object) {
    if (Object.keys(params).length) {
      return Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent((params as any)[key])}`
      ).join('&');
    }
  },

  /**
   * Description: Count a string (mixing English and Chinese characters) length.
   *      A basic and rough function.
   *
   * Performance:
   *      Multiple methods performance test on http://jsperf.com/count-string-length.
   *      You can see that using regexp to check range is very slow from the above test page.
   */
  strLen(str: string) {
    let count = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      count += str.charCodeAt(i) < 256 ? 1 : 2;
    }
    return count;
  },

  strFormat(result: string = '', args: any = {}): string {
    for (const key in args) {
      const reg = new RegExp('({' + key + '})', 'g');
      result = result.replace(reg, args[key]);
    }
    return result;
  },

  deepClone(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(v => {
        if (typeof v === 'object' && v !== null) { return this.deepClone(v); } else { return v; }
      });
    } else {
      const newObj: any = {};

      Object.keys(obj).forEach(v => {
        if (typeof obj[v] === 'object' && obj[v] !== null) {
          newObj[v] = this.deepClone(obj[v]);
        } else {
          newObj[v] = obj[v];
        }
      });

      return newObj;
    }
  },

  getSpecificLengthCharMsg(str: string, maxLength: number) {
    let count = 0;
    let content = '';
    let maxIndex = 0;

    for (let i = 0, len = str.length; i < len; i++) {
      if (count < maxLength) {
        count += str.charCodeAt(i) < 256 ? 1 : 2;
        content += str[i];
        maxIndex = i;
      } else {
        break;
      }
    }
    return { count, content, maxIndex };
  },

  convertToBoolean(input: string): boolean | undefined {
    try {
      return JSON.parse(input);
    } catch (e) {
      return undefined;
    }
  },

  formatDate(timestamp: string | number = new Date().valueOf(), fmt: string = 'yyyy-MM-dd hh:mm:ss'): string {
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
  },

  msToDay(mss: number): string {
    const days = parseInt((mss / (1000 * 60 * 60 * 24)) as any, 10);
    const hours = parseInt(((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) as any, 10);
    const minutes = parseInt(((mss % (1000 * 60 * 60)) / (1000 * 60)) as any, 10);
    const seconds = parseInt(((mss % (1000 * 60)) / 1000) as any, 10);
    let str = '';
    if (days) {
      str += `${days}天`;
    }
    if (hours) {
      str += `${hours}小时`;
    }
    if (minutes) {
      str += `${minutes}分钟`;
    }
    if (seconds) {
      str += `${seconds}秒`;
    } else {
      str += `0秒`;
    }
    return str;
  },

  msToDayObject(mss: number) {
    const oj = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    oj.days = parseInt((mss / (1000 * 60 * 60 * 24)) as any, 10);
    oj.hours = parseInt(((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) as any, 10);
    oj.minutes = parseInt(((mss % (1000 * 60 * 60)) / (1000 * 60)) as any, 10);
    oj.seconds = parseInt(((mss % (1000 * 60)) / 1000) as any, 10);
    return oj;
  },

  padLeftZero(str: string | number): string {
    return ('00' + str).slice(0, -2);
  },

  sliceDecimal(val: number, precision: number) {
    return `${val}`.slice(0, `${val}`.indexOf('.') + 1 + precision);
  },

  /**
   * get x day later's time stamp
   *
   * @param day
   */
  getFewDaysLaterTimeStamp(day: number | string = 0): number {
    const PERDAY = 1 * 24 * 60 * 60 * 1000;
    return new Date().getTime() + PERDAY * (+day);
  },

  /**
   * Returns a function, that, as long as it continues to be invoked, will not be triggered.
   * The function will be called after it stops being called for N milliseconds.
   *
   * @param {Function} func need debounce's function
   * @param {Number} wait milliseconds
   */
  debounce(func: (e: any) => any, wait: number) {
    let timer: any;

    // need function
    return function (args: any) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        timer = null;
        func.call(this, args);
      }, wait);
    };
  },

  /**
   * 将数组按照chunklen大小进行分段
   * @param sourceArr Array
   * @param chunkLen number
   */
  chunkArray(sourceArr: any[], chunkLen: number): any[] {
    const res = [];

    for (let i = 0, len = sourceArr.length; i < len; i += chunkLen) {
      // @ts-ignore
      res.push(sourceArr.slice(i, i + chunkLen));
    }

    return res;
  },

  validateMobile(phone: string): boolean {
    const regexp = /^1[3|4|5|6|7|8|9]\d{9}$/;
    return regexp.test(phone);
  },
};
