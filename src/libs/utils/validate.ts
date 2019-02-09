export default {
  validateMobile(mobile: string): boolean {
    const regexp = /^1[3|4|5|6|7|8|9]\d{9}$/;
    return regexp.test(mobile);
  },
};
