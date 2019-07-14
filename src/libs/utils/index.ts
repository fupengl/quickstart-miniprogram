import _array from './_array';
import _date from './_date';
import _event from './_event';
import _string from './_string';
import uri from './uri';

export default {
  ..._array,
  ..._date,
  ..._string,
  ..._event,
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

};
