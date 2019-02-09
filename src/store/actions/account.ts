export default {
  async login(state: any): Promise<any> {
    const self = getApp() || this;

    if (self.requestLock.count === 1) {
      return await self.requestLock.request;
    }

    self.requestLock.status = true;
    self.requestLock.count++;
    // self.requestLock.request = new Promise(async (resolve, reject) => {
    //   try {
    //     const res = await getApp().wxApi.login();

    //     const { data } = await accountService.Login({
    //       code: res.code
    //     });

    //     self.commit('setToken', data);
    //     resolve(data);
    //   } catch (error) {
    //     showToast({
    //       title: '登陆失败，请稍后再试！'
    //     });
    //     reject(error);
    //   } finally {
    //     self.requestLock.status = false;
    //     self.requestLock.request = null;
    //     self.requestLock.count = 0;
    //   }
    // });

    try {
      return await self.requestLock.request;
    } catch (error) { }
  },

  async reportFormId(state: any, fromId: string = '') {
    console.info('fromId', fromId);
    if (fromId && fromId === 'the formId is a mock one') {
      return;
    }
    const self = getApp() || this;
    // const account: any = self.getter('getAccount');
    // wechatService.AddWxaFormId({
    //     form_id: {
    //         app_id: Conf.APP.config.APP_ID,
    //         openid: account.wechat_id,
    //         account_id: account.account_id,
    //         form_id: fromId
    //     }
    // }).then((result: any) => {
    // }).catch((err: any) => {
    // });
  }
} as wxStore.dispatchFunc;
