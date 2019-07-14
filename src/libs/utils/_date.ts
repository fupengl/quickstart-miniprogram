export default {
  /**
   * 格式化时间
   *
   * @param  {time} 时间
   * @param  {cFormat} 格式
   * @return {String} 字符串
   *
   * @example formatTime('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
   */
  formatTime(time: number | Date | string, format: string = '{y}-{m}-{d} {h}:{i}:{s}') {
    if (arguments.length === 0) { return null; }
    if ((time + '').length === 10) {
      time = +time * 1000;
    }

    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      date = new Date(time);
    }

    const formatObj = {
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
      if (key === 'a') { return ['一', '二', '三', '四', '五', '六', '日'][value - 1]; }
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return time_str;
  },

  /**
  * 返回指定长度的月份集合
  *
  * @param  {time} 时间
  * @param  {len} 长度
  * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
  * @return {Array} 数组
  *
  * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
  */
  getMonths(time: number | Date | string, len, direction: number = 3) {
    const mm = new Date(time).getMonth();
    const yy = new Date(time).getFullYear();
    const index = mm;
    function cutMonth(index) {
      if (index <= len && index >= -len) {
        return direction === 1 ? formatPre(index).concat(cutMonth(++index)) :
          direction === 2 ? formatNext(index).concat(cutMonth(++index)) : formatCurr(index).concat(cutMonth(++index));
      }
      return [];
    }

    function formatNext(i) {
      const y = Math.floor(i / 12);
      const m = i % 12;
      return [yy + y + '-' + (m + 1)];
    }

    function formatPre(i) {
      const y = Math.ceil(i / 12);
      let m = i % 12;
      m = m === 0 ? 12 : m;
      return [yy - y + '-' + (13 - m)];
    }

    function formatCurr(i) {
      const y = Math.floor(i / 12);
      const yNext = Math.ceil(i / 12);
      const m = i % 12;
      const mNext = m === 0 ? 12 : m;
      return [yy - yNext + '-' + (13 - mNext), yy + y + '-' + (m + 1)];
    }

    // 数组去重
    function unique(arr) {
      if (Array.hasOwnProperty('from')) {
        return Array.from(new Set(arr));
      } else {
        const r: any[] = [];
        for (const item of arr) {
          if (!r[item]) {
            r.push(item);
          }
        }
        return r;
      }
    }
    return direction !== 3 ? cutMonth(index) : unique(cutMonth(index).sort((t1, t2) => {
      return new Date(t1).getTime() - new Date(t2).getTime();
    }));
  },

  /**
  * 返回指定长度的天数集合
  *
  * @param  {time} 时间
  * @param  {len} 长度
  * @param  {direction} 方向： 1: 前几天;  2: 后几天;  3:前后几天  默认 3
  * @return {Array} 数组
  *
  * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
  */
  getDays(time, len, diretion) {
    const tt = new Date(time);
    function getDay(day: number) {
      const t = new Date(time);
      t.setDate(t.getDate() + day);
      const m = t.getMonth() + 1;
      return t.getFullYear() + '-' + m + '-' + t.getDate();
    }
    const arr: string[] = [];
    if (diretion === 1) {
      for (let i = 1; i <= len; i++) {
        arr.unshift(getDay(-i));
      }
    } else if (diretion === 2) {
      for (let i = 1; i <= len; i++) {
        arr.push(getDay(i));
      }
    } else {
      for (let i = 1; i <= len; i++) {
        arr.unshift(getDay(-i));
      }
      arr.push(tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate());
      for (let i = 1; i <= len; i++) {
        arr.push(getDay(i));
      }
    }
    return diretion === 1 ? arr.concat([tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()]) :
      diretion === 2 ? [tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()].concat(arr) : arr;
  },

  /**
  * @param  {s} 秒数
  * @return {String} 字符串
  *
  * @example formatHMS(3610) // -> 1h0m10s
  */
  formatHMS(s) {
    let str = '';
    if (s > 3600) {
      str = Math.floor(s / 3600) + 'h' + Math.floor(s % 3600 / 60) + 'm' + s % 60 + 's';
    } else if (s > 60) {
      str = Math.floor(s / 60) + 'm' + s % 60 + 's';
    } else {
      str = s % 60 + 's';
    }
    return str;
  },

  /*获取某月有多少天*/
  getMonthOfDay(time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const mouth = date.getMonth() + 1;
    let days;

    // 当月份为二月时，根据闰年还是非闰年判断天数
    if (mouth === 2) {
      days = (year % 4 === 0 && year % 100 === 0 && year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0) ? 28 : 29;
    } else if (mouth === 1 || mouth === 3 || mouth === 5 || mouth === 7 || mouth === 8 || mouth === 10 || mouth === 12) {
      // 月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
      days = 31;
    } else {
      // 其他月份，天数为：30.
      days = 30;
    }
    return days;
  },

  /*获取某年有多少天*/
  getYearOfDay(time) {
    const firstDayYear = this.getFirstDayOfYear(time);
    const lastDayYear = this.getLastDayOfYear(time);
    const numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime()) / 1000;
    return Math.ceil(numSecond / (24 * 3600));
  },

  /*获取某年的第一天*/
  getFirstDayOfYear(time) {
    const year = new Date(time).getFullYear();
    return year + '-01-01 00:00:00';
  },

  /*获取某年最后一天*/
  getLastDayOfYear(time) {
    const year = new Date(time).getFullYear();
    const dateString = year + '-12-01 00:00:00';
    const endDay = this.getMonthOfDay(dateString);
    return year + '-12-' + endDay + ' 23:59:59';
  },

  /*获取某个日期是当年中的第几天*/
  getDayOfYear(time) {
    const firstDayYear = this.getFirstDayOfYear(time);
    const numSecond = (new Date(time).getTime() - new Date(firstDayYear).getTime()) / 1000;
    return Math.ceil(numSecond / (24 * 3600));
  },

  /*获取某个日期在这一年的第几周*/
  getDayOfYearWeek(time) {
    const numdays = this.getDayOfYear(time);
    return Math.ceil(numdays / 7);
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

  /**
   * get x day later's time stamp
   *
   * @param day
   */
  getFewDaysLaterTimeStamp(day: number | string = 0): number {
    const PERDAY = 1 * 24 * 60 * 60 * 1000;
    return new Date().getTime() + PERDAY * (+day);
  },

};
