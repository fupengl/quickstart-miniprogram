import _array from './_array';
import _date from './_date';
import _string from './_string';
import uri from './uri';

export default {
  ..._array,
  ..._date,
  ..._string,
  ...uri,

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

  convertToBoolean(input: string): boolean | undefined {
    try {
      return JSON.parse(input);
    } catch (e) {
      return undefined;
    }
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

};
