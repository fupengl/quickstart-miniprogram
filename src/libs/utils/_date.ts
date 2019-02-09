export default {

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

  /**
   * get x day later's time stamp
   *
   * @param day
   */
  getFewDaysLaterTimeStamp(day: number | string = 0): number {
    const PERDAY = 1 * 24 * 60 * 60 * 1000;
    return new Date().getTime() + PERDAY * (+day);
  },

  countdown (timeStamp: any) {
    const distancetime = new Date(timeStamp * 1000).getTime() - new Date().getTime();
    if (distancetime > 0) {
      // 如果大于0.说明尚未到达截止时间
      let sec: any = Math.floor(distancetime / 1000 % 60);
      let min: any = Math.floor(distancetime / 1000 / 60 % 60);
      let hour: any = Math.floor(distancetime / 1000 / 60 / 60 % 24);
      const day: any = Math.floor(distancetime / 1000 / 60 / 60 / 24);

      if (sec < 10) {
        sec = '0' + sec;
      }
      if (min < 10) {
        min = '0' + min;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }

      if (day === 0) {
        return hour + '小时' + min + '分钟';
      } else {
        return day + '天' + hour + '小时' + min + '分钟';
      }
    } else {
      return 0;
    }
  }

};
