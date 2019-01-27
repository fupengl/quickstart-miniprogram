// 数据转化
export function formatNumber(n: any) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * num: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
export function formatTime(num: any, format: any) {

  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  const returnArr: any[] = [];

  const date = new Date(num * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (const i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

// 数据脱敏
export const dataMask = (str: string, type: string) => {
  let result;
  switch (type) {
    case 'mobile':
      result = str.substr(0, 3) + '****' + str.substr(7);
      break;
    default:
      break;
  }

  return result;
};

// 价格处理
export const parsePrice = (price: any) => {
  return price / 100;
};

export const countdown = (timeStamp: any) => {
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
    // 若否，就是已经到截止时间了
    return 0;
    // return "end"
  }
};
