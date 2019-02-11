import accountService from '@S/accountService';

export default {
  async login(state: any): Promise<any> {

    if (this.requestLock.request) {
      return await this.requestLock.request;
    }

    this.requestLock.status = true;
    this.requestLock.count++;
    this.requestLock.request = new Promise(async (resolve, reject) => {
      try {
        const { code } = await this.wxApi.login();

        const { data } = await accountService.Login({ code });

        this.commit('setToken', data);
        resolve(data);
      } catch (error) {
        console.log(error);
        this.wxApi.showToast({
          title: '登陆失败，请稍后再试！'
        });
        reject(error);
      } finally {
        this.requestLock.status = false;
        this.requestLock.request = null;
        this.requestLock.count = 0;
      }
    });

    try {
      return await this.requestLock.request;
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
