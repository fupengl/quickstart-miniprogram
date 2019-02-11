/**
 * eg wxPromise(wx.request)
 * @param func 只接收带success fail的api
 */
export function wxPromise(func: (_: any) => void) {
  return (opt?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      func(Object.assign({}, opt, {
        success: data => resolve(data),
        fail: err => reject(err),
      }));
    });
  };
}

/**
 * format string
 * @param str eg：`user: {name}`
 * @param args eg： { name："123" }
 */
export const strFormat = (str: string = '', args: any = {}): string => {
  for (const key in args) {
    const reg = new RegExp('({' + key + '})', 'g');
    str = str.replace(reg, args[key]);
  }
  return str;
};

/**
 * throw error
 * @param keys params Array
 */
export const MissingError = (...keys: string[]) => {
  console.error(`Missing parameters [${keys.join(',')}]`);
};
