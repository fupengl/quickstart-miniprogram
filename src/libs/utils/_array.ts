export default {
  /**
   * 将数组按照chunklen大小进行分段
   * @param sourceArr Array
   * @param chunkLen number
   */
  chunkArray(sourceArr: any[], chunkLen: number): any[] {
    const res: any[] = [];

    for (let i = 0, len = sourceArr.length; i < len; i += chunkLen) {
      res.push(sourceArr.slice(i, i + chunkLen));
    }

    return res;
  },

  unique(...arr: any[]) {
    return [...new Set([...arr])];
  },

  // 交集
  intersect(arr1: any[], arr2: any[]) {
    return this.unique(arr1).filter(v => arr2.includes(v));
  },

  // 差集
  minus(arr1: any[], arr2: any[]) {
    return this.unique(arr1).filter(v => !arr2.includes(v));
  },

  // 并集
  union(arr1: any[], arr2: any[]) {
    return this.unique(arr1, arr2);
  }

};
