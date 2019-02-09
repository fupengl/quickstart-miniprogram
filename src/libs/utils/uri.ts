export default {
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

  obj2urlquery(params: object = {}): string {
    if (Object.keys(params).length) {
      return Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent((params as any)[key])}`
      ).join('&');
    }
    return '';
  },
};
