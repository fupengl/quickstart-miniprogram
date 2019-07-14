export default {
  /**
   * 去除空格
   * @param  {str}
   * @param  {type}
   *       type:  1-所有空格  2-前后空格  3-前空格 4-后空格
   * @return {String}
   */
  trim(str, type) {
    type = type || 1;
    switch (type) {
      case 1:
        return str.replace(/\s+/g, '');
      case 2:
        return str.replace(/(^\s*)|(\s*$)/g, '');
      case 3:
        return str.replace(/(^\s*)/g, '');
      case 4:
        return str.replace(/(\s*$)/g, '');
      default:
        return str;
    }
  },

  /**
   * @param  {str}
   * @param  {type}
   *       type:  1:首字母大写  2：首页母小写  3：大小写转换  4：全部大写  5：全部小写
   * @return {String}
   */
  changeCase(str, type) {
    type = type || 4;
    switch (type) {
      case 1:
        return str.replace(/\b\w+\b/g, (word) => {
          return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();

        });
      case 2:
        return str.replace(/\b\w+\b/g, (word) => {
          return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
        });
      case 3:
        return str.split('').map((word) => {
          if (/[a-z]/.test(word)) {
            return word.toUpperCase();
          } else {
            return word.toLowerCase();
          }
        }).join('');
      case 4:
        return str.toUpperCase();
      case 5:
        return str.toLowerCase();
      default:
        return str;
    }
  },

  /*将阿拉伯数字翻译成中文的大写数字*/
  numberToChinese(num) {
    const AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
    const BB = new Array('', '十', '百', '仟', '萬', '億', '点', '');
    const a = ('' + num).replace(/(^0*)/g, '').split('.');
    let k = 0;
    let re = '';
    for (let i = a[0].length - 1; i >= 0; i--) {
      switch (k) {
        case 0:
          re = BB[7] + re;
          break;
        case 4:
          if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$')
            .test(a[0])) {
            re = BB[4] + re;
          }
          break;
        case 8:
          re = BB[5] + re;
          BB[7] = BB[5];
          k = 0;
          break;
        default:
          break;
      }
      if (k % 4 === 2 && +a[0].charAt(i + 2) !== 0 && +a[0].charAt(i + 1) === 0) {
        re = AA[0] + re;
      }
      if (+a[0].charAt(i) !== 0) {
        re = AA[a[0].charAt(i)] + BB[k % 4] + re;
      }
      k++;
    }

    if (a.length > 1) {
      re += BB[6];
      for (let i = 0; i < a[1].length; i++) {
        re += AA[a[1].charAt(i)];
      }
    }
    if (re === '一十') {
      re = '十';
    }
    if (re.match(/^一/) && re.length === 3) {
      re = re.replace('一', '');
    }
    return re;
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

  sliceDecimal(val: number, precision: number) {
    return `${val}`.slice(0, `${val}`.indexOf('.') + 1 + precision);
  },

  dataMask(str: string, type: string) {
    let result;
    switch (type) {
      case 'phone':
        result = str.substr(0, 3) + '****' + str.substr(7);
        break;
      default:
        break;
    }
    return result;
  }

};
