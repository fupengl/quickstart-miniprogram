 interface IAnyObject {
  [key: string]: any;
}

 export default {

  generateRequestID(): string {
    let num: number = 0;
    const rando = (m: number): number => {
      let num = '';
      for (let i = 0; i < m; i++) {
        const val = parseInt((Math.random() * 10).toString(), 10);
        if (i === 0 && val === 0) {
          i--;
          continue;
        }
        num += val;
      }
      return parseInt(num, 10);
    };
    if (!getApp().request_id) {
      num = rando(8);
      getApp().request_id = num;
    } else {
      getApp().request_id++;
      num = getApp().request_id;
    }
    return num.toString();
  },

  /**
   * check if userinfo auth is true
   */
  async checkSpecificAuth(key: string): Promise<boolean> {
    try {
      const { authSetting } = await getApp().wxApi.getSetting();
      return authSetting.hasOwnProperty(key);
    } catch (error) {
      return false;
    }
  },

  /**
   * check if userinfo auth is true
   */
  async checkUserInfoAuth(): Promise<boolean> {
    return await this.checkSpecificAuth('scope.userInfo');
  },
};
