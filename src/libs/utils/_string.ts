export default {
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
