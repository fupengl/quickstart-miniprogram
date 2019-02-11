import Conf from '@C/index';
import { BaseService } from '@S/BASE_SERVICE';

export class Service extends BaseService {
  constructor(apis) {
    super(Conf.APP.config.BASE_API, apis);
    this.interceptors.request.use(async ({ isAuth = true, ...data }) => {
      if (isAuth) {
        try {
          const { token } = await getApp().dispatch('getLoginResp');
          data.header = Object.assign({}, data.header, { 'Cookie': `sid=${token}` });
        } catch (error) {
          getApp().wxApi.showToast({ title: '登录失败' });
          return Promise.reject(error);
        }
      }
      return data;
    });

    this.interceptors.response.use(async ({ data }) => {
      if (data.hasOwnProperty('errcode')) {
        let title = '';
        title = data.errmsg || '系统错误';
        switch (data.errcode) {
          case 0:
            return data.data;
          case -1:
            break;
          case 1002: // not login
            await getApp().dispatch('login');
            break;
          default: { }
        }
        console.error(data);
        getApp().wxApi.showToast({ title });
        return Promise.reject(data);
      }
      return data;
    });
  }
}
